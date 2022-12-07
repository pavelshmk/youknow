import React, { RefObject } from 'react';
import {
	View,
	Text,
	TextInput,
	TextStyle,
	KeyboardTypeOptions,
	TextInputProps,
	TouchableWithoutFeedback, ViewStyle, TouchableOpacity, Image
} from 'react-native';
import { ISettingsStoreProps } from "../types";
import { inject, observer } from "mobx-react";
import { ImagePickerResult } from "expo-image-picker/src/ImagePicker.types";
import * as ImagePicker from "expo-image-picker";

interface IProps extends ISettingsStoreProps, TextInputProps {
	label?: string;
	keyboardType?: KeyboardTypeOptions;
	placeholder?: string;
	style?: ViewStyle;
	withImage?: boolean;
	image?: string;
	onImageChange?: (val: string) => any;
	disabled?: boolean;
}

@inject('settingsStore')
@observer
export default class Input extends React.Component<IProps> {
    static defaultProps = {} as IProps;
    ref?: TextInput;

	pickImage = async () => {
		const result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: .8,
			base64: true,
		});

		if (result.cancelled != true) {
			this.props.onImageChange(`data:image/jpeg;base64,${result.base64}`);
		}
	};

	render() {
		const { label, keyboardType, placeholder, style, withImage, image, onImageChange, disabled, ...props } = this.props;

		return (
			<TouchableWithoutFeedback onPress={() => this.ref.focus()} disabled={disabled}>
				<View
					style={{
						backgroundColor: this.props.settingsStore.theme.colors.input,
						borderRadius: 15,
						padding: 5,
						...style,
					}}
				>
					<View style={{
						flexDirection: 'row',
					}}>
						<Text
							style={{
								fontSize: 12,
								color: '#898F97',
								marginLeft: 15,
								marginTop: 5,
							}}
						>
							{label}
						</Text>
						{withImage ? (
							<React.Fragment>
								<TouchableOpacity
									onPress={this.pickImage}
									style={{
										padding: 5,
									}}
									disabled={disabled}
								>
									<Image
										source={require('../assets/icons/add.png')}
										style={{ width: 15, height: 15 }}
									/>
								</TouchableOpacity>
								{image ? (
									<TouchableOpacity
										onPress={() => onImageChange(undefined)}
										style={{
											padding: 5,
										}}
										disabled={disabled}
									>
										<Image
											source={require('../assets/icons/delete.png')}
											style={{ width: 15, height: 15 }}
										/>
									</TouchableOpacity>
								) : null}
							</React.Fragment>
						) : null}
					</View>
					{image ? (
						<Image
							source={{ uri: image }}
							style={{ width: 50, height: 50, marginLeft: 15 }}
						/>
					) : null}
					<TextInput
						{...props}
						style={{
							height: 26,
							fontSize: 14,
							color: disabled ? '#898F97' : '#FFF',
							marginLeft: 15,
						}}
						editable={!disabled}
						keyboardType={keyboardType}
						placeholder={placeholder}
						placeholderTextColor={'#777'}
						ref={ref => this.ref = ref}
					/>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}
