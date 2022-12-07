import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Slider from 'react-native-slider';
const { width } = Dimensions.get('window');

export default class Multislider extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			values: 70,
		};
	}
	multiSliderValuesChange = values => {
		this.setState({
			values,
		});
	};
	render() {
		const { title } = this.props;

		const titleStyle = {
			flexDirection: 'row',
			flex: 1,
		};

		const titleTextStyle = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			top: 25,
			fontWeight: '500',
			color: '#898F97',
			width: '40%',
			height: 50,
		};

		const price1Style = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			top: 25,
			fontWeight: '500',
			color: '#FFF',
			width: '40%',
			height: 50,
			textAlign: 'right',
		};
		const price2Style = {
			fontStyle: 'normal',
			fontSize: 16,
			lineHeight: 20,
			top: 25,
			fontWeight: '500',
			color: '#FFF',
			width: '26%',
			height: 50,
			textAlign: 'left',
		};

		return (
			<View style={{ marginBottom: 20 }}>
				<View style={titleStyle}>
					<Text style={titleTextStyle}>{title}</Text>
					<Text style={price1Style}>₽1тыс. - </Text>
					<Text style={price2Style}>₽{this.state.values}тыс.</Text>
				</View>
				<Slider
					value={this.state.values}
					style={{ width: width - 30 }}
					onValueChange={this.multiSliderValuesChange}
					minimumValue={0}
					maximumValue={100}
					step={1}
					minimumTrackTintColor={'#FF3358'}
					maximumTrackTintColor={'#9597A1'}
					thumbStyle={{
						backgroundColor: '#FFFFFF',
						width: 13,
						height: 13,
					}}
				/>
			</View>
		);
	}
}
