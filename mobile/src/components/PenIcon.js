import React from 'react';
import { Image, View } from 'react-native';

export default class PenIcon extends React.Component {
	render() {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					width: 50,
					height: 50,
				}}
			>
				<Image
					source={require('../assets/icons/pen.png')}
					style={{
						height: 23,
						width: 23,
					}}
				/>
			</View>
		);
	}
}
