import React from 'react';
import { Text } from 'react-native';

export default class HeaderTitle extends React.Component {
	render() {
		const { title } = this.props;
		const titleText = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			fontWeight: '500',
			color: '#FFFFFF',
			textAlign: 'center',
		};
		return <Text style={titleText}>{title}</Text>;
	}
}
