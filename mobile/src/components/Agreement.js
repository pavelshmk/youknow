import React from 'react';
import { View, Text } from 'react-native';

export default class Agreement extends React.Component {
	render() {
		const { titleName } = this.props;
		const viewStyle = {
			alignItems: 'center',
		};
		const textStyle = {
			textAlign: 'center',
			color: '#898F97',
			lineHeight: 16,
		};
		const textLinkStyle = {
			color: '#FF3358',
			lineHeight: 16,
		};
		return (
			<View style={viewStyle}>
				<Text style={textStyle}>
					При нажатии на кнопку “{titleName}” вы соглашаетесь с{' '}
					<Text style={textLinkStyle}>Условиями использоавния и Политикой конфиденциальности </Text>
				</Text>
			</View>
		);
	}
}
