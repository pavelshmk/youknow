import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

interface IProps {
	options: { key: string, text: string }[];
	onPress: (key: string) => any;
	activeKey?: string;
}

export default class RadioButton extends React.Component<IProps> {
	render() {
		const { options, onPress, activeKey } = this.props;

		return (
			<View>
				{options.map(item => {
					return (
						<TouchableOpacity
							key={item.key}
							style={styles.buttonContainer}
							onPress={() => onPress(item.key)}
						>
							<View
								style={styles.circle}
							>
								{activeKey === item.key && <View style={styles.checkedCircle} />}
							</View>
							<View style={{ flex: 7 }}>
								<Text style={{ fontSize: 16, color: '#fff' }}>{item.text}</Text>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 15,
	},

	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 3,
		borderColor: '#FF3358',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 15,
	},

	checkedCircle: {
		width: 8,
		height: 8,
		borderRadius: 7,
		backgroundColor: '#FF3358',
	},
});
