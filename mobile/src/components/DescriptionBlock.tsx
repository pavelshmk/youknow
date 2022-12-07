import React from 'react';
import { Text, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ISettingsStoreProps } from "../types";
import { inject, observer } from "mobx-react";
import ReadMore from 'react-native-read-more-text';

interface IProps extends ISettingsStoreProps {
	description: string;
	style?: ViewStyle;
}

@inject('settingsStore')
@observer
export default class DescriptionBlock extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	render() {
		const { description, style } = this.props;
		return (
			<ReadMore
				numberOfLines={3}
				renderTruncatedFooter={
					onPress => (
						<Text onPress={onPress} style={{ color: '#fff', textAlign: 'center' }}>
							Развернуть
						</Text>
					)
				}
				renderRevealedFooter={
					onPress => (
						<Text onPress={onPress} style={{ color: '#fff', textAlign: 'center' }}>
							Свернуть
						</Text>
					)
				}
				style={style}
			>
				<Text style={{
					fontSize: 16,
					color: '#FFFFFF',
					textAlign: 'left',
				}}>
					{description}
				</Text>
			</ReadMore>
		);
		/*return this.state.pressStatus ? (
			<TouchableOpacity onPress={this._onShowUnderlay.bind(this)}>
				<Text
					style={{
						fontSize: 16,
						color: '#FFFFFF',
						textAlign: 'left',
						marginBottom: 35,
						marginLeft: 15,
						marginRight: 15,
						height: 120,
					}}
				>
					{description}
				</Text>
				<LinearGradient
					start={{ x: 0.0, y: 0.0 }}
					end={{ x: 0.0, y: 1.0 }}
					locations={[0.0, 1.0]}
					colors={['rgba(9, 18, 28, 0)', this.props.settingsStore.theme.colors.gradient]}
					// useViewFrame={false}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 15,
						width: 'auto',
					}}
				/>
				<TouchableOpacity style={{ alignSelf: 'center' }} onPress={this._onShowUnderlay.bind(this)}>
					<Image
						source={require('../assets/icons/down.png')}
						style={{ width: 32, height: 34, top: -55, marginBottom: -55 }}
					/>
				</TouchableOpacity>
			</TouchableOpacity>
		) : (
			<TouchableOpacity onPress={this._onShowUnderlay.bind(this)}>
				<Text
					style={{
						fontSize: 16,
						color: '#FFFFFF',
						textAlign: 'left',
						marginBottom: 15,
						marginLeft: 15,
						marginRight: 15,
					}}
				>
					Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo
					cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia
					non consectetur culpa velit esse. Nisi labore consequat tempor esse amet
				</Text>
			</TouchableOpacity>
		);*/
	}
}
