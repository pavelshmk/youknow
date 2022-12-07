import React from 'react';
import { View, ScrollView, Dimensions, Text, SafeAreaView, TouchableOpacity, Switch, Platform } from 'react-native';
import Header from '../../../components/Header';
import HeaderTitle from '../../../components/HeaderTitle';
import BackButton from '../../../components/BackButton';
import { inject, observer } from "mobx-react";
import { ISettingsNavigationStoreProps } from "../../../types";
import Layout from "../../../components/Layout";

const { width } = Dimensions.get('window');

@inject('settingsStore')
@observer
export default class Settings extends React.Component<ISettingsNavigationStoreProps> {
	static defaultProps = {} as ISettingsNavigationStoreProps;

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Настройки" />,
				}}
			>
				<View style={{ flexDirection: 'row', marginBottom: 10 }}>
					<View style={{ flex: 4 }}>
						<Text
							style={{
								fontSize: 16,
								color: '#898F97',
								marginBottom: 20,
							}}
						>
							Уведомления
						</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Switch
							trackColor={{ false: '#898F97', true: '#FF3358' }}
							thumbColor={'#fff'}
							ios_backgroundColor="#898F97"
							onValueChange={val => this.props.settingsStore.updateNotifications(val)}
							value={this.props.settingsStore.notifications}
						/>
					</View>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 4 }}>
						<Text
							style={{
								fontSize: 16,
								color: '#898F97',
							}}
						>
							Светлая тема
						</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Switch
							onValueChange={val => this.props.settingsStore.updateDarkTheme(!val)}
							value={!this.props.settingsStore.darkTheme}
							trackColor={{ false: '#898F97', true: '#FF3358' }}
							thumbColor={'#fff'}
							ios_backgroundColor="#898F97"
						/>
					</View>
				</View>
			</Layout>
		);
	}
}
