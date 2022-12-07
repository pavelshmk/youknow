import React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';

export default class PlusButton extends React.Component {
	render() {
		const { onPress } = this.props;

		return (
			<TouchableOpacity
				style={{
					backgroundColor: '#FF3358',
					height: 40,
					width: 40,
					borderRadius: 16,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				onPress={onPress}
			>
				<Image source={require('../assets/icons/plus.png')} style={{ width: 16, height: 16 }} />
			</TouchableOpacity>
		);
	}
}
