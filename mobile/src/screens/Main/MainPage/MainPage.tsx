import React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import SearchBlock from '../../../components/SearchBlock';
import Title from '../../../components/Title';
import PlusButton from '../../../components/PlusButton';
import WinBlock from '../../../components/WinBlock';
import { ISettingsNavigationQuizStoreProps } from "../../../types";
import { inject, observer } from "mobx-react";
import ruplu from "../../../libs/ruplu";
import Layout from "../../../components/Layout";
import SubHeader from "../../../components/SubHeader";
import { IQuiz, IQuizFilters } from "../../../api";
import QuizCard from "../../../components/QuizCard";
import _ from "lodash";
import HashTag from "../../../components/HashTag";

interface IState {
	filters: IQuizFilters;
	quizzes: IQuiz[];
	loading: boolean;
}

@inject('settingsStore', 'quizStore')
@observer
export default class MainPageFilters extends React.Component<ISettingsNavigationQuizStoreProps, IState> {
	static defaultProps = {} as ISettingsNavigationQuizStoreProps;

	state: IState = {
		filters: { search: '' },
		quizzes: [],
		loading: false,
	};

	async componentDidMount() {
		this.update();
		this.props.navigation.addListener('focus', () => {
			this.update();
		});
		this.props.navigation.addListener('blur', async () => {
			await this.setState({ quizzes: [] });
			if (this.state.filters.search?.startsWith('#')) {
				await this.props.settingsStore.addSearchLogEntry(this.state.filters.search);
			}
		});
	}

	update = async () => {
		this.setState({ loading: true });
		await this.props.quizStore.loadCategories();
		this.setState({
			quizzes: await this.props.quizStore.list(this.state.filters),
			loading: false,
		});
	};

	updateDebounced = _.debounce(this.update, 500);

	render() {
		return (
			<Layout
				title={
					<React.Fragment>
						<View style={{ flexDirection: 'row', marginBottom: 10 }}>
							<Title title="Викторины" style={{ flexGrow: 1 }} />
							<PlusButton onPress={() => this.props.navigation.navigate('CreateQuiz')} />
						</View>
						<SearchBlock
							value={this.state.filters.search}
							onChange={search => {
								this.setState({ filters: { search } });
								this.updateDebounced();
							}}
							onPress={() => this.props.navigation.navigate('Filters', { filters: this.state.filters })}
						/>
					</React.Fragment>
				}
				headerConfig={{ left: null }}
				refreshControl={
					<RefreshControl refreshing={this.state.loading} onRefresh={this.update} />
				}
			>
				<SubHeader title='Категории' />
				<ScrollView
					style={{ marginBottom: 35 }}
					horizontal
				>
					<View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
						{this.props.quizStore.categories.map(c => (
							<WinBlock
								key={c.pk}
								image={{ uri: c.image }}
								name={c.title}
								data={ruplu('викторина', 'викторины', 'викторин')(c.count, true)}
								onPress={() => this.props.navigation.navigate('QuizzesList', { filters: { category: c.pk } })}
								style={{
									width: 30,
									height: 30,
									top: 10,
									marginRight: 10,
									tintColor: this.props.settingsStore.theme.colors.text,
								}}
							/>
						))}
					</View>
				</ScrollView>
				{this.props.settingsStore.searchLog.map((l, i) => (
					<HashTag key={i} text={l} onPress={async () => {
						await this.setState({ filters: { ...this.state.filters, search: l }});
						this.update();
					}} />
				))}
				{this.state.quizzes.map(q => (
					<TouchableOpacity
						key={q.pk}
						onPress={() => this.props.navigation.navigate('QuizInfo', { pk: q.pk })}
					>
						<QuizCard data={q} />
					</TouchableOpacity>
				))}
			</Layout>
		);
	}
}
