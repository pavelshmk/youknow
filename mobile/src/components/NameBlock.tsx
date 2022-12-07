import React from 'react';
import { View, Text, Image, ImageSourcePropType, TextStyle } from 'react-native';

interface IProps {
	name: string;
	image: ImageSourcePropType;
	style: TextStyle;
	reversed: boolean;
}

export default class NameBlock extends React.Component<IProps> {
    static defaultProps = {} as IProps;

	render() {
		const { name, image, style, reversed } = this.props;
		return (
			<View
				style={{
					flexDirection: reversed ? 'row-reverse' : 'row',
				}}
			>
				<Image
					source={image}
					style={{
						width: 30,
						height: 30,
						marginRight: reversed ? 0 : 10,
						marginLeft: reversed ? 10 : 0,
						borderRadius: 15,
					}}
				/>
				<Text style={{ ...style, top: 6 }}>
					{name}
				</Text>
			</View>
		);
	}
}
