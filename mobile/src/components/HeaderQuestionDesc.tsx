import React from 'react';
import { Text, TextStyle, View } from 'react-native';

interface IProps {
	current: number;
	total: number;
}

export default class HeaderQuestionDesc extends React.Component<IProps> {
	render() {
		const { current, total } = this.props;
		const titleText: TextStyle = {
			width: '100%',
			fontStyle: 'normal',
			fontSize: 13,
			lineHeight: 16,
			fontWeight: '500',
			color: '#898F97',
			textAlign: 'center',
		};
		const descText: TextStyle = {
			width: '100%',
			fontStyle: 'normal',
			fontSize: 12,
			fontWeight: '700',
			color: '#FFF',
			textAlign: 'right',
		};
		return (
			<View style={{
				flexDirection: 'column',
				height: 50,
				alignItems: 'center',
				justifyContent: 'center',
				paddingRight: 10,
			}}>
				<Text style={titleText}>Вопрос</Text>
				<Text style={descText}>{current} из {total}</Text>
			</View>
		);
	}
}
