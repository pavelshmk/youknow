import React from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	Image,
	TouchableOpacity,
	SafeAreaView,
	ImageBackground, Platform,
} from 'react-native';
import Header from '../../../components/Header';
import BackButton from '../../../components/BackButton';
import ParticipationHistoryBlock from '../../../components/ParticipationHistoryBlock';
import Logo from '../../../components/Logo';
// import AboutQuizFull from '../../../components/AboutQuizFull';
import DescriptionBlock from '../../../components/DescriptionBlock';
import { inject, observer } from "mobx-react";
import { ISettingsNavigationStoreProps } from "../../../types";

const { width } = Dimensions.get('window');

@inject('settingsStore')
@observer
export default class FundInfo extends React.Component<ISettingsNavigationStoreProps> {
	static defaultProps = {} as ISettingsNavigationStoreProps;

	state = {
		isModalVisible: false,
	};

	toggleModal = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible });
	};

	toggleModal1 = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible });
		this.props.navigation.navigate('Question');
	};

	render() {
		return (
			<View
				style={{ flex: 1, backgroundColor: this.props.settingsStore.theme.colors.gradient, alignItems: 'center' }}
			>
				<SafeAreaView>
					<View style={{ backgroundColor: this.props.settingsStore.theme.colors.gradient }}>

							<ImageBackground
								blurRadius={10}
								resizeMode={'cover'}
								style={{
									height: 231,
									width: width,
									marginBottom: 15,
									paddingLeft: 15,
									paddingRight: 15,
								}}
								imageStyle={{ borderBottomRightRadius: 35, borderBottomLeftRadius: 35 }}
								source={require('../../../assets/icons/bg.png')}
							>
								<View style={{ marginBottom: 10, flexDirection: 'row' }}>
									<Header
										left={
											<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
												<View style={{ width: 60, height: 50, top:10 }}>
													<BackButton onPress={() => this.props.navigation.goBack()}/>
												</View>
											</TouchableOpacity>
										}
										center={<Logo />}
									/>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flex: 1 }}>
										{/*<Image
											source={require('../../../assets/icons/avatar6.png')}
											style={{ width: 70, height: 70, bottom: 5 }}
										/>*/}
									</View>
									<View style={{ flex: 3 }}>
										<View style={{ flexDirection: 'row', marginBottom: 5 }}>
											<Text
												style={{
													fontSize: 24,
													lineHeight: 29,
													color: '#fff',
													fontWeight: 'bold',
												}}
											>
												Подари жизнь
											</Text>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														fontSize: 16,
														lineHeight: 20,
														color: '#fff',
														fontWeight: '600',
													}}
												>
													До 15%
												</Text>
											</View>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														fontSize: 16,
														lineHeight: 20,
														color: '#fff',
														fontWeight: '600',
													}}
												>
													1500000 руб.
												</Text>
											</View>
										</View>
										<View style={{ flexDirection: 'row' }}>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														fontSize: 13,
														lineHeight: 16,
														color: '#DADADA',
														fontWeight: '500',
													}}
												>
													отчисления
												</Text>
											</View>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														fontSize: 13,
														lineHeight: 16,
														color: '#DADADA',
														fontWeight: '500',
													}}
												>
													собрано
												</Text>
											</View>
										</View>
									</View>
								</View>
							</ImageBackground>
							<ScrollView>
							<Text
								style={{
									fontSize: 16,
									color: '#898F97',
									marginBottom: 20,
									marginLeft: 15,
								}}
							>
								Описание
							</Text>
							<DescriptionBlock description="Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia non consectetur culpa velit esse. Nisi labore consequat tempor esse amet" />
							<View style={{ width: width - 30, alignSelf: 'center', marginBottom: 15 }}>
								<Text style={{ fontSize: 16, color: '#898F97', marginBottom: 20 }}>
									На что собирается
								</Text>
								{/*<ParticipationHistoryBlock name="Вакцина от короновируса" sum="250 0000 руб." />*/}
								{/*<ParticipationHistoryBlock name="Вакцина от короновируса" sum="250 0000 руб." />*/}
								{/*<ParticipationHistoryBlock name="Вакцина от короновируса" sum="250 0000 руб." />*/}
								{/*<ParticipationHistoryBlock name="Вакцина от короновируса" sum="250 0000 руб." />*/}
							</View>
							<Text style={{ fontSize: 16, color: '#898F97', marginBottom: 20, marginLeft: 15 }}>
								На что собирается
							</Text>
							<View style={{ marginBottom: 55 }}>
								{/*<AboutQuizFull onPress={() => this.props.navigation.navigate('QuizInfo')} />*/}
							</View>
						</ScrollView>
					</View>
				</SafeAreaView>
			</View>
		);
	}
}
