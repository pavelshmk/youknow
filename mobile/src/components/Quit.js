import React from 'react';
import { Image } from 'react-native';

export default class Quit extends React.Component {
	render() {
		const logoStyle = {
			top: 22,
			height: 20,
			width: 20,
		};
		return <Image source={require('../assets/icons/quit.png')} style={logoStyle} />;
	}
}
