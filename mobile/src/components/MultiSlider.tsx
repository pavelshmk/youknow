import React from 'react';
import { View, Text, Dimensions, TextStyle, ViewStyle } from 'react-native';
import MultiSlider_ from '@ptomasroos/react-native-multi-slider';
const { width } = Dimensions.get('window');

interface IProps {
	title: string;
	max: number;
	start?: number;
	finish?: number;
	onChange?: (start: number, finish: number) => any
}

export default class MultiSlider extends React.Component<IProps> {
	render() {
		const { title, max, start, finish, onChange } = this.props;

		const titleStyle: ViewStyle = {
			flexDirection: 'row',
			flex: 1,
		};

		const titleTextStyle: TextStyle = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			top: 25,
			fontWeight: '500',
			color: '#898F97',
			height: 50,
			flex: 1,
		};

		const price1Style: TextStyle = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			top: 25,
			fontWeight: '500',
			color: '#FFF',
			height: 50,
			textAlign: 'right',
		};
		const price2Style: TextStyle = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			top: 25,
			fontWeight: '500',
			color: '#FFF',
			height: 50,
			textAlign: 'left',
		};

		return (
			<View style={{ marginBottom: 20 }}>
				<View style={titleStyle}>
					<Text style={titleTextStyle}>{title}</Text>
					<Text style={price1Style}>₽₽ {start || 0} - </Text>
					<Text style={price2Style}>{finish || '∞'}</Text>
				</View>
				<MultiSlider_
					values={[start || 0, finish || max]}
					sliderLength={width - 60}
					onValuesChange={([start, finish]) => onChange && onChange(start, finish == max ? null : finish)}
					min={0}
					max={max}
					step={1}
					containerStyle={{
						paddingHorizontal: 15,
					}}
					selectedStyle={{
						backgroundColor: '#FF3358',
						height: 4,
					}}
					unselectedStyle={{
						backgroundColor: '#9597A1',
						height: 4,
						borderRadius: 6,
					}}
					markerStyle={{
						backgroundColor: '#FFFFFF',
						width: 13,
						height: 13,
						top: 1,
					}}
				/>
			</View>
		);
	}
}
