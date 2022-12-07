import React from 'react';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { View, ViewStyle } from "react-native";

interface IProps {
	selectedIndex: number;
	onTabPress: (idx: number) => any;
	style?: ViewStyle;
}

export default class ControlTab extends React.Component<IProps> {
	render() {
		const { selectedIndex, onTabPress } = this.props;

		const tabStyle: ViewStyle = {
			borderColor: '#FF3358',
			backgroundColor: '#19232F',
			alignSelf: 'center',
		};

		const activeTabStyle = {
			backgroundColor: '#FF3358',
		};

		const tabTextStyle = {
			color: '#898F97',
		};

		return (
			<View style={this.props.style}>
				<SegmentedControlTab
					values={['Телефон', 'Почта']}
					selectedIndex={selectedIndex}
					onTabPress={onTabPress}
					borderRadius={15}
					tabStyle={tabStyle}
					activeTabStyle={activeTabStyle}
					tabTextStyle={tabTextStyle}
				/>
			</View>
		);
	}
}
