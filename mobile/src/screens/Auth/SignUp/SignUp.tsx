import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Title from '../../../components/Title';
import ControlTab from '../../../components/ControlTab';
import Agreement from '../../../components/Agreement';
import Toast from "react-native-root-toast";
import { inject, observer } from "mobx-react";
import { IAuthNavigationStoreProps, ISettingsStoreProps } from "../../../types";
import Layout from "../../../components/Layout";
import { ParamList } from "../../../Root";

interface IProps extends IAuthNavigationStoreProps, ISettingsStoreProps {
	route: RouteProp<ParamList, 'SignUp'>;
}

interface IState {
	phone: string;
	email: string;
	password: string;
	password1: string;
	isEmail: number;
	loading: boolean;
}

@inject('authStore', 'settingsStore')
@observer
export default class SignUp extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;

	state: IState = {
		phone: '',
		email: '',
		password: '',
		password1: '',
		isEmail: 0,
		loading: false,
	};

	componentDidMount = () => {
		this.props.navigation.addListener('focus', () => {
			this.setState({ isEmail: this.props.route?.params?.isEmail || 0 });
		});
	};
	
	toggleTab = val => {
		this.setState({ isEmail: val });
	};

	handleEmailSubmit = async () => {
		this.setState({ loading: true });
		try {
			await this.props.authStore.emailSignUp(this.state.email, this.state.password);
			this.props.navigation.navigate('CodeEmail');
		} catch (e) {
			if (e.response?.status === 400) {
				Toast.show('Введен неверный адрес электронной почты');
			} else if (e.response?.status === 409) {
				Toast.show('Этот адрес электронной почты уже используется');
			} else {
				Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
			}
		} finally {
			this.setState({ loading: false });
		}
	};

	handlePhoneSubmit = async () => {
		this.setState({ loading: true });
		try {
			await this.props.authStore.phoneAuth(this.state.phone.replace(/^8/, '+7'));
			this.props.navigation.navigate('Code');
		} catch (e) {
			if (e.response?.status === 400) {
				Toast.show('Введён неверный номер телефона');
			} else {
				Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
			}
		} finally {
			this.setState({ loading: false });
		}
	};

	render() {
		const buttonActive = !this.state.loading && (this.state.isEmail
			? this.state.email && this.state.password && this.state.password === this.state.password1
			: this.state.phone);

		return (
			<Layout
				headerConfig={{ left: null }}
				title={
					<ControlTab
						selectedIndex={this.state.isEmail}
						onTabPress={this.toggleTab}
						style={{ marginBottom: 15, width: 200, alignSelf: 'center' }}
					/>
				}
			>
				<View style={{
					padding: 15,
					backgroundColor: this.props.settingsStore.theme.colors.bg2,
					borderRadius: 10,
				}}>
					{this.state.isEmail ? (
						<React.Fragment>
							<Title
								title="Регистрация"
								subtitle="Уже есть аккаунт?"
								linkTitle=" Войти"
								onPress={() => this.props.navigation.navigate('SignIn', { isEmail: 1 })}
								style={{ marginBottom: 15 }}
							/>
							<Input
								label="Эл.почта"
								value={this.state.email}
								onChangeText={text => this.setState({ email: text })}
								keyboardType="email-address"
								style={{ marginBottom: 15 }}
							/>
							<Input
								label="Пароль"
								value={this.state.password}
								onChangeText={text => this.setState({ password: text })}
								autoCompleteType="password"
								textContentType="password"
								secureTextEntry={true}
								style={{ marginBottom: 15 }}
							/>
							<Input
								label="Повторите пароль"
								value={this.state.password1}
								onChangeText={text => this.setState({ password1: text })}
								autoCompleteType="password"
								textContentType="newPassword"
								secureTextEntry={true}
								style={{ marginBottom: 15 }}
							/>
							<Button
								buttonTitle="Зарегистрироваться"
								onPress={this.handleEmailSubmit}
								disabled={!buttonActive}
								style={{ marginBottom: 15 }}
								block
							/>
							<Agreement titleName="Зарегистрироваться"/>
						</React.Fragment>
					) : (
						<React.Fragment>
							<Title
								title="Регистрация"
								subtitle="Уже есть аккаунт?"
								linkTitle=" Войти"
								onPress={() => this.props.navigation.navigate('SignIn', { isEmail: 0 })}
								style={{ marginBottom: 15 }}
							/>
							<Input
								label="Номер телефона"
								value={this.state.phone}
								onChangeText={text => this.setState({ phone: text })}
								keyboardType="phone-pad"
								style={{ marginBottom: 15 }}
							/>
							<Button
								buttonTitle="Зарегистрироваться"
								onPress={this.handlePhoneSubmit}
								disabled={!buttonActive}
								style={{ marginBottom: 15 }}
								block
							/>
							<Agreement titleName="Зарегистрироваться"/>
						</React.Fragment>
					)}
				</View>
			</Layout>
		);
	}
}
const styles = StyleSheet.create({
	delSpace: {
		marginBottom: -10,
	},
});
