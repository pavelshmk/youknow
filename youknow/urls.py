from django.contrib import admin
from django.urls import path, include

from quiz.views import QuizCategoriesView, CreateQuizView, QuizListView, QuizDetailView, QuizParticipateView, \
    MyQuizzesView, RequestQuestionView, QuizResultsView, FoundationsView
from users.views import PhoneAuthView, PhoneAuthConfirmView, EmailSignInView, EmailSignUpView, EmailSignUpConfirmView, \
    CodesView, ProfileView, ParticipationHistoryView, BalanceEventsView, DepositView, WithdrawView

urlpatterns = [
    path('api/auth/phone/', PhoneAuthView.as_view()),
    path('api/auth/phone/confirm/', PhoneAuthConfirmView.as_view()),
    path('api/auth/email/signin/', EmailSignInView.as_view()),
    path('api/auth/email/signup/', EmailSignUpView.as_view()),
    path('api/auth/email/signup/confirm/', EmailSignUpConfirmView.as_view()),

    path('api/users/profile/', ProfileView.as_view()),
    path('api/users/profile/participations/', ParticipationHistoryView.as_view()),
    path('api/users/balance/', BalanceEventsView.as_view()),
    path('api/users/balance/deposit/', DepositView.as_view()),
    path('api/users/balance/withdraw/', WithdrawView.as_view()),

    path('api/quiz/', QuizListView.as_view()),
    path('api/quiz/<int:pk>/', QuizDetailView.as_view()),
    path('api/quiz/<int:pk>/questions/', RequestQuestionView.as_view()),
    path('api/quiz/<int:pk>/participate/', QuizParticipateView.as_view()),
    path('api/quiz/<int:pk>/results/', QuizResultsView.as_view()),
    path('api/quiz/categories/', QuizCategoriesView.as_view()),
    path('api/quiz/foundations/', FoundationsView.as_view()),
    path('api/quiz/create/', CreateQuizView.as_view()),
    path('api/quiz/my/', MyQuizzesView.as_view()),

    path('codes/', CodesView.as_view()),
    path('admin/', admin.site.urls),
    path('_nested_admin/', include('nested_admin.urls')),
]
