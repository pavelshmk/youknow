from datetime import timedelta

from rest_framework.exceptions import ValidationError
from rest_framework.fields import IntegerField, CharField, DecimalField, ListField, SerializerMethodField
from rest_framework.serializers import Serializer, ModelSerializer

from quiz.models import Quiz, QuizParticipation, QuizCategory, QuizQuestion, QuizOption, Foundation
from users.common_serializers import UserSerializer
from youknow.utils import DataURIField


class FoundationSerializer(ModelSerializer):
    class Meta:
        model = Foundation
        fields = 'pk', 'title'


class QuizCategorySerializer(ModelSerializer):
    image = DataURIField()

    class Meta:
        model = QuizCategory
        fields = 'pk', 'title', 'image', 'count',


class QuizSerializer(ModelSerializer):
    category = QuizCategorySerializer()
    creator = UserSerializer()

    class Meta:
        model = Quiz
        fields = 'pk', 'title', 'players', 'category', 'entry_price', 'bank', 'start_players', 'creator', \
                 'start_datetime',


class QuizParticipationSerializer(ModelSerializer):
    quiz = QuizSerializer()
    user = UserSerializer()

    class Meta:
        model = QuizParticipation
        fields = 'pk', 'quiz', 'place', 'win', 'user',


class QuizFullSerializer(ModelSerializer):
    foundation = FoundationSerializer()
    category = QuizCategorySerializer()
    creator = UserSerializer()
    owner = UserSerializer()
    participations = QuizParticipationSerializer(many=True)
    block_reason = SerializerMethodField()
    participating = SerializerMethodField()
    editable = SerializerMethodField()
    questions = SerializerMethodField()

    def get_block_reason(self, obj: Quiz):
        return obj.block_reason(self.context['request'].user)

    def get_participating(self, obj: Quiz):
        return bool(obj.participations.filter(user=self.context['request'].user).count() and obj.started)

    def get_editable(self, obj: Quiz):
        user = self.context['request'].user
        return obj.owner == user and obj.creator == user

    def get_questions(self, obj: Quiz):
        if not self.get_editable(obj):
            return None
        result = []
        for question in obj.questions.all():
            qobj = {
                'text': question.text,
                'image': question.image,
                'options': [],
            }
            for option in question.options.all():
                oobj = {
                    'text': option.text,
                    'comment': option.comment,
                }
                if option.is_correct:
                    qobj['correctOption'] = oobj
                else:
                    qobj['options'].append(oobj)
            result.append(qobj)
        return result

    class Meta:
        model = Quiz
        fields = 'pk', 'title', 'players', 'category', 'entry_price', 'bank', 'start_players', 'creator', 'owner', \
                 'description', 'participations', 'block_reason', 'start_datetime', 'participating', 'editable', \
                 'questions', 'foundation', 'deleted',


class CreateQuizQuestionSerializer(Serializer):
    text = CharField()
    answer = IntegerField()
    options = ListField(child=CharField())
    correct_comment = CharField(allow_blank=True, required=False)
    image = CharField(required=False)


class CreateQuizSerializer(Serializer):
    foundation = IntegerField(required=False)
    category = IntegerField()
    title = CharField()
    description = CharField()
    price = DecimalField(max_digits=32, decimal_places=2)
    minutes = IntegerField()
    players = IntegerField()
    question_length = IntegerField()
    questions = CreateQuizQuestionSerializer(many=True, allow_null=True, required=False)
    sponsor = DecimalField(max_digits=32, decimal_places=2, default=0)
    creator = IntegerField(required=False)
    copy_id = IntegerField(required=False)

    def validate(self, attrs):
        if not attrs.get('questions') and not attrs.get('copy_id'):
            raise ValidationError('`questions` field is required when not copying')
        return attrs

    def create(self, validated_data):
        max_length = timedelta(seconds=validated_data['question_length']) * len(validated_data['questions'])
        max_length += timedelta(minutes=1)

        quiz = Quiz.objects.create(
            creator_id=validated_data.get('creator', self.context['request'].user.pk),
            owner=self.context['request'].user,
            category_id=validated_data['category'],
            title=validated_data['title'],
            description=validated_data['description'],
            entry_price=validated_data['price'],
            delay_minutes=validated_data['minutes'],
            start_players=validated_data['players'],
            max_length=max_length,
            copy_source_id=validated_data.get('copy_id'),
            bank=validated_data['sponsor'],
            foundation_id=validated_data.get('foundation'),
        )
        for question in validated_data['questions']:
            q = QuizQuestion.objects.create(quiz=quiz, text=question['text'], image=question.get('image'))
            for i, option in enumerate(question['options']):
                is_correct = i == question['answer']
                QuizOption.objects.create(question=q, text=option, is_correct=is_correct,
                                          comment=question.get('correct_comment') if is_correct else None)
        return quiz


class SubmitResponseSerializer(Serializer):
    response = IntegerField()
