import React from 'react';
import {
	View,
	ScrollView,
	Dimensions,
	Text,
	Image,
	ImageBackground,
	TouchableOpacity,
	SafeAreaView, RefreshControl,
} from 'react-native';
import Header from '../../../components/Header';
import Logo from '../../../components/Logo';
import PenIcon from '../../../components/PenIcon';
import Modal from 'react-native-modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { inject, observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';
import { IAuthSettingsNavigationStoreProps } from '../../../types';
import { ImagePickerResult } from "expo-image-picker/src/ImagePicker.types";
import Toast from "react-native-root-toast";
import Layout from "../../../components/Layout";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

@inject('authStore', 'settingsStore')
@observer
export default class Profile extends React.Component<IAuthSettingsNavigationStoreProps> {
	static defaultProps = {} as IAuthSettingsNavigationStoreProps;

	state = {
		isModalVisible: false,
		name: '',
		lastname: '',
		avatar: null,
		loading: false,
	};

	componentDidMount() {
		this.setState({
			name: this.props.authStore.profile.name,
			avatar: this.props.authStore.profile.avatar,
		});
	}

	toggleModal = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible });
	};


	_pickAvatar = async () => {
		const result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: .5,
			base64: true,
		});

		if (result.cancelled != true) {
			this.setState({ avatar: `data:image/jpeg;base64,${result.base64}` });
		}
	};

	handleSubmit = async () => {
		this.setState({ loading: true });
		try {
			await this.props.authStore.updateProfile(this.state.avatar, this.state.name);
			this.toggleModal();
		} catch (e) {
			Toast.show('Произошла ошибка при обновлении профиля')
		} finally {
			this.setState({ loading: false });
		}
	};

	render() {
		const buttonActive = !this.state.loading && this.state.name;

		return (
			<Layout
				headerConfig={{ enabled: false }}
				scrollViewStyle={{ paddingHorizontal: 0 }}
			>
				<ImageBackground
					blurRadius={1}
					resizeMode={'cover'}
					style={{
						height: 231,
						marginBottom: 35,
					}}
					imageStyle={{ borderBottomRightRadius: 35, borderBottomLeftRadius: 35 }}
					source={{ uri: this.props.authStore.profile.avatar }}
				>
					<LinearGradient
						colors={['rgba(0,0,0,.5)', 'rgba(0,0,0,.5)', 'rgba(0,0,0,0)']}
						locations={[0, .6, .9]}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					/>
					<Header
						center={<Logo />}
						right={
							<TouchableOpacity onPress={this.toggleModal} style={{ width: 50, height: 50 }}>
								<PenIcon />
							</TouchableOpacity>
						}
					/>
					<View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
						<View style={{ flex: 1 }}>
							<Image
								source={{ uri: this.props.authStore.profile.avatar }}
								style={{ width: 70, height: 70, bottom: 5, borderRadius: 35, borderWidth: 4, borderColor: '#fff' }}
							/>
						</View>
						<View style={{ flex: 3 }}>
							<View style={{ flexDirection: 'row', marginBottom: 5 }}>
								<Text
									style={{
										fontSize: 24,
										lineHeight: 29,
										color: '#fff',
										fontWeight: 'bold',
									}}
								>
									{this.props.authStore.profile?.name || '...'}
								</Text>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											fontSize: 16,
											lineHeight: 20,
											color: '#fff',
											fontWeight: '600',
										}}
									>
										{this.props.authStore.profile?.balance || '...'} руб.
									</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											fontSize: 16,
											lineHeight: 20,
											color: '#fff',
											fontWeight: '600',
										}}
									>
										{this.props.authStore.profile?.wins || '0'}
									</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											fontSize: 13,
											lineHeight: 16,
											color: '#DADADA',
											fontWeight: '500',
										}}
									>
										баланс
									</Text>
								</View>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											fontSize: 13,
											lineHeight: 16,
											color: '#DADADA',
											fontWeight: '500',
										}}
									>
										побед
									</Text>
								</View>
							</View>
						</View>
					</View>
				</ImageBackground>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						marginLeft: 15,
						marginRight: 15,
						marginBottom: 20,
					}}
					onPress={() => this.props.navigation.navigate('ParticipationHistory')}
				>
					<View style={{ flex: 1 }}>
						<Image
							source={require('../../../assets/icons/time.png')}
							style={{ width: 20, height: 20 }}
						/>
					</View>
					<View style={{ flex: 17 }}>
						<Text
							style={{
								fontSize: 18,
								color: '#fff',
								marginBottom: 20,
								marginLeft: 15,
								textAlign: 'left',
								lineHeight: 22,
								fontWeight: 'bold',
							}}
						>
							История игр
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						marginLeft: 15,
						marginRight: 15,
						marginBottom: 20,
					}}
					onPress={() => this.props.navigation.navigate('BalanceHistory')}
				>
					<View style={{ flex: 1 }}>
						<Image
							source={require('../../../assets/icons/cash.png')}
							style={{ width: 20, height: 20 }}
						/>
					</View>
					<View style={{ flex: 17 }}>
						<Text
							style={{
								fontSize: 18,
								color: '#fff',
								marginBottom: 20,
								marginLeft: 15,
								textAlign: 'left',
								lineHeight: 22,
								fontWeight: 'bold',
							}}
						>
							Баланс
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						marginLeft: 15,
						marginRight: 15,
						marginBottom: 20,
					}}
					onPress={() => this.props.navigation.navigate('Settings')}
				>
					<View style={{ flex: 1 }}>
						<Image
							source={require('../../../assets/icons/settings.png')}
							style={{ width: 20, height: 20 }}
						/>
					</View>
					<View style={{ flex: 17 }}>
						<Text
							style={{
								fontSize: 18,
								color: '#fff',
								marginBottom: 20,
								marginLeft: 15,
								textAlign: 'left',
								lineHeight: 22,
								fontWeight: 'bold',
							}}
						>
							Настройки
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						marginLeft: 15,
						marginRight: 15,
						marginBottom: 20,
					}}
					onPress={() => this.props.navigation.navigate('Help')}
				>
					<View style={{ flex: 1 }}>
						<Image
							source={require('../../../assets/icons/help.png')}
							style={{ width: 20, height: 20 }}
						/>
					</View>
					<View style={{ flex: 17 }}>
						<Text
							style={{
								fontSize: 18,
								color: '#fff',
								marginBottom: 20,
								marginLeft: 15,
								textAlign: 'left',
								lineHeight: 22,
								fontWeight: 'bold',
							}}
						>
							Помощь
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						marginLeft: 15,
						marginRight: 15,
						marginBottom: 75,
					}}
					onPress={() => this.props.authStore.logout()}
				>
					<View style={{ flex: 1 }} />
					<View style={{ flex: 17 }}>
						<Text
							style={{
								fontSize: 18,
								color: '#FF3358',
								marginBottom: 20,
								marginLeft: 15,
								textAlign: 'left',
								lineHeight: 22,
								fontWeight: 'bold',
							}}
						>
							Выйти
						</Text>
					</View>
				</TouchableOpacity>
				<Modal
					isVisible={this.state.isModalVisible}
					onBackdropPress={this.toggleModal}
					onBackButtonPress={this.toggleModal}
				>
					<View
						style={{
							width: width - 30,
							height: 'auto',
							backgroundColor: this.props.settingsStore.theme.colors.bg2,
							borderRadius: 16,
							padding: 15
						}}
					>
						<Text style={{ fontSize: 16, color: '#898F97', marginBottom: 20 }}>
							Ваши данные
						</Text>
						<TouchableOpacity onPress={this._pickAvatar}>
							<Image
								source={{ uri: this.state.avatar }}
								style={{ width: 90, height: 90, bottom: 15, alignSelf: 'center', borderRadius: 45, borderWidth: 5, borderColor: '#fff' }}
							/>
						</TouchableOpacity>
						<Input
							label="Имя"
							value={this.state.name}
							onChangeText={(text) => this.setState({ name: text })}
							style={{ marginBottom: 15 }}
						/>
						<Button
							buttonTitle="Сохранить"
							onPress={this.handleSubmit}
							disabled={!buttonActive}
							block
						/>
					</View>
				</Modal>
			</Layout>
		);
	}
}
