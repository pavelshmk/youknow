import React from 'react';
import { Dimensions } from 'react-native';
import AnswerBlock from '../../../components/ResultAnswerBlock';
import HeaderTitle from '../../../components/HeaderTitle';
import { INavigationProps } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { ParamList } from "../../../Root";
import Layout from "../../../components/Layout";

const { width } = Dimensions.get('window');

interface IProps extends INavigationProps {
	route: RouteProp<ParamList, 'FinishAnswers'>;
}

export default class FinishAnswers extends React.Component<IProps> {
	render() {
		const answers = this.props.route.params.response.answers;

		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Ответы" />
				}}
			>
				{answers.map((a, i) => (
					<AnswerBlock
						key={i}
						id={i+1}
						question={a.question}
						uAnswer={a.answer}
						answer={a.correct}
						description={a.correct_comment}
						isCorrect={a.is_correct}
					/>
				))}
			</Layout>
		);
	}
}
