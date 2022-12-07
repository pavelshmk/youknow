import React from 'react';
import { View, Dimensions, Image, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { ISettingsStoreProps } from "../types";
import { inject, observer } from "mobx-react";

const { width } = Dimensions.get('window');

interface IProps extends ISettingsStoreProps {
	onPress: () => any;
	value?: string;
	onChange?: (text: string) => any;
	style: ViewStyle;
}

@inject('settingsStore')
@observer
export default class SearchBlock extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	render() {
		const { onPress, style, value, onChange } = this.props;
		return (
			<View
				style={{
					...style,
					flexDirection: 'row',
					backgroundColor: this.props.settingsStore.theme.colors.card,
					height: 50,
					width: '100%',
					borderRadius: 15,
					paddingLeft: 15,
					paddingTop: 15,
					alignItems: 'center',
				}}
			>
				<View style={{ flex: 1 }}>
					<Image
						source={require('../assets/icons/search.png')}
						style={{ width: 20, height: 20, bottom: 10 }}
					/>
				</View>
				<View style={{ flex: 10 }}>
					<TextInput
						style={{ bottom: 10, marginLeft: 10, marginRight: 10, color: this.props.settingsStore.theme.colors.text }}
						value={value}
						onChangeText={onChange}
					/>
				</View>
				<TouchableOpacity style={{ flex: 1, alignContent: 'flex-end', padding: 10, marginBottom: 15 }} onPress={onPress}>
					<Image
						source={require('../assets/icons/filter.png')}
						style={{ width: 20, height: 20, tintColor: '#898F97' }}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}
