import React from 'react';
import { View, Text, TextInput, TextStyle, KeyboardTypeOptions, TextInputProps } from 'react-native';
import { ISettingsStoreProps } from "../types";
import { inject, observer } from "mobx-react";

interface IProps extends ISettingsStoreProps, TextInputProps {
	label?: string;
	keyboardType?: KeyboardTypeOptions;
	placeholder?: string;
}

@inject('settingsStore')
@observer
export default class InputBorder extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	render() {
		const { label, keyboardType, placeholder, ...props } = this.props;
		const textInputStyle = {
			height: 26,
			fontSize: 14,
			color: '#FFF',
			marginLeft: 15,
		};
		const labelStyle: TextStyle = {
			position: 'absolute',
			left: 0,
			top: 5,
			fontSize: 12,
			color: '#898F97',
			marginLeft: 15,
		};
		return (
			<View
				style={{
					paddingTop: 20,
					backgroundColor: this.props.settingsStore.theme.colors.input,
					borderRadius: 15,
					height: 50,
					marginBottom: 20,
					borderColor: '#4BC0C8',
					borderWidth: 3,
				}}
			>
				<Text style={labelStyle}>{label}</Text>
				<TextInput
					{...props}
					style={textInputStyle}
					keyboardType={keyboardType}
					placeholder={placeholder}
					placeholderTextColor={'#FFF'}
				/>
			</View>
		);
	}
}
