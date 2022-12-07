import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ImageSourcePropType,
	StyleProp,
	ViewStyle,
	ImageStyle
} from 'react-native';
import { inject, observer } from "mobx-react";
import { ISettingsStoreProps } from "../types";

interface IProps extends ISettingsStoreProps {
	name: string;
	image: ImageSourcePropType;
	data: string;
	onPress: () => any;
	style: StyleProp<ImageStyle>;
}

@inject('settingsStore')
@observer
export default class WinBlock extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	render() {
		const { name, image, data, onPress, style } = this.props;
		return (
			<TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPress}>
				<View
					style={{
						backgroundColor: this.props.settingsStore.theme.colors.card,
						height: 100,
						width: 155,
						borderBottomLeftRadius: 16,
						borderTopRightRadius: 16,
						borderTopLeftRadius: 16,
						marginRight: 15,
						paddingLeft: 15,
						paddingRight: 15,
					}}
				>
					<Image source={image} style={style} />
					<Text
						style={{
							// fontWeight: '600',
							fontSize: 16,
							color: this.props.settingsStore.theme.colors.text,
							fontWeight: '500',
							textAlign: 'left',
							top: 15,
						}}
					>
						{name}
					</Text>
					<Text
						style={{
							// fontWeight: '500',
							fontSize: 13,
							color: '#898F97',
							fontWeight: '500',
							textAlign: 'left',
							top: 15,
						}}
					>
						{data}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}
