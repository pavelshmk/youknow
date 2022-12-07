import React from 'react';
import {
	TouchableOpacity,
	RefreshControl
} from 'react-native';
import Title from '../../../components/Title';
import { ISettingsNavigationStoreProps } from "../../../types";
import { inject, observer } from "mobx-react";
import api, { IMyQuizzesResponse } from "../../../api";
import QuizCard from "../../../components/QuizCard";
import Layout from "../../../components/Layout";
import SubHeader from "../../../components/SubHeader";

interface IState extends IMyQuizzesResponse {
	refreshing: boolean;
}

@inject('settingsStore')
@observer
export default class MyQuiz extends React.Component<ISettingsNavigationStoreProps, IState> {
	static defaultProps = {} as ISettingsNavigationStoreProps;

	state: IState = {
		creator: [],
		owner: [],
		future: [],
		current: [],
		refreshing: false,
	};

	async componentDidMount() {
		this.props.navigation.addListener('focus', this.refresh);
	}

	refresh = async () => {
		this.setState({ refreshing: true });
		this.setState(await api.quiz.myQuizzes());
		this.setState({ refreshing: false });
	};

	render() {
		return (
			<Layout
				title={<Title title="Мои викторины" />}
				headerConfig={{ left: null }}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this.refresh}
					/>
				}
			>
				{this.state.current.length ? (
					<React.Fragment>
						<SubHeader title='Проходят' />
						{this.state.current.map(q => (
							<TouchableOpacity
								key={q.pk}
								onPress={() => this.props.navigation.navigate('QuizInfo', { pk: q.pk })}
							>
								<QuizCard data={q} />
							</TouchableOpacity>
						))}
					</React.Fragment>
				) : null}
				{this.state.future.length ? (
					<React.Fragment>
						<SubHeader title='Предстоящие' />
						{this.state.future.map(q => (
							<TouchableOpacity
								key={q.pk}
								onPress={() => this.props.navigation.navigate('QuizInfo', { pk: q.pk })}
							>
								<QuizCard data={q} />
							</TouchableOpacity>
						))}
					</React.Fragment>
				) : null}
				{this.state.creator.length ? (
					<React.Fragment>
						<SubHeader title='Составленные' />
						{this.state.creator.map(q => (
							<TouchableOpacity
								key={q.pk}
								onPress={() => this.props.navigation.navigate('QuizInfo', { pk: q.pk })}
							>
								<QuizCard data={q} />
							</TouchableOpacity>
						))}
					</React.Fragment>
				) : null}
				{this.state.owner.length ? (
					<React.Fragment>
						<SubHeader title='Проводимые' />
						{this.state.owner.map(q => (
							<TouchableOpacity
								key={q.pk}
								onPress={() => this.props.navigation.navigate('QuizInfo', { pk: q.pk })}
							>
								<QuizCard data={q} />
							</TouchableOpacity>
						))}
					</React.Fragment>
				) : null}
			</Layout>
		);
	}
}
