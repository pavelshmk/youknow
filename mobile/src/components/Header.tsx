import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';

interface IProps {
	left?: React.ReactNode;
	center?: React.ReactNode;
	right?: React.ReactNode;
	style?: ViewStyle;
}

export default class Header extends React.Component<IProps> {
	render() {
		return (
			<View style={{
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				height: 50,
				marginBottom: 10,
				zIndex: 1,
				...this.props.style,
			}}>
				<View style={{
					flexGrow: 1,
					alignItems: 'center',
					justifyContent: 'center',
					position: 'absolute',
				}}>
					{this.props.center}
				</View>
				<View style={{ flexShrink: 1 }}>{this.props.left}</View>
				<View style={{ flexGrow: 1 }} />
				<View style={{ flexShrink: 1 }}>{this.props.right}</View>
			</View>
		);
	}
}
