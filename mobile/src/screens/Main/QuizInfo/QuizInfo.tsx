import React, { ReactNode } from 'react';
import { View, ScrollView, Dimensions, Text, Image, TouchableOpacity, Share } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Header from '../../../components/Header';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import Logo from '../../../components/Logo';
import FindIcon from '../../../components/FindIcon';
import NameBlock from '../../../components/NameBlock';
import DescriptionBlock from '../../../components/DescriptionBlock';
import Modal from 'react-native-modal';
import { inject, observer } from 'mobx-react';
import { IAuthStoreProps, ISettingsNavigationStoreProps } from '../../../types';
import api, { BlockReason, IFullQuiz } from "../../../api";
import { ParamList } from "../../../Root";
import Toast from "react-native-root-toast";
import Layout from "../../../components/Layout";
import SubHeader from "../../../components/SubHeader";
import CountDown from "../../../components/CountDown";

const { width } = Dimensions.get('window');

interface IProps extends ISettingsNavigationStoreProps, IAuthStoreProps {
	route: RouteProp<ParamList, 'QuizInfo'>;
}

interface IState {
	data?: IFullQuiz;
	confirmModalVisible: boolean;
	deleteModalVisible: boolean;
	menuExpanded: boolean;
	loading: boolean;
}

function infoBlock(title: string, text: ReactNode, color: string = '#FEAC5E') {
	return (
		<View style={{ flex: 1, height: 'auto' }}>
			{title.length ? (
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 13,
						lineHeight: 16,
						fontWeight: '500',
						color: '#898F97',
						textAlign: 'left',
					}}
				>
					{title}
				</Text>
			) : null}
			<Text
				style={{
					fontStyle: 'normal',
					fontSize: 13,
					lineHeight: 16,
					fontWeight: '700',
					color,
					textAlign: 'left',
				}}
			>
				{text}
			</Text>
		</View>
	);
}

function buttonTitle(block_reason: string, participating: boolean) {
	switch (block_reason) {
		case "already_finished":
			return participating ? 'Просмотреть результаты' : 'Викторина закончена';
		case "already_started":
			return participating ? 'Перейти к викторине' : 'Викторина уже начата';
		case "already_participating":
			return 'Вы уже участвуете';
		case "insufficient_funds":
			return 'Недостаточно средств';
		case "is_creator":
			return 'Вы создали эту викторину';
		case "already_played":
			return 'Вы уже играли в эту викторину';
	}
	return 'Участвовать';
}

@inject('settingsStore', 'authStore')
@observer
export default class QuizInfo extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;
	refreshInterval: any;

	state: IState = {
		confirmModalVisible: false,
		deleteModalVisible: false,
		menuExpanded: false,
		loading: false
	};

	async componentDidMount() {
		this.props.navigation.addListener('focus', () => {
			this.refreshInterval = setInterval(this.loadDetails, 5000);
			this.loadDetails();
		});
		this.props.navigation.addListener('blur', () => {
			clearInterval(this.refreshInterval);
		});
	}

	loadDetails = async () => {
		this.setState({ data: await api.quiz.details(this.props.route.params.pk) });
	};

	handleButton = async () => {
		if (this.state.data?.participating) {
			this.props.navigation.navigate('MyQuizzesScreen', { screen: 'Question', params: { quiz: this.state.data.pk } });
		} else {
			this.setState({ confirmModalVisible: true });
		}
	};

	handleConfirm = async () => {
		this.setState({ loading: true });
		try {
			this.setState({
				confirmModalVisible: false,
				data: await api.quiz.participate(this.props.route.params.pk)
			});
			Toast.show('Теперь вы участвуете в этой викторине');
		} catch(e) {
			if (e.response?.status === 400) {
				Toast.show('Проверьте правильность введенных данных');
			} else if (e.response?.status === 409) {
				let msg = 'Произошла ошибка, попробуйте позже';
				switch (e.response.data.message as BlockReason) {
					case "is_creator":
						msg = 'Вы являетесь создателем этой викторины'; break;
					case "already_started":
						msg = 'Эта викторина уже начата'; break;
					case "already_finished":
						msg = 'Эта викторина уже закончена'; break;
					case "insufficient_funds":
						msg = 'Недостаточно средств'; break;
					case "already_participating":
						msg = 'Вы уже участвуете в этой викторине'; break;
					case "already_played":
						msg = 'Вы уже играли в эту викторину'; break;
				}
				Toast.show(msg);
				this.loadDetails();
			} else {
				Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
			}
		} finally {
			this.setState({ loading: false });
		}
	};

	handleDelete = async () => {
		this.setState({ loading: true });
		try {
			this.setState({
				deleteModalVisible: false,
				data: await api.quiz.delete(this.props.route.params.pk),
			});
			Toast.show('Викторина теперь не может быть скопирована');
		} catch(e) {
			Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
		} finally {
			this.setState({ loading: false });
		}
	};

	render() {
		const data = this.state.data;

		return (
			<Layout
				loading={!data}
				headerConfig={{ enabled: false }}
				titleStyle={{
					paddingHorizontal: 0,
					backgroundColor: this.props.settingsStore.theme.colors.bg2,
					borderBottomLeftRadius: 35,
					borderBottomRightRadius: 35,
				}}
				title={
					<React.Fragment>
						<Header
							left={<BackButton onPress={() => this.props.navigation.goBack()} />}
							center={<Logo />}
							right={
								<TouchableOpacity>
									<FindIcon />
								</TouchableOpacity>
							}
						/>
						<View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flexShrink: 1, height: 28, marginRight: 10 }}>
									<Image
										source={require('../../../assets/icons/price.png')}
										style={{ width: 20, height: 20, alignSelf: 'center', top: 3 }}
									/>
								</View>
								<View style={{ flexGrow: 1, height: 28 }}>
									<Text
										style={{
											fontStyle: 'normal',
											fontSize: 23,
											lineHeight: 28,
											fontWeight: 'bold',
											color: '#FF3358',
											textAlign: 'left',
										}}
									>
										{data?.entry_price} руб.
									</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flex: 1, height: 'auto' }}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 'bold',
											color: '#FFFFFF',
											textAlign: 'left',
											marginBottom: 10,
										}}
									>
										{data?.title}
									</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', marginBottom: 10 }}>
								{infoBlock('Призовой фонд:', `${data?.bank} руб.`)}
								{infoBlock('Участников:', `${data?.players} из ${data?.start_players}`, 'white')}
							</View>
							<View style={{ flexDirection: 'row', marginBottom: 10 }}>
								{infoBlock('Автор викторины:', data?.creator.name)}
								{infoBlock('Организатор:', data?.owner?.name, 'white')}
							</View>
							{data?.foundation ? (
								<View style={{ flexDirection: 'row', marginBottom: 10 }}>
									{infoBlock('Фонд:', data.foundation.title)}
								</View>
							) : null}
							<View style={{ flexDirection: 'row', marginBottom: 20 }}>
								{infoBlock('', (() => {
									switch (data?.block_reason) {
										case "already_finished":
											return 'Эта викторина закончена';
										case "already_started":
											return 'Эта викторина проходит прямо сейчас';
									}
									if (data?.players < data?.start_players) {
										return 'Отсчет начнется когда наберется нужное количество участников';
									}
									return (
										<Text>
											Начнется через <CountDown toTime={data?.start_datetime} />
										</Text>
									);
								})(), '#FF3358')}
							</View>
						</View>
					</React.Fragment>
				}
				footer={
					<View
						style={{
							flexDirection: 'row',
						}}
					>
						<Button
							buttonTitle={buttonTitle(data?.block_reason, data?.participating)}
							onPress={this.handleButton}
							disabled={!!data?.block_reason && !data?.participating}
							style={{ flex: 1 }}
						/>
						<View style={{ flexDirection: 'column-reverse', marginLeft: 10 }}>
							<Button
								onPress={() => this.setState({ menuExpanded: !this.state.menuExpanded })}
							>
								<Image
									source={require('../../../assets/icons/dots.png')}
									style={{ width: 22, height: 4, marginVertical: 9, tintColor: 'white' }}
								/>
							</Button>
							{this.state.menuExpanded ? (
								<View style={{ flexDirection: 'column-reverse', position: 'absolute', bottom: 52 }}>
									<Button
										style={{ marginBottom: 5 }}
										onPress={() => Share.share({
											message: this.props.authStore.generateReferralUrl(this.state.data.pk),
										})}
									>
										<Image
											source={require('../../../assets/icons/share.png')}
											style={{ width: 22, height: 22, tintColor: 'white' }}
										/>
									</Button>
									{!this.state.data.deleted ? (
										<Button
											style={{ marginBottom: 5 }}
											onPress={() => this.props.navigation.navigate('CreateQuiz', { copy: this.state.data })}
										>
											<Image
												source={require('../../../assets/icons/copy.png')}
												style={{ width: 22, height: 22, tintColor: 'white' }}
											/>
										</Button>
									) : null}
									{this.state.data.editable ? (
										<React.Fragment>
											<Button
												style={{ marginBottom: 5 }}
												onPress={() => this.props.navigation.navigate('CreateQuiz', { edit: this.state.data })}
											>
												<Image
													source={require('../../../assets/icons/pen.png')}
													style={{ width: 22, height: 22, tintColor: 'white' }}
												/>
											</Button>
											{!this.state.data.deleted ? (
												<Button
													style={{ marginBottom: 5 }}
													onPress={() => this.setState({ deleteModalVisible: true })}
												>
													<Image
														source={require('../../../assets/icons/delete.png')}
														style={{ width: 22, height: 22, tintColor: 'white' }}
													/>
												</Button>
											) : null}
										</React.Fragment>
									) : null}
								</View>
							) : null}
						</View>
					</View>
				}
			>
				<SubHeader title='Описание' />
				<DescriptionBlock description={data?.description} />
				<SubHeader title='Список участников' />
				<ScrollView
					horizontal
					style={{
						flexDirection: 'row',
						marginBottom: 15,
						width: width,
					}}
				>
					{data?.participations.map(p => (
						<NameBlock
							key={p.pk}
							name={p.user.name}
							image={{ uri: p.user.avatar }}
							style={{
								// fontWeight: '600',
								fontSize: 13,
								color: '#FFF',
								fontWeight: '800',
								textAlign: 'left',
								top: 16,
								marginRight: 10,
							}}
						/>
					))}
				</ScrollView>
				{/*<Text
					style={{
						fontSize: 16,
						color: '#898F97',
						marginBottom: 20,
						marginLeft: 15,
					}}
				>
					Прошлые победители
				</Text>
				<ScrollView style={{ flexDirection: 'row' }} horizontal={true}>
					<WinBlock
						image={require('../../assets/icons/avatar5.png')}
						name="Theresa Wilson"
						data="15 окт. 2020"
						style={{ width: 30, height: 30, top: 10, marginRight: 10 }}
					/>
				</ScrollView>*/}
				<Modal
					isVisible={this.state.confirmModalVisible}
					onBackdropPress={() => this.setState({ confirmModalVisible: false })}
					onBackButtonPress={() => this.setState({ confirmModalVisible: false })}
				>
					<View
						style={{
							width: width - 30,
							height: 'auto',
							backgroundColor: '#19232F',
							borderTopLeftRadius: 16,
							borderTopRightRadius: 16,
							borderBottomLeftRadius: 16,
							padding: 20,
						}}
					>
						<Text
							style={{
								fontSize: 20,
								color: '#fff',
								marginBottom: 10,
								fontWeight: 'bold',
								textAlign: 'center',
							}}
						>
							Внимание!
						</Text>
						<Text
							style={{
								fontSize: 16,
								color: '#fff',
								marginBottom: 20,
								fontWeight: '500',
								textAlign: 'center',
								lineHeight: 20,
							}}
						>
							Вы действительно хотите поучаствовать в этой викторине.{'\n'}Стоимость участия:{' '}
							<Text
								style={{
									fontSize: 16,
									color: '#FEAC5E',
									marginBottom: 10,
									fontWeight: '700',
									textAlign: 'center',
								}}
							>
								{data?.entry_price} руб.
							</Text>{' '}
						</Text>
						<Button buttonTitle="ДА" onPress={this.handleConfirm} block />
						<TouchableOpacity onPress={() => this.setState({ confirmModalVisible: false })}>
							<Text
								style={{
									fontSize: 16,
									color: '#FF3358',
									fontWeight: 'bold',
									textAlign: 'center',
									marginTop: 20,
								}}
							>
								Назад
							</Text>
						</TouchableOpacity>
					</View>
				</Modal>
				<Modal
					isVisible={this.state.deleteModalVisible}
					onBackdropPress={() => this.setState({ deleteModalVisible: false })}
					onBackButtonPress={() => this.setState({ deleteModalVisible: false })}
				>
					<View
						style={{
							width: width - 30,
							height: 'auto',
							backgroundColor: '#19232F',
							borderTopLeftRadius: 16,
							borderTopRightRadius: 16,
							borderBottomLeftRadius: 16,
							padding: 20,
						}}
					>
						<Text
							style={{
								fontSize: 20,
								color: '#fff',
								marginBottom: 10,
								fontWeight: 'bold',
								textAlign: 'center',
							}}
						>
							Внимание!
						</Text>
						<Text
							style={{
								fontSize: 16,
								color: '#fff',
								marginBottom: 20,
								fontWeight: '500',
								textAlign: 'center',
								lineHeight: 20,
							}}
						>
							Вы действительно хотите удалить эту викторину?{'\n'}
							После удаления она не будет больше доступна для копирования.
						</Text>
						<Button buttonTitle="ДА" onPress={this.handleDelete} block />
						<TouchableOpacity onPress={() => this.setState({ deleteModalVisible: false })}>
							<Text
								style={{
									fontSize: 16,
									color: '#FF3358',
									fontWeight: 'bold',
									textAlign: 'center',
									marginTop: 20,
								}}
							>
								Назад
							</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			</Layout>
		);
	}
}
