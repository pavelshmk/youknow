import React from 'react';
import { Image, ImageStyle } from 'react-native';

export default class Logo extends React.Component {
	render() {
		const logoStyle: ImageStyle = {
			height: 18.76,
			width: 99,
		};
		return <Image source={require('../assets/icons/logo.png')} style={logoStyle} />;
	}
}
