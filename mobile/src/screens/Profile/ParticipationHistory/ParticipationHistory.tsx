import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
import HeaderTitle from '../../../components/HeaderTitle';
import ParticipationHistoryBlock from '../../../components/ParticipationHistoryBlock';
import { IAuthSettingsNavigationStoreProps } from "../../../types";
import { inject, observer } from "mobx-react";
import api, { IParticipation } from '../../../api';
import Layout from "../../../components/Layout";

interface IState {
	history: IParticipation[];
	loading: boolean;
}

function statsBlock(value: number, title: string) {
	return (
		<View
			style={{
				flex: 1,
				marginBottom: 10,
			}}
		>
			<Text
				style={{
					fontStyle: 'normal',
					fontSize: 24,
					lineHeight: 29,
					fontWeight: 'bold',
					color: '#FFF',
					textAlign: 'center',
					marginBottom: 5,
				}}
			>
				{value}
			</Text>
			<Text
				style={{
					fontStyle: 'normal',
					fontSize: 16,
					lineHeight: 20,
					fontWeight: '500',
					color: '#898F97',
					textAlign: 'center',
				}}
			>
				{title}
			</Text>
		</View>
	);
}

@inject('settingsStore', 'authStore')
@observer
export default class ParticipationHistory extends React.Component<IAuthSettingsNavigationStoreProps, IState> {
	static defaultProps = {} as IAuthSettingsNavigationStoreProps;

	state: IState = {
		history: [],
		loading: false,
	};

	async componentDidMount() {
		this.props.navigation.addListener('focus', this.refresh);
	}

	refresh = async () => {
		this.setState({ loading: true });
		this.setState({ history: await api.users.participationHistory(), loading: false });
	};

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="История игр" />,
				}}
				title={
					<React.Fragment>
						<View style={{ flexDirection: 'row' }}>
							{statsBlock(this.state.history.length, 'всего игр')}
							{statsBlock(this.props.authStore.profile.wins, 'побед')}
						</View>
						<Text style={{ fontSize: 16, color: '#898F97', marginBottom: 20 }}>
							История игр
						</Text>
					</React.Fragment>
				}
				refreshControl={
					<RefreshControl
						refreshing={this.state.loading}
						onRefresh={this.refresh}
					/>
				}
			>
				{this.state.history.map(p => (
					<ParticipationHistoryBlock key={p.pk} quizTitle={p.quiz.title} place={p.place+1} players={p.quiz.players} win={p.win} />
				))}
			</Layout>
		);
	}
}
