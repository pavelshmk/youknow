import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from "mobx-react";
import { ISettingsStoreProps } from "../types";

interface IProps extends ISettingsStoreProps {
    text: string;
    onPress: () => any;
}

@inject('settingsStore')
@observer
export default class HashTag extends React.Component<IProps> {
    static defaultProps = {} as IProps;

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View
                    style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center', justifyContent: 'center' }}
                >
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 40,
                                backgroundColor: this.props.settingsStore.theme.colors.card,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 24,
                                    color: '#898F97',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    top:'8%'
                                }}
                            >
                                #
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 5 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: '#FFFFFF',
                                textAlign: 'left',
                                fontWeight: '500',
                            }}
                        >
                            {this.props.text}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}