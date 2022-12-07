import React from 'react';
import { TouchableOpacity, RefreshControl } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import SearchBlock from '../../../components/SearchBlock';
import HeaderTitle from '../../../components/HeaderTitle';
import { INavigationProps, IQuizStoreProps, ISettingsStoreProps } from "../../../types";
import { ParamList } from "../../../Root";
import { inject, observer } from "mobx-react";
import { IQuiz, IQuizFilters } from "../../../api";
import QuizCard from "../../../components/QuizCard";
import Layout from "../../../components/Layout";
import _ from "lodash";
import HashTag from "../../../components/HashTag";

interface IProps extends INavigationProps, IQuizStoreProps, ISettingsStoreProps {
	route: RouteProp<ParamList, 'QuizzesList'>;
}

interface IState {
	filters: IQuizFilters;
	quizzes: IQuiz[];
	loading: boolean;
}

@inject('quizStore', 'settingsStore')
@observer
export default class QuizzesList extends React.Component<IProps> {
	static defaultProps = {} as INavigationProps;

	state: IState = {
		filters: { search: '' },
		quizzes: [],
		loading: true,
	};

	async componentDidMount() {
		this.props.navigation.addListener('focus', async () => {
			await this.setState({ filters: this.props.route.params.filters });
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
		this.setState({
			quizzes: await this.props.quizStore.list(this.state.filters),
			loading: false,
		});
	};

	updateDebounced = _.debounce(this.update, 500);

	render() {
		const category = this.props.route?.params?.filters?.category;
		const title = category ? this.props.quizStore.categoriesMap[category].title : 'Викторины';
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title={title} />,
				}}
				title={
					<SearchBlock
						value={this.state.filters.search}
						onChange={search => {
							this.setState({ filters: { search } });
							this.updateDebounced();
						}}
						onPress={() => this.props.navigation.navigate('Filters', { filters: this.state.filters })}
					/>
				}
				refreshControl={
					<RefreshControl refreshing={this.state.loading} onRefresh={this.update} />
				}
			>
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
