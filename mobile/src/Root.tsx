import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StatusBar, ViewStyle, Linking, Platform, Vibration } from 'react-native';
import { Linking as ExpoLinking, Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { EventSubscription } from 'fbemitter';

import MainPage from './screens/Main/MainPage/MainPage';
import SignUp from './screens/Auth/SignUp/SignUp';
import SignIn from './screens/Auth/SignIn/SignIn';
import Code from './screens/Auth/Code/Code';
import CodeEmail from './screens/Auth/CodeEmail/CodeEmail';
import ForgotPassword from './screens/Auth/ForgotPassword/ForgotPassword';
import CreateQuiz from './screens/Main/CreateQuiz/CreateQuiz';
import FinishCreate from './screens/Main/FinishCreate/FinishCreate';
import Filters from './screens/Main/Filters/Filters';
import QuizInfo from './screens/Main/QuizInfo/QuizInfo';
import FundInfo from './screens/Main/FundInfo/FundInfo';
import Question from './screens/MyQuizzes/Question/Question';
import FinishResults from './screens/MyQuizzes/FinishResults/FinishResults';
import FinishWaiting from './screens/MyQuizzes/FinishWaiting/FinishWaiting';
import FinishRanking from './screens/MyQuizzes/FinishRanking/FinishRanking';
import QuizzesList from './screens/Main/QuizzesList/QuizzesList';
import MyQuiz from './screens/MyQuizzes/MyQuiz/MyQuiz';
import Achievements from './screens/Achives/Achievements/Achievements';
import Profile from './screens/Profile/Profile/Profile';
import Achievement from './screens/Achives/Achievement/Achievement';
import BalanceHistory from './screens/Profile/BalanceHistory/BalanceHistory';
import ParticipationHistory from './screens/Profile/ParticipationHistory/ParticipationHistory';
import Help from './screens/Profile/Help/Help';
import Settings from './screens/Profile/Settings/Settings';
import FinishAnswers from './screens/MyQuizzes/FinishAnswers/FinishAnswers';

import { inject, observer } from "mobx-react";
import { IAuthStoreProps, INavigationStoreProps } from "./types";
import { IFullQuiz, IQuiz, IQuizFilters, IQuizResultsResponse } from "./api";
import { Notification } from "expo/build/Notifications/Notifications.types";

export type ParamList = {
	Tabs: undefined;
	SignUp: { isEmail?: number };
	SignIn: { isEmail?: number };
	Code: undefined;
	CodeEmail: undefined;
	ForgotPassword: undefined;
	MainPage: undefined;
	CreateQuiz: { copy?: IFullQuiz, edit?: IFullQuiz };
	FinishCreate: { quiz: IQuiz };
	Filters: { filters?: IQuizFilters };
	QuizInfo: { pk: number, ref?: number };
	FundInfo: undefined;
	Question: { quiz: number };
	FinishResults: { quiz: number };
	FinishWaiting: { quiz: number };
	FinishRanking: { response: IQuizResultsResponse };
	FinishAnswers: { response: IQuizResultsResponse };
	QuizzesList: { filters: IQuizFilters };
	Achievement: undefined;
	BalanceHistory: undefined;
	ParticipationHistory: undefined;
	Help: undefined;
	Settings: undefined;
	Participants: undefined;
	MyQuiz: undefined;
	Achievements: undefined;
	Profile: undefined;

	MainTabs: undefined;
	AuthStack: undefined;

	MainScreen: undefined;
	MyQuizzesScreen: any;
	AchievementsScreen: undefined;
	ProfileScreen: undefined;
}

const AuthStack = createStackNavigator<ParamList>();
const MainStack = createStackNavigator<ParamList>();
const MyQuizzesStack = createStackNavigator<ParamList>();
const AchievementsStack = createStackNavigator<ParamList>();
const ProfileStack = createStackNavigator<ParamList>();
const Tabs = createBottomTabNavigator<ParamList>();

const tabIcons = {
	home: [require('./assets/icons/home.png'), require('./assets/icons/active_home.png')],
	quiz: [require('./assets/icons/quiz.png'), require('./assets/icons/active_quiz.png')],
	achive: [require('./assets/icons/achive.png'), require('./assets/icons/active_achive.png')],
	profile: [require('./assets/icons/profile.png'), require('./assets/icons/active_profile.png')],
};

function getIcon(base: string) {
	return function({ focused }) {
		return (
			<Image
				source={tabIcons[base][focused ? 1 : 0]}
				style={{ width: 25, height: 25, bottom: 10 }}
			/>
		)
	}
}

function AuthStackScreen() {
	return (
		<AuthStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<AuthStack.Screen name="SignUp" component={SignUp} />
			<AuthStack.Screen name="SignIn" component={SignIn} />
			<AuthStack.Screen name="Code" component={Code} />
			<AuthStack.Screen name="CodeEmail" component={CodeEmail} />
			<AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
		</AuthStack.Navigator>
	)
}

function MainScreen() {
	return (
		<MainStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<MainStack.Screen name="MainPage" component={MainPage} />
			<MainStack.Screen name="FundInfo" component={FundInfo} />
			<MainStack.Screen name="QuizzesList" component={QuizzesList} />
			<MainStack.Screen name="Filters" component={Filters} />

			<MainStack.Screen name="QuizInfo" component={QuizInfo} />
			<MainStack.Screen name="CreateQuiz" component={CreateQuiz} />
			<MainStack.Screen name="FinishCreate" component={FinishCreate} />
		</MainStack.Navigator>
	)
}

function MyQuizzesScreen() {
	return (
		<MyQuizzesStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<MyQuizzesStack.Screen name="MyQuiz" component={MyQuiz} />
			<MyQuizzesStack.Screen name="Question" component={Question} />
			<MyQuizzesStack.Screen name="FinishWaiting" component={FinishWaiting} />
			<MyQuizzesStack.Screen name="FinishResults" component={FinishResults} />
			<MyQuizzesStack.Screen name="FinishRanking" component={FinishRanking} />
			<MyQuizzesStack.Screen name="FinishAnswers" component={FinishAnswers} />

			<MyQuizzesStack.Screen name="QuizInfo" component={QuizInfo} />
			<MyQuizzesStack.Screen name="CreateQuiz" component={CreateQuiz} />
			<MyQuizzesStack.Screen name="FinishCreate" component={FinishCreate} />
		</MyQuizzesStack.Navigator>
	);
}

function AchievementsScreen() {
	return (
		<AchievementsStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<AchievementsStack.Screen name="Achievements" component={Achievements} />
			<AchievementsStack.Screen name="Achievement" component={Achievement} />
		</AchievementsStack.Navigator>
	);
}

function ProfileScreen() {
	return (
		<ProfileStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<ProfileStack.Screen name="Profile" component={Profile} />
			<ProfileStack.Screen name="BalanceHistory" component={BalanceHistory} />
			<ProfileStack.Screen name="ParticipationHistory" component={ParticipationHistory} />
			<ProfileStack.Screen name="Settings" component={Settings} />
			<ProfileStack.Screen name="Help" component={Help} />
		</ProfileStack.Navigator>
	)
}

function MainTabsScreen() {
	return (
		<Tabs.Navigator
			tabBarOptions={{
				style: {
					backgroundColor: '#060A10',
					padding: 15,
					height: 54,
					zIndex: 8,
					borderTopColor: '#060A10',
					borderTopWidth: 0.3
				} as ViewStyle,
				showLabel: false,
			}}
		>
			<Tabs.Screen name='MainScreen' component={MainScreen} options={{ tabBarIcon: getIcon('home') }} />
			<Tabs.Screen name='MyQuizzesScreen' component={MyQuizzesScreen} options={{ tabBarIcon: getIcon('quiz') }} />
			<Tabs.Screen name='AchievementsScreen' component={AchievementsScreen} options={{ tabBarIcon: getIcon('achive') }} />
			<Tabs.Screen name='ProfileScreen' component={ProfileScreen} options={{ tabBarIcon: getIcon('profile') }} />
		</Tabs.Navigator>
	)
}

interface IRootProps extends INavigationStoreProps, IAuthStoreProps { }

@inject('navigationStore', 'authStore')
@observer
export default class Root extends React.Component<IRootProps> {
	static defaultProps = {} as IRootProps;
	private _notificationSubscription: EventSubscription;

	async componentDidMount() {
		this.registerForPushNotificationsAsync();
   	 	this._notificationSubscription = Notifications.addListener(this._handleNotification);
		Linking.addEventListener('url', this.handleLinking);
		const url = await Linking.getInitialURL();
		if (url) {
			this.handleLinking({ url });
		}
	}

	handleLinking = (event: { url: string }) => {
		console.log(event.url);
		const { path, queryParams } = ExpoLinking.parse(event.url);
		if (this.props.authStore.token) {
			if (path == 'quiz') {
				let { pk, ref } = queryParams;
				if (parseInt(pk)) {
					this.props.navigationStore.ref.navigate('MainScreen', {
						screen: 'QuizInfo',
						params: {
							pk: parseInt(pk),
							ref: parseInt(ref) || undefined,
						}
					});
				}
			}
		}
	};

	registerForPushNotificationsAsync = async () => {
		if (Constants.isDevice) {
		  	const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		  	let finalStatus = existingStatus;
		  	if (existingStatus !== 'granted') {
				const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
				finalStatus = status;
		  	}
		  	if (finalStatus !== 'granted') {
				alert('Failed to get push token for push notification!');
				return;
		 	}
		  	const token = await Notifications.getExpoPushTokenAsync();
		  	console.log('Push token: ', token);
		  	this.props.authStore.setPushToken(token);
		} else {
			alert('Must use physical device for Push Notifications');
		}

		if (Platform.OS === 'android') {
		  	await Notifications.createChannelAndroidAsync('default', {
				name: 'default',
				sound: true,
				priority: 'max',
				vibrate: [0, 250, 250, 250],
		  	});
		}
	};

  	_handleNotification = (notification: Notification) => {
  		if (notification.origin == 'received') {
			Vibration.vibrate([0, 250, 250, 250]);
		} else {
  			console.log(notification);
			if (notification.data?.action == 'quiz') {
				this.props.navigationStore.ref.navigate('MyQuizzesScreen', {
					screen: 'QuizInfo',
					params: {
						pk: notification.data?.pk,
					}
				});
			}
		}
  	};

	render() {
		return (
			<NavigationContainer
				ref={ref => this.props.navigationStore.setRef(ref)}
			>
				<StatusBar barStyle="light-content" />
				{this.props.authStore.token ? <MainTabsScreen/> : <AuthStackScreen/>}
			</NavigationContainer>
		);
	}
}