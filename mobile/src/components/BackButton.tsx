import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

interface IProps {
	onPress: () => any;
}

export default class BackButton extends React.Component<IProps> {
	render() {
		const { onPress } = this.props;
		return (
			<TouchableOpacity
				onPress={onPress}
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					width: 50,
					height: 50,
				}}
			>
				<Image
					source={require('../assets/icons/back.png')}
					style={{
						height: 25,
						width: 25,
					}}
				/>
			</TouchableOpacity>
		);
	}
}
