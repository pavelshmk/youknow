import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface IProps {
	title?: string;
	subtitle?: string;
	linkTitle?: string;
	boldTitle?: string;
	onPress?: () => any;
	style?: ViewStyle;
}

export default class Title extends React.Component<IProps> {
	render() {
		const { title, subtitle, linkTitle, boldTitle, onPress, style } = this.props;
		const textTitleStyle: TextStyle = {
			fontStyle: 'normal',
			fontWeight: 'bold',
			fontSize: 32,
			lineHeight: 39,
			color: '#FFFFFF',
		};
		const descriptionStyle: TextStyle = {
			marginRight: 15,
		};
		const descriptionTextStyle: TextStyle = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			marginTop: 5,
			fontWeight: '500',
			color: '#898F97',
		};
		const descriptionTextLinkStyle: TextStyle = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			textAlign: 'center',
			fontWeight: '500',
			color: '#FF3358',
			marginTop: 5,
		};
		const descriptionTextBoldStyle: TextStyle = {
			fontStyle: 'normal',
			fontSize: 18,
			lineHeight: 20,
			textAlign: 'center',
			fontWeight: '500',
			color: '#FFF',
			marginTop: 5,
		};
		return (
			<View style={style}>
				<Text style={textTitleStyle}>{title}</Text>
				{subtitle || linkTitle || boldTitle ? (
					<View style={descriptionStyle}>
						<Text style={descriptionTextStyle}>
							{subtitle}
							{linkTitle ? (
								<Text style={descriptionTextLinkStyle} onPress={onPress}>
									{linkTitle}
								</Text>
							) : null}
							{boldTitle ? <Text style={descriptionTextBoldStyle}>{boldTitle}</Text> : null}
						</Text>
					</View>
				) : null}
			</View>
		);
	}
}
