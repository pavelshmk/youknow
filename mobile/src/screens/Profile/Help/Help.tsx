import React from 'react';
import { View, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import Header from '../../../components/Header';
import HeaderTitle from '../../../components/HeaderTitle';
import HelpBlock from '../../../components/HelpBlock';
import BackButton from '../../../components/BackButton';
const { width } = Dimensions.get('window');
import { inject, observer } from "mobx-react";
import { ISettingsNavigationStoreProps } from "../../../types";
import Layout from "../../../components/Layout";

@inject('settingsStore')
@observer
export default class Help extends React.Component<ISettingsNavigationStoreProps> {
	static defaultProps = {} as ISettingsNavigationStoreProps;

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Помощь" />,
				}}
			>
				<HelpBlock
					answer="Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia non consectetur culpa velit esse. Nisi labore consequat tempor esse amet"
					question="Как будет осуществляться вывод средств. Какие банковские системы?"
				/>
				<HelpBlock
					answer="Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia non consectetur culpa velit esse. Nisi labore consequat tempor esse amet"
					question="Как будет осуществляться вывод средств. Какие банковские системы?"
				/>
				<HelpBlock
					answer="Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia non consectetur culpa velit esse. Nisi labore consequat tempor esse amet"
					question="Как будет осуществляться вывод средств. Какие банковские системы?"
				/>
				<HelpBlock
					answer="Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia non consectetur culpa velit esse. Nisi labore consequat tempor esse amet"
					question="Как будет осуществляться вывод средств. Какие банковские системы?"
				/>
				<HelpBlock
					answer="Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia non consectetur culpa velit esse. Nisi labore consequat tempor esse amet"
					question="Как будет осуществляться вывод средств. Какие банковские системы?"
				/>
				<HelpBlock
					answer="Mollit qui laboris occaecat duis sunt consectetur aliqua nostrud Lorem exercitation. Commodo cillum quis culpa laborum sunt sint eiusmod elit nulla aute ullamco irure et. Sit officia non consectetur culpa velit esse. Nisi labore consequat tempor esse amet"
					question="Как будет осуществляться вывод средств. Какие банковские системы?"
				/>
			</Layout>
		);
	}
}
