import json
from random import shuffle

import requests
from django.core.cache import cache
from django.db import models
from django.db.models import Q
from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry
from telegram import Bot, ParseMode
from telegram.error import BadRequest

from users.models import AppUser, BalanceEvent, BalanceEventType

global_preferences = global_preferences_registry.manager()


class Foundation(models.Model):
    title = models.CharField(max_length=64)

    def __str__(self):
        return self.title


class QuizCategory(models.Model):
    title = models.CharField(max_length=64)
    image = models.ImageField(default='category.png')

    def __str__(self):
        return self.title

    @property
    def count(self):
        return self.quizzes.filter(started__isnull=True).count()


class Quiz(models.Model):
    creator = models.ForeignKey(AppUser, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='created_quizzes')
    owner = models.ForeignKey(AppUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='quizzes')
    category = models.ForeignKey(QuizCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='quizzes')
    title = models.CharField(max_length=128)
    description = models.TextField()
    entry_price = models.DecimalField(max_digits=32, decimal_places=2)
    delay_minutes = models.PositiveIntegerField(default=10)
    start_players = models.PositiveIntegerField(null=True, blank=True)
    start_datetime = models.DateTimeField(null=True, blank=True)
    max_length = models.DurationField(null=True, blank=True)
    bank = models.DecimalField(max_digits=32, decimal_places=2, default=0)
    author_commission = models.DecimalField(max_digits=32, decimal_places=2, default=0)
    started = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    finished = models.DateTimeField(null=True, blank=True)
    copy_source = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    notified = models.BooleanField(default=False)
    foundation = models.ForeignKey(Foundation, on_delete=models.SET_NULL, null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def notify(self, bot, message):
        expo_push_tokens = []
        for participation in self.participations.all():  # type: QuizParticipation
            if participation.is_mobile:
                for app_token in participation.user.tokens.filter(push_token__isnull=False):
                    if app_token.push_token:
                        expo_push_tokens.append(app_token.push_token)
            else:
                try:
                    bot.send_message(participation.user.telegram_id, message)
                except BadRequest:
                    pass
        if expo_push_tokens:
            requests.post('https://exp.host/--/api/v2/push/send', json={
                'to': expo_push_tokens,
                'title': 'UKnow',
                'body': message,
            })

    def start(self, bot):
        cache_key = 'q{}starting'.format(self.pk)
        if cache.get(cache_key):
            return
        cache.set(cache_key, 1)
        cache.delete('q{}finishing'.format(self.pk))
        self.started = timezone.now()
        self.end_time = timezone.now() + self.max_length
        question_ids = list(self.questions.values_list('pk', flat=True))
        expo_push_tokens = []
        for participation in self.participations.all():  # type: QuizParticipation
            shuffle(question_ids)
            participation.questions_order = json.dumps(question_ids)
            participation.save()
            if participation.is_mobile:
                for app_token in participation.user.tokens.filter(push_token__isnull=False):
                    if app_token.push_token:
                        expo_push_tokens.append(app_token.push_token)
            else:
                participation.send_tg_poll(bot)
        self.save()
        cache.delete(cache_key)
        if expo_push_tokens:
            requests.post('https://exp.host/--/api/v2/push/send', json={
                'to': expo_push_tokens,
                'title': 'UKnow',
                'body': 'Викторина "{}" началась'.format(self.title),
                'data': {
                    'action': 'quiz',
                    'pk': self.pk,
                }
            })

    def try_finish(self, bot: Bot, force=False):
        cache_key = 'q{}finishing'.format(self.pk)
        if not force and self.participations.exclude(questions_order__in=('[]', '')).count() or cache.get(cache_key):
            return
        cache.set(cache_key, 1)
        ranking = list(self.participations.order_by('-answer_points', 'time_points'))
        props = [global_preferences['general__' + p + '_place_proportion'] for p in ['1st', '2nd', '3rd']]
        props = props[:len(ranking)]
        props_sum = sum(props)
        wins = []
        for i, p in enumerate(ranking):
            win = 0
            if i < 3:
                win = p.quiz.bank / props_sum * props[i]
                if p.referrer:
                    ref_bonus = win * global_preferences['general__referral_bonus']
                    p.referrer.balance += ref_bonus
                    p.referrer.save()
                    BalanceEvent.objects.create(user=p.referrer, type=BalanceEventType.REFERRAL, amount=ref_bonus,
                                                quiz=self)
                    win -= ref_bonus
                p.user.balance += win
                p.user.save()
                BalanceEvent.objects.create(user=p.user, type=BalanceEventType.get_for_place(i), amount=win,
                                            quiz=self)
                wins.append(win)
            p.place = i
            p.win = win
            p.save()
            if p.is_mobile:
                continue
            result = []
            for ai, answer in enumerate(p.answers.all(), 1):
                question = answer.question  # type: QuizQuestion
                correct = question.options.get(is_correct=True)
                result.append('{}. {}'.format(ai, question.text))
                if answer.option:
                    if answer.option.is_correct:
                        result.append('✅ {}'.format(answer.option.text))
                        if correct.comment:
                            result.append(correct.comment)
                    else:
                        result.append('❌ {}'.format(answer.option.text))
                        result.append('Верный: {}'.format(correct.text))
                        if correct.comment:
                            result.append(correct.comment)
                else:
                    result.append('❌ Нет ответа')
                    result.append('Верный: {}'.format(question.options.get(is_correct=True).text))
                    if correct.comment:
                        result.append(correct.comment)
                result.append('')
            bot.send_message(p.user.telegram_id, 'Результаты:\n\n' + '\n'.join(result))
        for p in ranking:
            if p.is_mobile:
                continue
            ranking_lines = []
            for i, rp in enumerate(ranking):
                ranking_lines.append(rp.user.name)
                if i < 3:
                    ranking_lines[-1] += ' (выигрыш: {:.2f} руб.)'.format(wins[i])
                if rp.user == p.user:
                    ranking_lines[-1] = '<b>' + ranking_lines[-1] + '</b>'
            bot.send_message(p.user.telegram_id, '\n'.join(ranking_lines), parse_mode=ParseMode.HTML)
        self.finished = timezone.now()
        self.save()
        self.creator.balance += self.author_commission
        self.creator.save()
        BalanceEvent.objects.create(user=self.creator, type=BalanceEventType.CREATOR, amount=self.author_commission,
                                    quiz=self)

    def button_text(self):
        return '👨‍🎓 {} 📚 {} 🎁 {} руб. 💰 {} руб.'.format(self.creator, self.title, self.bank, self.entry_price)

    def copy_button_text(self):
        return '👨‍🎓 {} 📚 {}'.format(self.creator, self.title)

    @property
    def players(self):
        return self.participations.count()

    def block_reason(self, user: AppUser):
        if self.finished:
            return 'already_finished'
        elif self.started:
            return 'already_started'
        elif self.participations.filter(user=user).count():
            return 'already_participating'
        elif self.entry_price > user.balance:
            return 'insufficient_funds'
        # elif self.creator == user:
        #     return 'is_creator'
        elif self.copy_source and QuizParticipation.objects.filter(
                 Q(quiz=self.copy_source) | Q(quiz__copy_source=self.copy_source),
                 user=user
             ).count():
            return 'already_played'

    def block_reason_message(self, user: AppUser):
        block_reason = self.block_reason(user)
        if block_reason:
            return {
                'already_finished': 'Викторина уже закончена',
                'already_started': 'Викторина уже начата',
                'already_participating': 'Вы участвуете в этой викторине',
                'insufficient_funds': 'Недостаточно средств',
                'is_creator': 'Вы создали эту викторину',
                'already_played': 'Вы уже играли в эту викторину',
            }[block_reason]
        return None

    def __str__(self):
        return self.title


class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    image = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.text


class QuizOption(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='options')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    comment = models.TextField(default='', blank=True, null=True)


class QuizParticipation(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='participations')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='participations')
    questions_order = models.TextField()
    place = models.PositiveIntegerField(null=True, blank=True)
    win = models.DecimalField(max_digits=32, decimal_places=2, null=True, blank=True)
    referrer = models.ForeignKey(AppUser, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='referral_participations')
    answer_points = models.BigIntegerField(default=0)
    time_points = models.BigIntegerField(default=0)
    is_mobile = models.BooleanField(default=False)

    def next_question(self, shift=True):
        question_ids = json.loads(self.questions_order)
        if not question_ids:
            return None, None, None
        if shift:
            self.questions_order = json.dumps(question_ids[1:])
            self.save()
        question = QuizQuestion.objects.get(pk=question_ids[0])
        options = list(question.options.all())
        shuffle(options)
        option_ids = []
        option_texts = []
        for i, option in enumerate(options):
            option_ids.append(option.pk)
            option_texts.append(option.text)
        return question, option_texts, option_ids

    def send_tg_poll(self, bot: Bot):
        question, option_texts, option_ids = self.next_question()
        if not question:
            return None
        m = bot.send_poll(self.user.telegram_id, question.text, option_texts, is_anonymous=False)
        QuizAnswer.objects.create(participation=self, tg_poll_id=m.poll.id, option_ids=json.dumps(option_ids),
                                  question=question)
        return question.pk


class QuizAnswer(models.Model):
    participation = models.ForeignKey(QuizParticipation, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    option = models.ForeignKey(QuizOption, on_delete=models.CASCADE, related_name='answers', null=True, blank=True)
    option_ids = models.TextField(null=True, blank=True)
    tg_poll_id = models.BigIntegerField(null=True, blank=True, db_index=True)
