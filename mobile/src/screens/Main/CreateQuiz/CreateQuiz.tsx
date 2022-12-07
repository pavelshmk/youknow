import React  from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import HeaderTitle from '../../../components/HeaderTitle';
import RadioList from '../../../components/RadioList';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { inject, observer } from "mobx-react";
import { ISettingsNavigationQuizStoreProps } from "../../../types";
import { ICreateQuizData, ICreateQuizQuestionData } from "../../../api";
import Toast from "react-native-root-toast";
import Layout from "../../../components/Layout";
import _ from "lodash";
import { ParamList } from "../../../Root";

class Option {
	text: string = '';
	comment: string = '';

	isValid() {
		return Boolean(this.text.length);
	}
}

class Question {
	text: string = '';
	correctOption: Option = new Option();
	options: Option[] = [new Option()];
	image?: string;

	isValid() {
		return this.text.length && [...this.options, this.correctOption].every(o => o.isValid());
	}

	toData(): ICreateQuizQuestionData {
		return {
			text: this.text,
			answer: 0,
			options: [this.correctOption, ...this.options].map(o => o.text),
			correct_comment: this.correctOption.comment,
			image: this.image,
		}
	}
}

interface IProps extends ISettingsNavigationQuizStoreProps {
	route: RouteProp<ParamList, 'CreateQuiz'>;
}

interface IState {
	foundation?: number;
	category: number;
	entryPrice: string;
	title: string;
	description: string;
	minutes: string;
	minPlayers: string;
	questionLength: string;
	sponsor: string;
	loading: boolean;
	questions: Question[];
	copy_id?: number;
}

@inject('settingsStore', 'quizStore')
@observer
export default class CreateQuiz extends React.Component<IProps, IState> {
	static defaultProps = {} as IProps;
	private layoutRef: Layout;
	private lastQuestionRef: View;

	state: IState = {
		category: -1,
		entryPrice: '',
		title: '',
		description: '',
		minutes: '',
		minPlayers: '',
		questionLength: '',
		sponsor: '0',
		loading: false,
		questions: [new Question()],
	};

	componentDidMount() {
		this.props.navigation.addListener('focus', async () => {
			const source = this.props.route.params?.copy || this.props.route.params?.edit;
			if (source) {
				this.setState({
					category: source.category.pk,
					title: source.title,
					description: source.description,
					copy_id: this.props.route.params.copy?.pk,
				});
				if (source.questions)
					this.setState({
						questions: source.questions as Question[],
					});
			}
		});
	}

	buttonActive = () => {
		return !this.state.loading &&
			parseFloat(this.state.entryPrice) >= 0 &&
			this.state.title &&
			this.state.description &&
			parseInt(this.state.minPlayers) >= 2 &&
			this.state.category != -1 &&
			parseFloat(this.state.sponsor) >= 0 &&
			parseInt(this.state.minutes) > 0 &&
			this.state.questions.every(q => q.isValid());
	};

	handleSubmit = async () => {
		this.setState({ loading: true });
		const data: ICreateQuizData = {
			foundation: this.state.foundation,
			category: this.state.category,
			title: this.state.title,
			description: this.state.description,
			price: parseFloat(this.state.entryPrice).toString(),
			minutes: parseInt(this.state.minutes),
			players: parseInt(this.state.minPlayers),
			question_length: parseInt(this.state.questionLength),
			questions: this.state.copy_id ? null : this.state.questions.map(q => q.toData()),
			sponsor: parseFloat(this.state.sponsor).toString(),
			copy_id: this.state.copy_id,
		};
		try {
			const quiz = await this.props.quizStore.createQuiz(data);
			this.props.navigation.replace('FinishCreate', { quiz });
		} catch (e) {
			if (e.response?.status === 400) {
				Toast.show('Проверьте правильность введенных данных');
			} else if (e.response?.status === 402) {
				Toast.show('На балансе недостаточно средств для спонсирования');
			} else {
				Toast.show('Произошла ошибка, пожалуйста, попробуйте еще раз');
			}
		} finally {
			this.setState({ loading: false });
		}
	};

	render() {
		return (
			<Layout
				headerConfig={{
					center: <HeaderTitle title="Создание викторины" />,
				}}
				footer={
					<Button
						buttonTitle="Создать"
						onPress={this.handleSubmit}
						block
					/>
				}
				ref={ref => this.layoutRef = ref}
			>
				<View
					style={{
						backgroundColor: this.props.settingsStore.theme.colors.card,
						height: 'auto',
						borderTopRightRadius: 16,
						borderTopLeftRadius: 16,
						borderBottomLeftRadius: 16,
						marginBottom: 15,
					}}
				>
					<Text
						style={{
							fontSize: 16,
							fontWeight: '500',
							lineHeight: 20,
							marginTop: 15,
							marginBottom: 15,
							marginLeft: 15,
							color: '#898F97',
						}}
					>
						Основные свойства
					</Text>
					<View style={{ marginLeft: 15, marginRight: 15, marginBottom: 10 }}>
						<RadioList
							options={this.props.quizStore.foundations.map(fnd => ({ key: fnd.pk, text: fnd.title }))}
							title="Фонд"
							onChange={foundation => this.setState({ foundation })}
							value={this.state.foundation}
							clearable
						/>
						<RadioList
							options={this.props.quizStore.categories.map(cat => ({ key: cat.pk, text: cat.title }))}
							title="Категория"
							onChange={category => this.setState({ category })}
							value={this.state.category}
							disabled={!!this.state.copy_id}
						/>
						<Input
							label="Стоимость участия (руб.)"
							value={this.state.entryPrice}
							onChangeText={entryPrice => this.setState({ entryPrice })}
							placeholder="100"
							keyboardType='number-pad'
							style={{ marginBottom: 10 }}
						/>
						<Input
							label="Название викторины"
							value={this.state.title}
							onChangeText={title => this.setState({ title })}
							placeholder="Название викторины тут"
							style={{ marginBottom: 10 }}
							disabled={!!this.state.copy_id}
						/>
						<Input
							label="Описание викторины"
							value={this.state.description}
							onChangeText={description => this.setState({ description })}
							placeholder="Описание тут"
							style={{ marginBottom: 10 }}
							disabled={!!this.state.copy_id}
						/>
						<Input
							label="Запуск через (минут)"
							value={this.state.minutes}
							onChangeText={minutes => this.setState({ minutes })}
							placeholder='30'
							style={{ marginBottom: 10 }}
						/>
						<Input
							label="Минимальное количество участников"
							value={this.state.minPlayers}
							onChangeText={minPlayers => this.setState({ minPlayers })}
							placeholder="10"
							style={{ marginBottom: 10 }}
						/>
						<Input
							label="Время ответа на один вопрос (сек.)"
							value={this.state.questionLength}
							onChangeText={questionLength => this.setState({ questionLength })}
							placeholder="30"
							style={{ marginBottom: 10 }}
						/>
						<Input
							label="Сумма спонсирования (руб.)"
							value={this.state.sponsor}
							onChangeText={sponsor => this.setState({ sponsor })}
							placeholder="30"
							style={{ marginBottom: 10 }}
						/>
					</View>
				</View>
				{this.state.copy_id ? null : (
					<React.Fragment>
						{this.state.questions.map((q, questionIdx) => (
							<View
								style={{
									backgroundColor: this.props.settingsStore.theme.colors.card,
									height: 'auto',
									borderTopRightRadius: 16,
									borderTopLeftRadius: 16,
									borderBottomLeftRadius: 16,
									marginBottom: 15,
								}}
								key={questionIdx}
								ref={ref => this.lastQuestionRef = ref}
							>
								<Text
									style={{
										fontSize: 16,
										fontWeight: '500',
										lineHeight: 20,
										marginTop: 15,
										marginBottom: 15,
										marginLeft: 15,
										color: '#898F97',
									}}
								>
									Вопрос
								</Text>
								<View style={{ marginLeft: 15, marginRight: 15, marginBottom: 10 }}>
									<Input
										label="Текст вопроса"
										value={q.text}
										onChangeText={text => { q.text = text; this.forceUpdate() }}
										style={{ marginBottom: 10 }}
										image={q.image}
										onImageChange={image => { q.image = image; this.forceUpdate() }}
										withImage
									/>
									<Input
										label="Верный ответ"
										value={q.correctOption.text}
										onChangeText={text => { q.correctOption.text = text; this.forceUpdate() }}
										style={{ marginBottom: 10 }}
									/>
									{q.options.map((o, optionIdx) => (
										<Input
											label="Вариант ответа"
											value={o.text}
											onChangeText={text => { o.text = text; this.forceUpdate() }}
											key={optionIdx}
											style={{ marginBottom: 10 }}
										/>
									))}
									<Input
										label="Комментарий к правильному ответу"
										value={q.correctOption.comment}
										onChangeText={text => { q.correctOption.comment = text; this.forceUpdate() }}
										placeholder="Ссылка или краткое пояснение"
										style={{ marginBottom: 10 }}
									/>
									<TouchableOpacity onPress={() => { q.options.push(new Option()); this.forceUpdate() }}>
										<Text
											style={{
												fontSize: 13,
												fontWeight: '500',
												lineHeight: 16,
												marginBottom: 10,
												textAlign: 'center',
												color: '#FF3358',
											}}
										>
											Добавить вариант ответа
										</Text>
									</TouchableOpacity>
									{q.options.length > 1 ? (
										<TouchableOpacity onPress={() => { q.options.pop(); this.forceUpdate() }}>
											<Text
												style={{
													fontSize: 13,
													fontWeight: '500',
													lineHeight: 16,
													marginBottom: 10,
													textAlign: 'center',
													color: '#FF3358',
												}}
											>
												Удалить вариант ответа
											</Text>
										</TouchableOpacity>
									) : null}
								</View>
							</View>
						))}
						<TouchableOpacity
							style={{ marginLeft: 15, marginRight: 15, marginBottom: 10 }}
							onPress={async () => {
								this.state.questions.push(new Question());
								this.forceUpdate();
								_.delay(() => {
									this.layoutRef.scrollViewRef.scrollToEnd();
								}, 100);
							}}
						>
							<Text
								style={{
									fontSize: 16,
									fontWeight: 'bold',
									lineHeight: 20,
									marginBottom: 10,
									textAlign: 'center',
									color: '#FF3358',
								}}
							>
								Добавить вопрос
							</Text>
						</TouchableOpacity>
						{this.state.questions.length > 1 ? (
							<TouchableOpacity
								style={{ marginLeft: 15, marginRight: 15, marginBottom: 10 }}
								onPress={() => { this.state.questions.pop(); this.forceUpdate() }}
							>
								<Text
									style={{
										fontSize: 16,
										fontWeight: 'bold',
										lineHeight: 20,
										marginBottom: 10,
										textAlign: 'center',
										color: '#FF3358',
									}}
								>
									Удалить вопрос
								</Text>
							</TouchableOpacity>
						) : null}
					</React.Fragment>
				)}
			</Layout>
		);
	}
}
