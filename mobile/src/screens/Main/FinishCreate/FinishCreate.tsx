import React from 'react';
import { View, Text, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import HeaderTitle from '../../../components/HeaderTitle';
import Quit from '../../../components/Quit';
import { ScrollView } from 'react-native-gesture-handler';
import { inject, observer } from "mobx-react";
import { ISettingsNavigationStoreProps } from "../../../types";
import QuizCard from "../../../components/QuizCard";
import { ParamList } from "../../../Root";
import Layout from "../../../components/Layout";

const { height, width } = Dimensions.get('window');

interface IProps extends ISettingsNavigationStoreProps {
	route: RouteProp<ParamList, 'FinishCreate'>;
}

@inject('settingsStore')
@observer
export default class FinishCreate extends React.Component<IProps> {
	static defaultProps = {} as ISettingsNavigationStoreProps;

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Викторина создана" />,
				}}
				footer={
					<Button
						buttonTitle="Продолжить"
						onPress={() => this.props.navigation.navigate('MainPage')}
						block
					/>
				}
			>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 20,
						fontWeight: 'bold',
						color: '#FFF',
						marginBottom: 10,
						textAlign: 'center',
					}}
				>
					Поздравляем!
				</Text>
				<Text
					style={{
						fontStyle: 'normal',
						fontSize: 16,
						lineHeight: 20,
						fontWeight: '500',
						color: '#FFF',
						marginBottom: 40,
						textAlign: 'center',
					}}
				>
					Вы успешно создали викторину
				</Text>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('QuizInfo', { pk: this.props.route.params.quiz.pk })}>
					<QuizCard data={this.props.route.params.quiz} />
				</TouchableOpacity>
			</Layout>
		);
	}
}
