import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface IProps {
    title: string;
    onAllPress?: () => any;
}

export default class SubHeader extends React.Component<IProps> {
    render() {
        return (
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <View style={{ flex: 5 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#898F97',
                        }}
                    >
                        {this.props.title}
                    </Text>
                </View>
                {this.props.onAllPress ? (
                    <TouchableOpacity
                        style={{ flex: 1.5, flexDirection: 'row' }}
                        onPress={this.props.onAllPress}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: '#FF3358',
                                marginLeft: 15,
                                textAlign: 'right',
                            }}
                        >
                            Все
                        </Text>
                        <Image
                            source={require('../assets/icons/right.png')}
                            style={{ width: 32, height: 32, bottom: 5 }}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>
        )
    }
}