import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default class HeaderRedTitle extends React.Component {
	render() {
		const { title, onPress } = this.props;
		const clearText = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			fontWeight: '500',
			color: '#FF3358',
		};
		return (
			<TouchableOpacity
				onPress={onPress}
				style={{ paddingHorizontal: 15 }}
			>
				<Text style={clearText}>{title}</Text>
			</TouchableOpacity>
		);
	}
}
