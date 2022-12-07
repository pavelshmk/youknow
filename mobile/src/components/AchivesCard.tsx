import React from 'react';
import { Dimensions, Image, ImageSourcePropType, Text, TouchableOpacity } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { inject, observer } from "mobx-react";
import { ISettingsStoreProps } from "../types";

const { width } = Dimensions.get('window');

interface IProps extends ISettingsStoreProps {
	percent: number;
	image: ImageSourcePropType;
	title: string;
	onPress: () => any;
}

@inject('settingsStore')
@observer
export default class AchivesCard extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	render() {
		const { percent, image, title, onPress } = this.props;
		return (
			<TouchableOpacity
				style={{
					backgroundColor: this.props.settingsStore.theme.colors.card,
					height: 'auto',
					width: width / 2 - 20,
					borderBottomLeftRadius: 16,
					borderTopRightRadius: 16,
					borderTopLeftRadius: 16,
					padding: 15,
					marginBottom: 15,
					alignItems: 'center',
				}}
				onPress={onPress}
			>
				<ProgressCircle
					percent={percent}
					radius={46}
					borderWidth={5}
					color="#FF3358"
					shadowColor={this.props.settingsStore.theme.colors.bg1}
					bgColor={this.props.settingsStore.theme.colors.card}
				>
					<Image source={image} style={{ width: 64, height: 64 }} />
				</ProgressCircle>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 16,
						fontWeight: '600',
						color: this.props.settingsStore.theme.colors.text,
						textAlign: 'center',
						marginTop: 10,
					}}
				>
					{title}
				</Text>
			</TouchableOpacity>
		);
	}
}
