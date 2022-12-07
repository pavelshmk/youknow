import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ISettingsStoreProps } from "../types";
import { inject, observer } from "mobx-react";

interface IProps extends ISettingsStoreProps {
	answer: string;
	question: string;
}

@inject('settingsStore')
@observer
export default class HelpBlock extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	state = { pressStatus: true };

	_onShowUnderlay() {
		if (!this.state.pressStatus) {
			this.setState({ pressStatus: true });
		} else {
			this.setState({ pressStatus: false });
		}
	}
	render() {
		const { question, answer } = this.props;
		return (
			<View
				style={{
					backgroundColor: this.props.settingsStore.theme.colors.card,
					height: 'auto',
					borderTopRightRadius: 16,
					borderTopLeftRadius: 16,
					borderBottomLeftRadius: 16,
					marginBottom: 15,
			    }}
			>
				<TouchableOpacity onPress={this._onShowUnderlay.bind(this)} style={{ flexDirection: 'row' }}>
					<View style={{ flex: 4 }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								lineHeight: 20,
								marginTop: 15,
								marginBottom: 15,
								marginLeft: 15,
								textAlign: 'left',
								color: this.props.settingsStore.theme.colors.text,
							}}
						>
							{question}
						</Text>
					</View>
					<View style={{ flex: 0.8 }}>
						<Image
							source={require('../assets/icons/down.png')}
							style={{ width: 32, height: 34, top: 25, left: 15, tintColor: this.props.settingsStore.theme.colors.text, }}
						/>
					</View>
				</TouchableOpacity>
				{this.state.pressStatus ? null : (
					<Text
						style={{
							// textAlign: 'center',
							fontSize: 13,
							fontWeight: '500',
							color: this.props.settingsStore.theme.colors.text,
							textAlign: 'left',
							marginLeft: 15,
							marginBottom: 15,
						}}
					>
						{answer}
					</Text>
				)}
			</View>
		);
	}
}
