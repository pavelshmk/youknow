import React from 'react';
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle, ImageProps } from 'react-native';

interface IProps {
	place: number;
	name: string;
	points: string;
	time: string;
	image: string;
}

export default class RankingRow extends React.Component<IProps> {
	render() {
		const { place, name, points, time, image } = this.props;
		const viewStyle: ViewStyle = {
			flexDirection: 'row',
		};
		const textNumberStyle: TextStyle = {
			fontWeight: 'bold',
			fontSize: 20,
			color: '#898F97',
			textAlign: 'left',
			top: 12,
		};
		const textPointsStyle: TextStyle = {
			fontSize: 13,
			fontWeight: 'bold',
			lineHeight: 16,
			color: '#FEAC5E',
			textAlign: 'right',
			top: 8,
			marginBottom: 10,
		};
		const textTimeStyle: TextStyle = {
			fontWeight: '500',
			lineHeight: 13,
			fontSize: 11,
			color: '#FEAC5E',
			textAlign: 'right',
		};
		const imageStyle: ImageStyle = {
			width: 30,
			height: 30,
			alignSelf: 'flex-start',
			top: 10,
			borderRadius: 15,
		};
		const textNameStyle: TextStyle = {
			fontWeight: '600',
			fontSize: 13,
			color: '#FFF',
			textAlign: 'left',
			top: 16,
		};
		return (
			<View style={viewStyle}>
				<View style={{ flex: 0.8, height: 50 }}>
					<Text style={textNumberStyle}>{place}</Text>
				</View>
				<View style={{ flex: 1, height: 50 }}>
					<Image source={{ uri: image }} style={imageStyle} />
				</View>
				<View style={{ flex: 3, height: 50 }}>
					<Text style={textNameStyle}>{name}</Text>
				</View>
				<View style={{ flex: 2, height: 50 }}>
					<Text style={textPointsStyle}>{points}</Text>
					<Text style={textTimeStyle}>{time}</Text>
				</View>
			</View>
		);
	}
}
