import React from 'react';
import { View, Text, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import HeaderTitle from '../../../components/HeaderTitle';
import Quit from '../../../components/Quit';
import { INavigationProps } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { ParamList } from "../../../Root";
import api, { IQuizResultsResponse } from "../../../api";
import ruplu from "../../../libs/ruplu";
import BackButton from "../../../components/BackButton";
import Layout from "../../../components/Layout";

const { height, width } = Dimensions.get('window');

interface IProps extends INavigationProps {
	route: RouteProp<ParamList, 'FinishResults'>;
}

interface IState {
	response?: IQuizResultsResponse;
	loading: boolean;
}

export default class FinishResults extends React.Component<IProps, IState> {
	state: IState = {
		loading: false,
	};

	async componentDidMount() {
		this.setState({ loading: true });
		this.setState({ response: await api.quiz.results(this.props.route.params.quiz), loading: false });
	}

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Викторина закончена" />,
				}}
				footer={
					<React.Fragment>
						<Button
							buttonTitle="Результаты"
							onPress={() => this.props.navigation.navigate('FinishRanking', { response: this.state.response })}
							style={{ marginBottom: 10 }}
							block
						/>
						<Button
							buttonTitle="Ответы"
							onPress={() => this.props.navigation.navigate('FinishAnswers', { response: this.state.response })}
							block
						/>
					</React.Fragment>
				}
				loading={this.state.loading}
			>
				<View
					style={{
						width: 204,
						height: 70,
						backgroundColor: '#FEAC5E',
						marginBottom: 15,
						alignSelf: 'center',
						borderTopLeftRadius: 16,
						borderBottomLeftRadius: 16,
						borderTopRightRadius: 16,
						marginTop: '40%',
					}}
				>
					<Text
						style={{
							textAlign: 'center',
							top: 15,
							fontStyle: 'normal',
							fontSize: 32,
							fontWeight: 'bold',
							color: '#19232F',
						}}
					>
						{this.state.response?.place+1}-e место
					</Text>
				</View>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 20,
						fontWeight: 'bold',
						color: '#FFF',
						marginBottom: 10,
						textAlign: 'center',
					}}
				>
					Поздравляем!
				</Text>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 16,
						lineHeight: 20,
						fontWeight: '500',
						color: '#FFF',
						marginBottom: 40,
						textAlign: 'center',
					}}
				>
					Викторина закончена.{'\n'}
					{this.state.response?.win ? (
						<Text>
							Вы выиграли{' '}
							<Text
								style={{
									fontStyle: 'normal',
									fontSize: 16,
									lineHeight: 20,
									fontWeight: 'bold',
									color: '#FEAC5E',
									textAlign: 'center',
								}}
							>
								{this.state.response.win} руб.
							</Text>
						</Text>
					) : null}
				</Text>
				{/*<Text
					style={{
						fontStyle: 'normal',
						fontSize: 13,
						lineHeight: 16,
						fontWeight: '500',
						color: '#898F97',
						textAlign: 'center',
					}}
				>
					Подарки:
				</Text>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 16,
						lineHeight: 20,
						fontWeight: 'bold',
						color: '#FEAC5E',
						textAlign: 'center',
					}}
				>
					Сертификат на покупку техники
				</Text>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 16,
						lineHeight: 20,
						fontWeight: 'bold',
						color: '#FEAC5E',
						textAlign: 'center',
					}}
				>
					Автомобиль
				</Text>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 16,
						lineHeight: 20,
						fontWeight: 'bold',
						color: '#FEAC5E',
						textAlign: 'center',
						marginBottom: 50,
					}}
				>
					Квартира
				</Text>*/}
			</Layout>
		);

		return (
			<View style={{ flex: 1, backgroundColor: '#19232F', alignItems: 'center' }}>
				<SafeAreaView>
					<View style={{ width: width - 30 }}>
						<View style={{ flexDirection: 'row' }}>
							<Header
								left={
									<TouchableOpacity onPress={() => this.props.navigation.navigate('MainPage')}>
										<View style={{ width: 40, height: 35, top: 5 }}>
											<BackButton onPress={() => this.props.navigation.goBack()}/>
										</View>
									</TouchableOpacity>
								}
								center={
									<View style={{ flexDirection: 'row' }}>
										<HeaderTitle title="Викторина закончена" />
									</View>
								}
							/>
						</View>
						<View style={{ marginBottom: height / 9 }} />
						<View
							style={{
								width: 204,
								height: 70,
								backgroundColor: '#FEAC5E',
								marginBottom: 15,
								alignSelf: 'center',
								borderTopLeftRadius: 16,
								borderBottomLeftRadius: 16,
								borderTopRightRadius: 16,
							}}
						>
							<Text
								style={{
									textAlign: 'center',
									top: 15,
									fontStyle: 'normal',
									fontSize: 32,
									fontWeight: 'bold',
									color: '#19232F',
								}}
							>
								{this.state.response?.place+1}-e место
							</Text>
						</View>
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 20,
								fontWeight: 'bold',
								color: '#FFF',
								marginBottom: 10,
								textAlign: 'center',
							}}
						>
							Поздравляем!
						</Text>
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 16,
								lineHeight: 20,
								fontWeight: '500',
								color: '#FFF',
								marginBottom: 40,
								textAlign: 'center',
							}}
						>
							Викторина закончена.{'\n'}
							{this.state.response?.win ? (
								<Text>
									Вы выиграли{' '}
									<Text
										style={{
											fontStyle: 'normal',
											fontSize: 16,
											lineHeight: 20,
											fontWeight: 'bold',
											color: '#FEAC5E',
											textAlign: 'center',
										}}
									>
										{this.state.response.win} руб.
									</Text>
								</Text>
							) : null}
						</Text>
						{/*<Text
							style={{
								fontStyle: 'normal',
								fontSize: 13,
								lineHeight: 16,
								fontWeight: '500',
								color: '#898F97',
								textAlign: 'center',
							}}
						>
							Подарки:
						</Text>
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 16,
								lineHeight: 20,
								fontWeight: 'bold',
								color: '#FEAC5E',
								textAlign: 'center',
							}}
						>
							Сертификат на покупку техники
						</Text>
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 16,
								lineHeight: 20,
								fontWeight: 'bold',
								color: '#FEAC5E',
								textAlign: 'center',
							}}
						>
							Автомобиль
						</Text>
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 16,
								lineHeight: 20,
								fontWeight: 'bold',
								color: '#FEAC5E',
								textAlign: 'center',
								marginBottom: 50,
							}}
						>
							Квартира
						</Text>*/}
						<View style={{ width: width - 30, marginBottom: 20 }}>
							<Button
								buttonTitle="Результаты"
								onPress={() => this.props.navigation.navigate('FinishRanking', { response: this.state.response })}
							/>
							<Button
								buttonTitle="Ответы"
								onPress={() => this.props.navigation.navigate('FinishAnswers', { response: this.state.response })}
							/>
						</View>
					</View>
				</SafeAreaView>
			</View>
		);
	}
}
