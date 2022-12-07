import React from 'react';
import { View, ScrollView, Dimensions, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import Header from '../../../components/Header';
import HeaderTitle from '../../../components/HeaderTitle';
import OperationsPlus from '../../../components/OperationsPlus';
import OperationsMinus from '../../../components/OperationsMinus';
import BackButton from '../../../components/BackButton';
import Modal from 'react-native-modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import RadioButton from '../../../components/RadioButton';
import { inject, observer } from "mobx-react";
import { IAuthSettingsNavigationStoreProps } from "../../../types";
import api, { IBalanceEvent } from "../../../api";
import Toast from "react-native-root-toast";
import Layout from "../../../components/Layout";
import SubHeader from "../../../components/SubHeader";

const { width } = Dimensions.get('window');

const options = [
	{
		key: 'yandex',
		text: 'Яндекс.Деньги',
	},
	{
		key: 'tinkoff',
		text: 'Тинькофф',
	},
	{
		key: 'sberbank',
		text: 'Сбербанк',
	},
	{
		key: 'paypal',
		text: 'PayPal',
	},
];

interface IState {
	isDepositModalVisible: boolean;
	isWithdrawModalVisible: boolean;
	sum: string;
	destination: string;
	option?: string;
	history: IBalanceEvent[];
	loading: boolean;
}

@inject('settingsStore', 'authStore')
@observer
export default class BalanceHistory extends React.Component<IAuthSettingsNavigationStoreProps, IState> {
	static defaultProps = {} as IAuthSettingsNavigationStoreProps;

	state: IState = {
		isDepositModalVisible: false,
		isWithdrawModalVisible: false,
		sum: '',
		destination: '',
		history: [],
		loading: false,
	};

	async componentDidMount() {
		this.setState({ history: await api.users.balanceEvents() });
	}

	toggleDepositModal = () => {
		if (this.state.loading) return;
		this.setState({ isDepositModalVisible: !this.state.isDepositModalVisible, sum: '', option: undefined, destination: '' });
	};

	toggleWithdrawModal = () => {
		if (this.state.loading) return;
		this.setState({ isWithdrawModalVisible: !this.state.isWithdrawModalVisible, sum: '', option: undefined, destination: '' });
	};

	handleDeposit = async () => {
		this.setState({ loading: true });
		try {
			await api.users.deposit(parseFloat(this.state.sum), this.state.option);
			Toast.show('Баланс успешно пополнен');
			await this.componentDidMount();
			await this.props.authStore.loadProfile();
			this.setState({ isDepositModalVisible: false });
		} catch (e) {
			if (e.response?.status === 400) {
				Toast.show('Проверьте данные формы');
			} else {
				Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
			}
		} finally {
			this.setState({ loading: false });
		}
	};

	handleWithdraw = async () => {
		this.setState({ loading: true });
		try {
			await api.users.withdraw(parseFloat(this.state.sum), this.state.option, this.state.destination);
			Toast.show('Заявка на вывод успешно создана');
			await this.componentDidMount();
			await this.props.authStore.loadProfile();
			this.setState({ isWithdrawModalVisible: false });
		} catch (e) {
			if (e.response?.status === 400) {
				Toast.show('Проверьте данные формы');
			} else if (e.response?.status === 412) {
				Toast.show('Недостаточно средств на счету');
			} else {
				Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
			}
		} finally {
			this.setState({ loading: false });
		}
	};

	render() {
		const sum = parseFloat(this.state.sum);
		const balance = parseFloat(this.props.authStore.profile.balance);
		const buttonActive = !this.state.loading && sum > 0 && this.state.option &&
			(this.state.isWithdrawModalVisible && this.state.destination && sum < balance || this.state.isDepositModalVisible);

		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Баланс" />
				}}
				title={
					<React.Fragment>
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 24,
								lineHeight: 29,
								fontWeight: 'bold',
								color: '#FFF',
								textAlign: 'center',
								marginBottom: 30,
							}}
						>
							{this.props.authStore.profile.balance} руб.
						</Text>
						<View style={{ flexDirection: 'row' }}>
							<Button buttonTitle='Пополнить' onPress={this.toggleDepositModal} style={{ flexGrow: 1 }} />
							<View style={{ width: 10 }} />
							<Button buttonTitle='Вывести' onPress={this.toggleWithdrawModal} style={{ flexGrow: 1 }} outline />
						</View>
						<SubHeader title='История операций' />
					</React.Fragment>
				}
			>
				<Modal
					isVisible={this.state.isDepositModalVisible}
					onBackButtonPress={this.toggleDepositModal}
					onBackdropPress={this.toggleDepositModal}
				>
					<View
						style={{
							width: width - 30,
							height: 'auto',
							backgroundColor: this.props.settingsStore.theme.colors.bg2,
							borderTopLeftRadius: 16,
							borderTopRightRadius: 16,
							borderBottomLeftRadius: 16,
							padding: 20,
						}}
					>
						<SubHeader title='Пополнить' />
						<Input label="Сумма" keyboardType="number-pad" value={this.state.sum} onChangeText={sum => this.setState({ sum })} />
						<SubHeader title='Способ пополнения' />
						<RadioButton
							options={options}
							onPress={option => this.setState({ option })}
							activeKey={this.state.option}
						/>
						<Button buttonTitle="Пополнить" onPress={this.handleDeposit} disabled={!buttonActive} block />
					</View>
				</Modal>
				<Modal
					isVisible={this.state.isWithdrawModalVisible}
					onBackButtonPress={this.toggleWithdrawModal}
					onBackdropPress={this.toggleWithdrawModal}
				>
					<View
						style={{
							width: width - 30,
							height: 'auto',
							backgroundColor: this.props.settingsStore.theme.colors.bg2,
							borderTopLeftRadius: 16,
							borderTopRightRadius: 16,
							borderBottomLeftRadius: 16,
							padding: 20,
						}}
					>
						<SubHeader title='Вывести' />
						<Input label="Сумма" keyboardType="number-pad" value={this.state.sum} onChangeText={sum => this.setState({ sum })} />
						<SubHeader title='Способ вывода' />
						<RadioButton
							options={options}
							onPress={option => this.setState({ option })}
							activeKey={this.state.option}
						/>
						{this.state.option ? (
							<Input label="Номер счёта" keyboardType="phone-pad" value={this.state.destination} onChangeText={destination => this.setState({ destination })} />
						) : null}
						<Button buttonTitle="Пополнить" onPress={this.handleWithdraw} disabled={!buttonActive} block />
					</View>
				</Modal>
				{this.state.history.map(e => {
					const date = new Date(e.time);
					let type = '';
					switch (e.type) {
						case "deposit": type = 'Пополнение'; break;
						case "1stplace": type = 'Выигрыш\n(1-е место)'; break;
						case "2ndplace": type = 'Выигрыш\n(2-е место)'; break;
						case "3rdplace": type = 'Выигрыш\n(3-е место)'; break;
						case "creator": type = 'Авторский бонус'; break;
						case "referral": type = 'Реферальный бонус'; break;
						case "withdraw": type = 'Вывод'; break;
					}
					const isMinus = e.type == 'withdraw';
					const sum = isMinus ? `- ${e.amount}` : `+ ${e.amount}`;
					return (
						<View key={e.pk} style={{
							flexDirection: 'row',
							marginBottom: 20,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<Text style={{
								fontWeight: '700',
								fontSize: 13,
								lineHeight: 16,
								color: '#FFF',
								textAlign: 'left',
								width: 60,
							}}>
								{date.toLocaleDateString()}
							</Text>
							<Text style={{
								fontSize: 13,
								fontWeight: '600',
								lineHeight: 16,
								color: '#898F97',
								textAlign: 'center',
								flex: 1,
							}}>
								{type}
							</Text>
							<Text style={{
								fontSize: 13,
								fontWeight: '700',
								lineHeight: 16,
								color: isMinus ? '#EE3E54' : '#A1D3A2',
								textAlign: 'right',
								width: 100,
							}}>
								{sum}
							</Text>
						</View>
					)
				})}
			</Layout>
		);
	}
}
