import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { inject, observer } from "mobx-react";
import { ISettingsStoreProps } from "../types";

interface IProps extends ISettingsStoreProps {
	pressed: any;
	options: { pk: any, text: string }[];
	onChange: (pk: any) => void;
	style: ViewStyle;
}

@inject('settingsStore')
@observer
export default class AnswerBlock extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	render() {
		return (
			<View style={this.props.style}>
				{(this.props.options.map(o => {
					const pressed = o.pk == this.props.pressed;
					return (
						<TouchableOpacity
							key={o.pk}
							onPress={() => this.props.onChange(o.pk)}
						>
							<View
								style={{
									backgroundColor: this.props.settingsStore.theme.colors.card,
									borderTopRightRadius: 16,
									borderTopLeftRadius: 16,
									borderBottomLeftRadius: 16,
									flexDirection: 'row',
									marginBottom: 15,
									paddingHorizontal: 20,
									paddingVertical: 15,
									borderColor: pressed ? '#FF3358' : this.props.settingsStore.theme.colors.card,
									borderWidth: 5,
								}}
							>
								<Text
									style={{
										fontSize: 20,
										fontWeight: '500',
										color: this.props.settingsStore.theme.colors.text,
										textAlign: 'left',
									}}
								>
									{o.text}
								</Text>
							</View>
						</TouchableOpacity>
					)
				}))}
			</View>
		);
	}
}
