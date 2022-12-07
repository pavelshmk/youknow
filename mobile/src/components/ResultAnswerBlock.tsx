import React from 'react';
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface IProps {
	id: number;
	question: string;
	uAnswer: string;
	answer: string;
	description: string;
	isCorrect: boolean;
}

export default class AnswersBlock extends React.Component<IProps> {
	render() {
		const { id, question, uAnswer, answer, description, isCorrect } = this.props;
		const viewStyle: ViewStyle = {
			flexDirection: 'row',
		};
		const textNumberStyle: TextStyle = {
			fontWeight: 'bold',
			fontSize: 20,
			lineHeight: 20,
			color: '#898F97',
			textAlign: 'left',
			marginBottom: 2,
		};
		const textStyle: TextStyle = {
			fontWeight: '500',
			lineHeight: 16,
			fontSize: 13,
			color: '#898F97',
			textAlign: 'left',
		};
		const textBoldStyle: TextStyle = {
			fontWeight: 'bold',
			lineHeight: 16,
			fontSize: 13,
			color: '#898F97',
			textAlign: 'left',
		};
		const textGreenStyle: TextStyle = {
			fontWeight: 'bold',
			lineHeight: 16,
			fontSize: 13,
			color: '#A1D3A2',
			textAlign: 'left',
		};
		const imageStyle: ImageStyle = {
			width: 15,
			height: 15,
			alignSelf: 'flex-start',
		};
		const textQuestionStyle: TextStyle = {
			fontSize: 13,
			lineHeight: 16,
			fontWeight: '700',
			color: '#FFF',
			textAlign: 'left',
		};
		return (
			<View style={{ borderBottomWidth: 2, borderBottomColor: '#898F97', paddingBottom: 10, marginBottom: 10, flexDirection: 'row' }}>
				<View style={{ alignItems: 'center', marginRight: 15 }}>
					<Text style={textNumberStyle}>{id}</Text>
					<Image
						source={isCorrect ? require('../assets/icons/yes.png') : require('../assets/icons/no.png') }
						style={imageStyle}
					/>
				</View>
				<View>
					<View style={viewStyle}>
						<Text style={textQuestionStyle}>{question}</Text>
					</View>
					<View style={viewStyle}>
						<Text style={textStyle}>Ваш ответ:</Text>
						<Text style={isCorrect ? textGreenStyle : textBoldStyle}>{' '}{uAnswer}</Text>
					</View>
					{!isCorrect ? (
						<View style={viewStyle}>
							<Text style={textStyle}>Правильный ответ:</Text>
							<Text style={textGreenStyle}>{' '}{answer}</Text>
						</View>
					) : null}
					{description ? (
						<View style={viewStyle}>
							<View style={{ flex: 0.8 }}>
							</View>
							<View style={{ flex: 8 }}>
								<Text style={textStyle}>Пояснение:</Text>
								<Text style={textBoldStyle}>{' '}{description}</Text>
							</View>
						</View>
					): null}
				</View>
			</View>
		);
	}
}
