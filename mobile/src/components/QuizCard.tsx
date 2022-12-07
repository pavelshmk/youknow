import React from 'react';
import { Image, Share, Text, TouchableOpacity, View } from "react-native";
import { IQuiz } from "../api";
import { IAuthStoreProps, ISettingsStoreProps } from "../types";
import { inject, observer } from "mobx-react";
import NameBlock from "./NameBlock";

interface IProps extends ISettingsStoreProps, IAuthStoreProps {
    data: IQuiz;
}

@inject('settingsStore', 'authStore')
@observer
export default class QuizCard extends React.Component<IProps, any> {
    static defaultProps = {} as IProps;

    render() {
        const data = this.props.data;
        return (
            <View
                style={{
                    backgroundColor: this.props.settingsStore.theme.colors.card,
                    height: 'auto',
                    borderTopRightRadius: 16,
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    marginBottom: 15,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 15,
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexShrink: 1, height: 28, marginRight: 10 }}>
                        <Image
                            source={require('../assets/icons/price.png')}
                            style={{ width: 20, height: 20, alignSelf: 'center', top: 3 }}
                        />
                    </View>
                    <View style={{ flexGrow: 1, height: 28 }}>
                        <Text
                            style={{
                                fontStyle: 'normal',
                                fontSize: 23,
                                lineHeight: 28,
                                fontWeight: 'bold',
                                color: '#FF3358',
                                textAlign: 'left',
                            }}
                        >
                            {data.entry_price} руб.
                        </Text>
                    </View>
					<View style={{ flexGrow: 1 }}>
						<NameBlock
							name={data.creator.name}
							image={{ uri: data.creator.avatar }}
							style={{
								// fontWeight: '600',
								fontSize: 13,
								color: this.props.settingsStore.theme.colors.text,
								fontWeight: '800',
								textAlign: 'left',
								top: 16,
							}}
							reversed
						/>
					</View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, height: 'auto' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: this.props.settingsStore.theme.colors.text,
                                textAlign: 'left',
                                marginBottom: 10,
                            }}
                        >
                            {data.title}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, height: 28, marginBottom: 20 }}>
                        <Text
                            style={{
                                fontStyle: 'normal',
                                fontSize: 13,
                                lineHeight: 16,
                                fontWeight: '500',
                                color: '#898F97',
                                textAlign: 'left',
                            }}
                        >
                            Призовой фонд:
                        </Text>
                        <Text
                            style={{
                                fontStyle: 'normal',
                                fontSize: 13,
                                lineHeight: 16,
                                fontWeight: '700',
                                color: '#FEAC5E',
                                textAlign: 'left',
                            }}
                        >
                            {data.bank} руб.
                        </Text>
                    </View>
                    <View style={{ flex: 1, height: 28 }}>
                        <Text
                            style={{
                                fontStyle: 'normal',
                                fontSize: 13,
                                lineHeight: 16,
                                fontWeight: '500',
                                color: '#898F97',
                                textAlign: 'left',
                            }}
                        >
                            Участников:
                        </Text>
                        <Text
                            style={{
                                fontStyle: 'normal',
                                fontSize: 13,
                                lineHeight: 16,
                                fontWeight: '700',
                                color: this.props.settingsStore.theme.colors.text,
                                textAlign: 'left',
                            }}
                        >
                            {data.players} из {data.start_players}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            height: 30,
                            width: 30,
                            backgroundColor: '#FF3358',
                            borderRadius: 10,
                            shadowColor: 'rgba(255, 51, 88, 0.6)',
                            shadowOpacity: 0.8,
                            shadowRadius: 15,
                            shadowOffset: {
                                height: -1,
                                width: 0,
                            },
                            padding: 5,
                        }}
                            onPress={() => Share.share({ message: this.props.authStore.generateReferralUrl(data.pk) })}
                    >
                        <Image
                            source={require('../assets/icons/share.png')}
                            style={{ width: 20, height: 20 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
