import React from 'react';
import { View, TouchableOpacity, Text, Image, TextStyle} from 'react-native';

interface IProps {
	options: { key: any; text: string }[];
	title: string;
	onChange: (key: any) => any;
	value: any;
	clearable?: boolean;
}

export default class CheckBoxList extends React.Component<IProps> {
	state = {
		selected1: false,
		selected2: false,
		selected3: false,
		selected4: false,
	};
	render() {
		const { title } = this.props;
		const { selected1, selected2, selected3, selected4 } = this.state;

		const titleStyle: TextStyle = {
			fontSize: 16,
			color: '#898F97',
			marginBottom: 10,
		};

		return (
			<View style={{ marginBottom: 20, marginTop: 40 }}>
				<Text style={titleStyle}>{title}</Text>
				<TouchableOpacity
					style={{
						width: '80%',
						marginBottom: 10,
						flexDirection: 'row',
						alignItems: 'center',
					}}
					onPress={() => this.setState({ selected1: !selected1 })}
				>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 4,
							borderWidth: 3,
							borderColor: '#9597A1',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View
							style={{
								width: 20,
								height: 20,
								borderRadius: 4,
								backgroundColor: selected1 ? '#FF3358' : null,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{selected1 ? (
								<Image source={require('../assets/icons/done.png')} style={{ width: 17, height:17 }} />
							) : null}
						</View>
					</View>
					<Text
						style={{
							...{ marginLeft: 5 },
							color: '#fff',
							fontWeight: 'normal',
						}}
					>
						Категория1
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						width: '80%',
						marginBottom: 10,
						flexDirection: 'row',
						alignItems: 'center',
					}}
					onPress={() => this.setState({ selected2: !selected2 })}
				>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 4,
							borderWidth: 3,
							borderColor: '#9597A1',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View
							style={{
								width: 20,
								height: 20,
								borderRadius: 4,
								backgroundColor: selected2 ? '#FF3358' : null,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{selected2 ? (
								<Image source={require('../assets/icons/done.png')} style={{ width: 17, height:17 }} />
							) : null}
						</View>
					</View>
					<Text
						style={{
							...{ marginLeft: 5 },
							color: '#fff',
							fontWeight: 'normal',
						}}
					>
						Категория2
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						width: '80%',
						marginBottom: 10,
						flexDirection: 'row',
						alignItems: 'center',
					}}
					onPress={() => this.setState({ selected3: !selected3 })}
				>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 4,
							borderWidth: 3,
							borderColor: '#9597A1',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View
							style={{
								width: 20,
								height: 20,
								borderRadius: 4,
								backgroundColor: selected3 ? '#FF3358' : null,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{selected3 ? (
								<Image source={require('../assets/icons/done.png')} style={{ width: 17, height:17 }} />
							) : null}
						</View>
					</View>
					<Text
						style={{
							...{ marginLeft: 5 },
							color: '#fff',
							fontWeight: 'normal',
						}}
					>
						Категория3
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						width: '80%',
						marginBottom: 10,
						flexDirection: 'row',
						alignItems: 'center',
					}}
					onPress={() => this.setState({ selected4: !selected4 })}
				>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 4,
							borderWidth: 3,
							borderColor: '#9597A1',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View
							style={{
								width: 20,
								height: 20,
								borderRadius: 4,
								backgroundColor: selected4 ? '#FF3358' : null,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{selected4 ? (
								<Image source={require('../assets/icons/done.png')} style={{ width: 17, height:17 }} />
							) : null}
						</View>
					</View>
					<Text
						style={{
							...{ marginLeft: 5 },
							color: '#fff',
							fontWeight: 'normal',
						}}
					>
						Категория4
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

