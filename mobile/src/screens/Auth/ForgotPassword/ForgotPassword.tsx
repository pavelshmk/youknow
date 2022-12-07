import React from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Title from '../../../components/Title';
import { IAuthNavigationStoreProps, ISettingsStoreProps } from "../../../types";
import { inject, observer } from "mobx-react";
import Layout from "../../../components/Layout";
import { View } from "react-native";

interface IProps extends IAuthNavigationStoreProps, ISettingsStoreProps { }

interface IState {
	email: string,
	loading: boolean;
}

@inject('authStore', 'settingsStore')
@observer
export default class ForgotPassword extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;

	state: IState = {
		email: '',
		loading: false,
	};

	render() {
		return (
			<Layout>
				<View style={{
					padding: 15,
					backgroundColor: this.props.settingsStore.theme.colors.bg2,
					borderRadius: 10,
				}}>
					<Title
						title="Забыли пароль?"
						subtitle="Введите адрес эл.почты и мы вышлем вам инструкцию по восстановлению пароля"
						style={{ marginBottom: 15 }}
					/>
					<Input
						label="Эл.почта"
						value={this.state.email}
						onChangeText={text => this.setState({ email: text })}
						style={{ marginBottom: 15 }}
					/>
					<Button
						buttonTitle="Восстановить пароль"
						onPress={() => this.props.navigation.navigate('SignIn')}
					/>
				</View>
			</Layout>
		);
	}
}
