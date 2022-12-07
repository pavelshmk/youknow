import React from 'react';
import { View, TouchableOpacity, Text, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { inject, observer } from "mobx-react";
import { ISettingsStoreProps } from "../types";

interface IProps extends ISettingsStoreProps {
	options: { key: any, text: string }[];
	title: string;
	onChange: (key: any) => any;
	value: any;
	clearable?: boolean;
	disabled?: boolean;
}

@inject('settingsStore')
@observer
export default class RadioList extends React.Component<IProps> {
	static defaultProps = {} as IProps;

	render() {
		const { options, title, value, disabled } = this.props;

		const container: ViewStyle = {
			marginBottom: 24,
			alignItems: 'center',
			flexDirection: 'row',
		};

		const radioText: TextStyle = {
			fontSize: 16,
			color: disabled ? '#898F97' : this.props.settingsStore.theme.colors.text,
			fontWeight: '500',
			marginLeft: 10,
		};

		const radioCircle: ViewStyle = {
			height: 20,
			width: 20,
			borderRadius: 10,
			borderWidth: 3,
			padding: 3,
			borderColor: '#545964',
			alignItems: 'center',
			justifyContent: 'center',
		};

		const selectedRb: ViewStyle = {
			width: '100%',
			height: '100%',
			borderRadius: 5,
			backgroundColor: '#FF3358',
		};

		const titleStyle: TextStyle = {
			fontSize: 16,
			color: '#898F97',
			marginBottom: 10,
		};

		return (
			<View>
				<Text style={titleStyle}>{title}</Text>
				{options.map(res => {
					return (
						<TouchableOpacity key={res.key} style={container}
							onPress={() => {
								this.props.onChange(this.props.clearable && res.key == this.props.value ? undefined : res.key);
							}}
							disabled={disabled}
						>
							<View
								style={radioCircle}
							>
								{value === res.key && (
									<View style={selectedRb} />
								)}
							</View>
							<Text style={radioText}>{res.text}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}
}
