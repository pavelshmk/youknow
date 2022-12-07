import json

from django.db.models import Q
from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from bot.__main__ import get_bot
from quiz.models import QuizCategory, Quiz, QuizParticipation, QuizAnswer, Foundation
from quiz.serializers import QuizCategorySerializer, CreateQuizSerializer, QuizSerializer, QuizFullSerializer, \
    SubmitResponseSerializer, FoundationSerializer
from users.common_serializers import UserSerializer
from users.models import AppUser

global_preferences = global_preferences_registry.manager()


class FoundationsView(GenericAPIView):
    serializer_class = FoundationSerializer
    pagination_class = AllowAny,

    def get(self, request: Request, *args, **kwargs):
        return Response(self.get_serializer(instance=Foundation.objects.all(), many=True).data)


class QuizCategoriesView(GenericAPIView):
    serializer_class = QuizCategorySerializer
    permission_classes = AllowAny,

    def get(self, request: Request, *args, **kwargs):
        return Response(self.get_serializer(instance=QuizCategory.objects.all(), many=True).data)


class CreateQuizView(GenericAPIView):
    serializer_class = CreateQuizSerializer
    permission_classes = IsAuthenticated,

    def post(self, request: Request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data['sponsor'] > request.user.balance:
            return Response({'status': 'error', 'message': 'insufficient_funds_sponsor'}, status=402)
        request.user.balance -= serializer.validated_data['sponsor']
        request.user.save(update_fields=('balance',))
        quiz = serializer.save(bank=serializer.validated_data['sponsor'])
        return Response(QuizSerializer(instance=quiz).data)


class QuizListView(GenericAPIView):
    serializer_class = QuizSerializer
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        qs = Quiz.objects.all()

        if 'all' not in request.query_params:
            qs = qs.filter(started__isnull=True)

        def get_param(name):
            return name in request.query_params and request.query_params[name]

        if get_param('category'):
            qs = qs.filter(category_id=get_param('category'))
        if get_param('search'):
            words = get_param('search').replace('#', '').split()
            if words:
                q = Q(title__icontains=words[0]) | Q(description__icontains=words[0])
                for word in words[1:]:
                    q &= Q(title__icontains=word) | Q(description__icontains=word)
                qs = qs.filter(q)
        if get_param('price_start'):
            qs = qs.filter(entry_price__gte=get_param('price_start'))
        if get_param('price_end'):
            qs = qs.filter(entry_price__lte=get_param('price_end'))
        if get_param('bank_start'):
            qs = qs.filter(bank__gte=get_param('bank_start'))
        if get_param('bank_end'):
            qs = qs.filter(bank__lte=get_param('bank_end'))
        qs = qs.order_by('-pk')
        return Response(QuizSerializer(instance=qs, many=True).data)


class QuizDetailView(GenericAPIView):
    serializer_class = QuizFullSerializer
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        q = Quiz.objects.filter(pk=kwargs['pk']).first()
        if not q:
            return Response({'status': 'error', 'message': 'not_found'}, status=404)
        return Response(self.get_serializer(instance=q).data)

    def delete(self, request: Request, *args, **kwargs):
        q = Quiz.objects.filter(pk=kwargs['pk'], owner=request.user, creator=request.user).first()
        if not q:
            return Response({'status': 'error', 'message': 'not_found'}, status=404)
        q.deleted = True
        q.save()
        return Response(self.get_serializer(instance=q).data)


class QuizParticipateView(GenericAPIView):
    serializer_class = QuizFullSerializer
    permission_classes = IsAuthenticated,

    def post(self, request: Request, *args, **kwargs):
        quiz = Quiz.objects.filter(pk=kwargs['pk']).first()  # type: Quiz
        if not quiz:
            return Response({'status': 'error', 'message': 'not_found'}, status=404)
        block_reason = quiz.block_reason(request.user)
        if block_reason:
            return Response({'status': 'error', 'message': block_reason}, status=409)

        request.user.balance -= quiz.entry_price
        request.user.save()
        referrer = None
        if 'ref' in request.query_params:
            try:
                referrer = AppUser.objects.get(pk=request.query_params['ref'])
            except AppUser.DoesNotExist:
                pass
        QuizParticipation.objects.create(user=request.user, quiz=quiz, referrer=referrer, is_mobile=True)
        quiz.bank += quiz.entry_price * (1 - global_preferences['general__quiz_bank_commission'] -
                                         global_preferences['general__quiz_author_commission'])
        quiz.author_commission += quiz.entry_price * global_preferences['general__quiz_author_commission']
        quiz.save()
        return Response(self.get_serializer(instance=quiz).data)


class MyQuizzesView(GenericAPIView):
    serializer_class = QuizSerializer
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        return Response({
            'creator': QuizSerializer(
                instance=Quiz.objects.filter(creator=request.user, owner=request.user).order_by('-pk'),
                many=True
            ).data,
            'owner': QuizSerializer(
                instance=Quiz.objects.filter(owner=request.user).order_by('-pk'),
                many=True
            ).data,
            'future': QuizSerializer(
                instance=Quiz.objects.filter(participations__user=request.user, started__isnull=True).order_by('-pk'),
                many=True
            ).data,
            'current': QuizSerializer(
                instance=Quiz.objects.filter(participations__user=request.user,
                                             started__isnull=False, finished__isnull=True).order_by('-pk'),
                many=True
            ).data,
        })


class RequestQuestionView(GenericAPIView):
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        try:
            quiz = Quiz.objects.get(pk=kwargs['pk'])
            participation = quiz.participations.get(user=request.user)  # type: QuizParticipation
        except (Quiz.DoesNotExist, QuizParticipation.DoesNotExist):
            return Response({'status': 'error', 'message': 'not_found'}, status=404)

        question, option_texts, option_ids = participation.next_question(False)
        resp = {
            'question': {
                'pk': question.pk,
                'text': question.text,
                'options': [{'pk': o[0], 'text': o[1]} for o in zip(option_ids, option_texts)],
                'image': question.image,
            } if question else None,
            'finish_time': quiz.end_time.isoformat(),
            'total_questions': quiz.questions.count(),
            'questions_left': len(json.loads(participation.questions_order)),
            'players': quiz.players,
            'players_finished': quiz.participations.filter(questions_order__in=['[]', '']).count(),
            'finished': bool(quiz.finished),
        }
        return Response(resp)

    def post(self, request: Request, *args, **kwargs):
        try:
            quiz = Quiz.objects.get(pk=kwargs['pk'])
            participation = quiz.participations.get(user=request.user)  # type: QuizParticipation
        except (Quiz.DoesNotExist, QuizParticipation.DoesNotExist):
            return Response({'status': 'error', 'message': 'not_found'}, status=404)

        serializer = SubmitResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question, option_texts, option_ids = participation.next_question(True)
        answer = QuizAnswer.objects.create(participation=participation, question=question,
                                           option_id=serializer.validated_data['response'])
        if answer.option.is_correct:
            participation.answer_points += 1
            participation.save()

        if participation.questions_order in ['', '[]']:
            participation.time_points = int((timezone.now() - participation.quiz.started).total_seconds())
            participation.save()
            quiz.try_finish(get_bot())

        return self.get(request, *args, **kwargs)


class QuizResultsView(GenericAPIView):
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        try:
            quiz = Quiz.objects.get(pk=kwargs['pk'])
            participation = quiz.participations.get(user=request.user)  # type: QuizParticipation
        except (Quiz.DoesNotExist, QuizParticipation.DoesNotExist):
            return Response({'status': 'error', 'message': 'not_found'}, status=404)
        if not quiz.finished:
            return Response({'status': 'error', 'message': 'not_found'}, status=404)

        answers = []
        for answer in participation.answers.all():  # type: QuizAnswer
            question = answer.question
            answers.append({
                'question': question.text,
                'answer': answer.option.text,
                'is_correct': answer.option.is_correct,
                'correct': question.options.get(is_correct=True).text,
                'correct_comment': question.options.get(is_correct=True).comment,
            })
        return Response({
            'place': participation.place,
            'win': participation.win,
            'ranking': [{
                'user': UserSerializer(p.user).data,
                'points': p.answer_points,
                'time': p.time_points
            } for p in quiz.participations.order_by('place')],
            'answers': answers
        })
