import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../../components/Button';
import Title from '../../../components/Title';
import Toast from 'react-native-root-toast';
import { inject, observer } from 'mobx-react';
import { IAuthNavigationStoreProps, ISettingsStoreProps } from '../../../types';
import Layout from "../../../components/Layout";
import Input from "../../../components/Input";

interface IProps extends IAuthNavigationStoreProps, ISettingsStoreProps { }

interface IState {
	code: string,
	loading: boolean;
}

@inject('authStore', 'settingsStore')
@observer
export default class CodeEmail extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;

	state: IState = {
		code: '',
		loading: false,
	};

	handleSubmit = async () => {
		this.setState({ loading: true });
		try {
			await this.props.authStore.emailSignUpConfirm(this.state.code);
		} catch (e) {
			if (e.response?.status === 400) {
				Toast.show(
					'Введён неверный или истекший код подтверждения. Проверьте его правильность или запросите отправку еще раз.'
				);
			} else if (e.response?.status === 409) {
				Toast.show('Этот адрес электронной почты уже используется');
				this.props.navigation.navigate('SignUp');
			} else {
				Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
			}
		} finally {
			this.setState({ loading: false });
		}
	};

	handleResend = async () => {
		this.setState({ loading: true });
		try {
			await this.props.authStore.emailSignUp(this.props.authStore.email);
		} catch (e) {
			Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
		} finally {
			this.setState({ loading: false });
		}
	};

	render() {
		const buttonActive = this.state.code.length === 6;

		return (
			<Layout>
				<View style={{
					padding: 15,
					backgroundColor: this.props.settingsStore.theme.colors.bg2,
					borderRadius: 10,
				}}>
					<Title
						title="Код"
						style={{ marginBottom: 15 }}
					/>
					<Text style={styles.descriptionText}>
						Введите код, который был выслан на указанный почтовый ящик{' '}
						<Text style={styles.boldText}>{this.props.authStore.email}</Text>.{'\n'}
						Введите его чтобы продолжить.
					</Text>
					<Input
						label='Код'
						style={{ width: 120, alignSelf: 'center', marginBottom: 15 }}
						autoCompleteType="cc-number"
						keyboardType="number-pad"
						maxLength={6}
						value={this.state.code}
						onChangeText={(code) => this.setState({ code })}
					/>
					<Button
						buttonTitle="Продолжить"
						onPress={this.handleSubmit}
						disabled={!buttonActive}
						style={{ marginBottom: 15 }}
						block
					/>
					<TouchableOpacity
						onPress={this.handleResend}
					>
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 16,
								lineHeight: 20,
								fontWeight: '500',
								color: this.props.settingsStore.theme.colors.primary,
								textAlign: 'center',
								paddingVertical: 15,
							}}
						>
							Выслать код повторно
						</Text>
					</TouchableOpacity>
				</View>
			</Layout>
		);
	}
}

const styles = StyleSheet.create({
	descriptionText: {
		fontStyle: 'normal',
		fontSize: 16,
		lineHeight: 20,
		fontWeight: '500',
		color: '#898F97',
		marginRight: 15,
		marginBottom: 15,
	},
	boldText: {
		fontStyle: 'normal',
		fontSize: 16,
		lineHeight: 20,
		textAlign: 'center',
		fontWeight: '600',
		color: '#FFF',
		marginTop: 5,
	},
});
