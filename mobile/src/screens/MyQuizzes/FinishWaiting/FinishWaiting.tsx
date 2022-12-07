import React from 'react';
import { View, Text, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import HeaderTitle from '../../../components/HeaderTitle';
import { INavigationProps } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { ParamList } from "../../../Root";
import api, { INextQuestionResponse } from "../../../api";
import CountDown from "../../../components/CountDown";
import BackButton from "../../../components/BackButton";
import Layout from "../../../components/Layout";

interface IProps extends INavigationProps {
	route: RouteProp<ParamList, 'FinishWaiting'>;
}

interface IState {
	response?: INextQuestionResponse;
}

export default class FinishWaiting extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;
    private updateInterval: any;

	state: IState = {};

	async componentDidMount() {
		this.props.navigation.addListener('focus', () => {
			this.updateData();
			this.updateInterval = setInterval(this.updateData, 5000);
		});
		this.props.navigation.addListener('blur', () => {
			clearInterval(this.updateInterval);
		});
	}

	updateData = async () => {
		await this.setState({ response: await api.quiz.nextQuestion(this.props.route.params.quiz) });
		if (this.state.response?.finished) {
			this.props.navigation.pop();
			this.props.navigation.navigate('FinishResults', { quiz: this.props.route.params.quiz });
		}
	};

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Викторина закончена" />,
				}}
			>
				<View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'center', marginTop: '50%' }}>
					<Text
						style={{
							fontStyle: 'normal',
							fontSize: 20,
							fontWeight: 'bold',
							color: '#FFF',
							marginBottom: 10,
							textAlign: 'center',
						}}
					>
						Поздравляем!
					</Text>
					<Text
						style={{
							fontStyle: 'normal',
							fontSize: 16,
							lineHeight: 20,
							fontWeight: '500',
							color: '#FFF',
							marginBottom: 40,
							textAlign: 'center',
							marginLeft: 12,
							marginRight: 12,
						}}
					>
						Вы закончили отвечать на вопросы{'\n'}
						Дождитесь, пока закончат остальные участники{'\n'}
						Завершили:{' '}
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 16,
								lineHeight: 20,
								fontWeight: 'bold',
								color: '#FEAC5E',
								textAlign: 'center',
							}}
						>
							{this.state.response?.players_finished} из {this.state.response?.players}
						</Text>{'\n'}
						Окончание через:{' '}
						<Text
							style={{
								fontStyle: 'normal',
								fontSize: 16,
								lineHeight: 20,
								fontWeight: 'bold',
								color: '#FEAC5E',
								textAlign: 'center',
							}}
						>
							<CountDown toTime={this.state.response?.finish_time} />
						</Text>
					</Text>
				</View>
			</Layout>
		);
	}
}
