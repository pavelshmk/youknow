import React from 'react';
import { Dimensions, View } from 'react-native';
import HeaderTitle from '../../../components/HeaderTitle';
import HeaderRedTitle from '../../../components/HeaderRedTitle';
import RadioList from '../../../components/RadioList';
import Multislider from '../../../components/MultiSlider';
import Button from '../../../components/Button';
import { ISettingsNavigationQuizStoreProps } from "../../../types";
import { inject, observer } from "mobx-react";
import Layout from "../../../components/Layout";
import { RouteProp } from '@react-navigation/native';
import { ParamList } from "../../../Root";
import { IQuizFilters } from "../../../api";
import SubHeader from "../../../components/SubHeader";
import Input from "../../../components/Input";

const { width } = Dimensions.get('window');

interface IProps extends ISettingsNavigationQuizStoreProps {
	route: RouteProp<ParamList, 'Filters'>;
}

@inject('quizStore', 'settingsStore')
@observer
export default class Filters extends React.Component<IProps, IQuizFilters> {
	static defaultProps = {} as IProps;

	state = {} as IQuizFilters;

	componentDidMount() {
		this.setState(this.props.route.params.filters || {});
	}

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Фильтры" />,
					right: (
						<HeaderRedTitle
							title="Очистить"
							onPress={() => this.setState({
								category: undefined,
								bank_end: undefined,
								bank_start: undefined,
								price_end: undefined,
								price_start: undefined
							})}
						/>
					),
				}}
				footer={
					<Button
						buttonTitle="Показать"
						onPress={() => this.props.navigation.navigate('QuizzesList', { filters: this.state })}
						block
					/>
				}
			>
				<RadioList
					options={this.props.quizStore.categories.map(cat => ({ key: cat.pk, text: cat.title }))}
					title="Категория"
					value={this.state.category}
					onChange={category => this.setState({ category })}
					clearable
				/>
				<Multislider
					title="Стоимость входа"
					max={1000}
					start={this.state.price_start}
					finish={this.state.price_end}
					onChange={(price_start, price_end) => this.setState({ price_start, price_end })}
				/>
				<Multislider
					title="Призовой фонд"
					max={1000}
					start={this.state.bank_start}
					finish={this.state.bank_end}
					onChange={(bank_start, bank_end) => this.setState({ bank_start, bank_end })}
				/>
				{/*<RadioList PROP={PROP1} title="Фонды" />*/}
			</Layout>
		);
	}
}
