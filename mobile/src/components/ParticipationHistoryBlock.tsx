import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface IProps {
	quizTitle: string;
	place: number;
	players: number;
	win: string;
}

export default class ParticipationHistoryBlock extends React.Component<IProps> {
	render() {
		const { quizTitle, place, players, win } = this.props;
		const viewStyle: ViewStyle = {
			flexDirection: 'row',
			marginBottom: 20,
		};
		const textDataStyle: TextStyle = {
			fontWeight: '700',
			fontSize: 13,
			lineHeight: 16,
			color: '#FFF',
			textAlign: 'left',
		};
		const textSumStyle: TextStyle = {
			fontSize: 13,
			fontWeight: '700',
			lineHeight: 16,
			color: '#A1D3A2',
			textAlign: 'center',
		};
		const textCashStyle: TextStyle = {
			fontSize: 13,
			fontWeight: '700',
			lineHeight: 16,
			color: '#FF3358',
			textAlign: 'left',
		};
		return (
			<View style={viewStyle}>
				<View style={{ flex: 1, height: 'auto' }}>
					<Text style={textDataStyle}>{quizTitle}</Text>
				</View>
				<View style={{ flex: 1, height: 'auto' }}>
					<Text style={textSumStyle}>{place} из {players}</Text>
				</View>
				<View style={{ flex: 1, height: 'auto' }}>
					<Text style={textDataStyle}>Выигрыш:</Text>
					<Text style={textCashStyle}>{win} рублей</Text>
				</View>
			</View>
		);
	}
}
