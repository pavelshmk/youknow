import React from 'react';
import { View, Text, Dimensions, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import RankingRow from '../../../components/RankingRow';
import Header from '../../../components/Header';
import HeaderTitle from '../../../components/HeaderTitle';
import HeaderRedTitle from '../../../components/HeaderRedTitle';
import Quit from '../../../components/Quit';
import { INavigationProps } from "../../../types";
import BackButton from "../../../components/BackButton";
import { RouteProp } from "@react-navigation/native";
import { ParamList } from "../../../Root";
import ruplu from "../../../libs/ruplu";
import Layout from "../../../components/Layout";

const { width } = Dimensions.get('window');

interface IProps extends INavigationProps {
	route: RouteProp<ParamList, 'FinishRanking'>;
}

export default class FinishRanking extends React.Component<IProps> {
	render() {
		const ranking = this.props.route.params.response.ranking;

		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Результаты" />,
				}}
			>
				{ranking.map((r, i) => (
					<RankingRow
						place={i+1}
						key={i}
						name={r.user.name}
						image={r.user.avatar}
						points={ruplu('балл', 'балла', 'баллов')(r.points, true)}
						time={`${Math.floor(r.time / 60)}:${(r.time % 60).toString().padStart(2, '0')}`}
					/>
				))}
			</Layout>
		);

		return (
			<View style={{ flex: 1, backgroundColor: '#19232F', alignItems: 'center' }}>
				<SafeAreaView style={{ width: '100%', height: '100%' }}>
					<View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
						<Header
							left={
								<TouchableOpacity onPress={() => this.props.navigation.navigate('MainPage')}>
									<View style={{ width: 40, height: 50 }}>
										<BackButton onPress={() => this.props.navigation.goBack()}/>
									</View>
								</TouchableOpacity>
							}
							center={<View style={{ bottom: 7 }}><HeaderTitle title="Результаты" /></View>}
						/>
					</View>
					<ScrollView style={{ paddingHorizontal: 15 }}>
						{ranking.map((r, i) => (
							<RankingRow
								place={i+1}
								key={i}
								name={r.user.name}
								image={r.user.avatar}
								points={ruplu('балл', 'балла', 'баллов')(r.points, true)}
								time={`${Math.floor(r.time / 60)}:${(r.time % 60).toString().padStart(2, '0')}`}
							/>
						))}
					</ScrollView>
					<View style={{ marginBottom: 50 }} />
				</SafeAreaView>
			</View>
		);
	}
}
