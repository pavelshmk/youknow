import React from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Header from '../../../components/Header';
import HeaderQuestionDesc from '../../../components/HeaderQuestionDesc';
import BackButton from '../../../components/BackButton';
import AnswerBlock from '../../../components/AnswerBlock';
import Button from '../../../components/Button';
import { ISettingsNavigationQuizStoreProps } from "../../../types";
import api, { INextQuestionResponse } from "../../../api";
import { ParamList } from "../../../Root";
import CountDown from "../../../components/CountDown";
import Layout from "../../../components/Layout";
import AutoHeightImage from "react-native-auto-height-image";

const { width } = Dimensions.get('window');

interface IProps extends ISettingsNavigationQuizStoreProps {
	route: RouteProp<ParamList, 'Question'>;
}

interface IState {
	response?: INextQuestionResponse;
	selectedOption?: number;
	questionLoading: boolean;
	loading: boolean;
}

export default class Question extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;

	state: IState = {
		questionLoading: false,
		loading: false,
	};

	async componentDidMount() {
		this.props.navigation.addListener('focus', this.loadNextQuestion);
	}

	loadNextQuestion = async () => {
		this.setState({ questionLoading: true });
		const response = await api.quiz.nextQuestion(this.props.route.params.quiz);
		this.setState({ response, questionLoading: false });
		if (!response.question)
			this.redirect(response);
	};

	redirect = (response: INextQuestionResponse) => {
		if (response?.finished) {
			this.moveToResults();
		} else {
			this.props.navigation.pop();
			this.props.navigation.navigate('FinishWaiting', { quiz: this.props.route.params.quiz });
		}
	};

	submitResponse = async () => {
		this.setState({ loading: true });
		const response = await api.quiz.submitResponse(this.props.route.params.quiz, this.state.selectedOption);
		await this.setState({ response });
		if (!this.state.response?.question)
			this.redirect(this.state.response);
		else
			this.setState({ loading: false, selectedOption: undefined });
	};

	moveToResults = () => {
		this.props.navigation.pop();
		this.props.navigation.navigate('FinishResults', { quiz: this.props.route.params.quiz });
	};

	render() {
		const response = this.state.response;
		const question = response?.question;

		return (
			<Layout
				headerConfig={{ enabled: false }}
				titleStyle={{ paddingHorizontal: 0 }}
				title={
					<View
						style={{
							backgroundColor: '#19232f',
							height: 'auto',
							paddingHorizontal: 15
						}}
					>
						<Header
							left={<BackButton onPress={() => this.props.navigation.goBack()} />}
							center={
								<Text
									style={{
										fontStyle: 'normal',
										fontSize: 23,
										lineHeight: 50,
										textAlignVertical: 'center',
										fontWeight: '500',
										color: '#FEAC5E',
										textAlign: 'center',
									}}
								>
									<CountDown toTime={response?.finish_time} onExpire={this.moveToResults} />
								</Text>
							}
							right={
								<HeaderQuestionDesc
									current={response?.total_questions - response?.questions_left + 1}
									total={response?.total_questions}
								/>
							}
						/>
					</View>
				}
				footer={
					<Button
						buttonTitle="Продолжить"
						onPress={this.submitResponse}
						disabled={!this.state.selectedOption || this.state.loading}
						block
					/>
				}
				loading={this.state.questionLoading}
				scrollViewStyle={{ paddingHorizontal: 0, marginTop: -10 }}
			>
				<View
					style={{
						backgroundColor: '#19232f',
						borderBottomLeftRadius: 35,
						borderBottomRightRadius: 35,
						marginBottom: 35,
						marginHorizontal: -15,
						paddingHorizontal: 15,
					}}
				>
					{question?.image ? (
						<AutoHeightImage
							source={{ uri: question.image }}
							width={width - 30}
							style={{ marginHorizontal: 15 }}
							animated
						/>
					) : null}
					<Text style={{
						textAlign: 'center',
						fontSize: 20,
						fontWeight: 'bold',
						color: '#FFF',
						paddingVertical: 30,
					}}>
						{question?.text}
					</Text>
				</View>
				<View
					style={{ paddingHorizontal: 15 }}
				>
					{question ? (
						<AnswerBlock
							options={question.options}
							pressed={this.state.selectedOption}
							onChange={(selectedOption: number) => this.setState({ selectedOption })}
						/>
					) : null}
				</View>
			</Layout>
		);
	}
}
