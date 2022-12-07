import React from 'react';
import { Image } from 'react-native';

export default class DoneIcon extends React.Component {
	render() {
		const logoStyle = {
			top: 20,
			height: 18.76,
			width: 99,
			alignSelf: 'center',
		};
		return <Image source={require('../assets/icons/logo.png')} style={logoStyle} />;
	}
}
