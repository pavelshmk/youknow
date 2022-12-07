import React, { ReactNode } from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { inject, observer } from "mobx-react";
import { ISettingsStoreProps } from "../types";

interface IProps extends ISettingsStoreProps {
	buttonTitle?: string;
	children?: ReactNode;
	onPress: () => any;
	disabled?: boolean;
	outline?: boolean;
	style?: ViewStyle;
	block?: boolean;
}

@inject('settingsStore')
@observer
export default class Button extends React.Component<IProps> {
	static defaultProps = {} as IProps;

	render() {
		const { buttonTitle, onPress, disabled, outline, style, block, children } = this.props;
		const buttonStyle: ViewStyle = {
			backgroundColor: outline ? null : this.props.settingsStore.theme.colors.primary,
			borderRadius: 15,
			alignSelf: 'center',
			shadowColor: 'rgba(255, 51, 88, 0.6)',
			shadowOpacity: 0.8,
			shadowRadius: 15,
			shadowOffset: {
				height: -1,
				width: 0,
			},
			opacity: disabled ? .5 : 1,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 10,
			borderWidth: 5,
			borderColor: this.props.settingsStore.theme.colors.primary,
			width: block ? '100%' : 'auto',
			...style,
		};
		const textStyle: TextStyle = {
			color: outline ? this.props.settingsStore.theme.colors.primary : 'white',
			lineHeight: 20,
			fontWeight: 'bold',
			fontSize: 18,
			textAlignVertical: 'center',
		};
		return (
			<TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
				{buttonTitle ? <Text style={textStyle}>{buttonTitle}</Text> : children}
			</TouchableOpacity>
		);
	}
}
