import React from 'react';
import { View, Dimensions, ScrollView, SafeAreaView, Platform, RefreshControl } from 'react-native';
import AchivesCard from '../../../components/AchivesCard';
import Header from '../../../components/Header';
import Title from '../../../components/Title';
import Logo from '../../../components/Logo';
import { inject, observer } from "mobx-react";
import { ISettingsNavigationStoreProps } from "../../../types";
import Layout from "../../../components/Layout";

@inject('settingsStore')
@observer
export default class Achievements extends React.Component<ISettingsNavigationStoreProps> {
	static defaultProps = {} as ISettingsNavigationStoreProps;

	render() {
		return (
			<Layout
				title={<Title title="Достижения" />}
				headerConfig={{ left: null }}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						flexWrap: 'wrap',
						justifyContent: 'space-between',
					}}
				>
					<AchivesCard
						percent={37}
						image={require('../../../assets/icons/leader.png')}
						title="Лидер"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
					<AchivesCard
						percent={100}
						image={require('../../../assets/icons/money.png')}
						title="Миллионер"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
					<AchivesCard
						percent={100}
						image={require('../../../assets/icons/calendar.png')}
						title="Постоянство"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
					<AchivesCard
						percent={100}
						image={require('../../../assets/icons/checkmark.png')}
						title="Всё верно"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
					<AchivesCard
						percent={37}
						image={require('../../../assets/icons/medal.png')}
						title="Vene, vidi, vici"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
					<AchivesCard
						percent={100}
						image={require('../../../assets/icons/car.png')}
						title="Автомобилист"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
					<AchivesCard
						percent={37}
						image={require('../../../assets/icons/leader.png')}
						title="Лидер"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
					<AchivesCard
						percent={100}
						image={require('../../../assets/icons/money.png')}
						title="Миллионер"
						onPress={() => this.props.navigation.navigate('Achievement')}
					/>
				</View>
			</Layout>
		);
	}
}
