import React from 'react';
import { Provider } from 'mobx-react';
import Root from './src/Root';
import { rootStore } from './src/stores';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';

const images = [
	require('./src/assets/icons/achive.png'),
	require('./src/assets/icons/active_achive.png'),
	require('./src/assets/icons/active_home.png'),
	require('./src/assets/icons/active_profile.png'),
	require('./src/assets/icons/active_quiz.png'),
	require('./src/assets/icons/add.png'),
	require('./src/assets/icons/back.png'),
	require('./src/assets/icons/bg.png'),
	require('./src/assets/icons/bookIcon.png'),
	require('./src/assets/icons/calendar.png'),
	require('./src/assets/icons/car.png'),
	require('./src/assets/icons/carIcon.png'),
	require('./src/assets/icons/cash.png'),
	require('./src/assets/icons/checkmark.png'),
	require('./src/assets/icons/copy.png'),
	require('./src/assets/icons/delete.png'),
	require('./src/assets/icons/done.png'),
	require('./src/assets/icons/dots.png'),
	require('./src/assets/icons/down.png'),
	require('./src/assets/icons/filter.png'),
	require('./src/assets/icons/find.png'),
	require('./src/assets/icons/help.png'),
	require('./src/assets/icons/home.png'),
	require('./src/assets/icons/leader.png'),
	require('./src/assets/icons/logo.png'),
	require('./src/assets/icons/medal.png'),
	require('./src/assets/icons/money.png'),
	require('./src/assets/icons/no.png'),
	require('./src/assets/icons/pen.png'),
	require('./src/assets/icons/plus.png'),
	require('./src/assets/icons/price.png'),
	require('./src/assets/icons/profile.png'),
	require('./src/assets/icons/quit.png'),
	require('./src/assets/icons/quiz.png'),
	require('./src/assets/icons/right.png'),
	require('./src/assets/icons/search.png'),
	require('./src/assets/icons/settings.png'),
	require('./src/assets/icons/share.png'),
	require('./src/assets/icons/tag.png'),
	require('./src/assets/icons/time.png'),
	require('./src/assets/icons/yes.png'),
];

export default class App extends React.Component {
	state = {
		isLoadingComplete: false,
	};

	handleResourcesAsync = async () => {
		const cacheImages = images.map((image) => {
			return Asset.fromModule(image).downloadAsync();
		});
		await Promise.all(cacheImages);
	};

	render() {
		if (!this.state.isLoadingComplete) {
			return (
				<AppLoading
					startAsync={this.handleResourcesAsync}
					onError={(error) => console.warn(error)}
					onFinish={() => this.setState({ isLoadingComplete: true })}
				/>
			);
		}
		return (
			<Provider {...rootStore}>
				<Root />
			</Provider>
		);
	}
}