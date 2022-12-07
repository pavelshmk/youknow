import React from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, TextInput, Platform } from 'react-native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import Logo from '../../../components/Logo';
import BackButton from '../../../components/BackButton';
import Title from '../../../components/Title';
import { inject, observer } from "mobx-react";
import Toast from "react-native-root-toast";
import { IAuthNavigationStoreProps, ISettingsStoreProps } from "../../../types";
import Layout from "../../../components/Layout";
import Input from "../../../components/Input";

const { width } = Dimensions.get('window');

interface IProps extends IAuthNavigationStoreProps, ISettingsStoreProps { }

interface IState {
	code: string,
	loading: boolean;
}


@inject('authStore', 'settingsStore')
@observer
export default class Code extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;

	state: IState = {
		code: '',
		loading: false,
	};

	handleSubmit = async () => {
		this.setState({ loading: true });
		try {
			await this.props.authStore.phoneAuthConfirm(this.state.code);
		} catch (e) {
			if (e.response?.status === 400) {
				Toast.show('Введён неверный или истекший код подтверждения. Проверьте его правильность или запросите отправку еще раз.');
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
			await this.props.authStore.phoneAuth(this.props.authStore.phoneNumber);
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
						title="СМС-код"
						style={{ marginBottom: 15 }}
					/>
					<Text style={styles.descriptionText}>
						Введите код, который был выслан на указанный номер{' '}
						<Text style={styles.boldText}>{this.props.authStore.phoneNumber}</Text>.{'\n'}
						Введите его чтобы продолжить.
					</Text>
					<Input
						label='СМС-код'
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
	delSpace1: {
		marginBottom: -25,
	},
	delSpace: {
		marginBottom: -15,
	},
	space: {
		marginBottom: 30,
	},
});
