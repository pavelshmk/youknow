import { inject, observer } from "mobx-react";
import React, { ReactNode } from "react";
import { INavigationStoreProps, ISettingsStoreProps } from "../types";
import Logo from "./Logo";
import { RefreshControlProps, SafeAreaView, ScrollView, View, ViewStyle, ActivityIndicator } from "react-native";
import BackButton from "./BackButton";
import Header from "./Header";

interface IProps extends ISettingsStoreProps, INavigationStoreProps {
    headerConfig: {
        enabled?: boolean;
        left?: 'back' | 'exit';
        center?: ReactNode;
        right?: ReactNode;
    };
    title?: ReactNode;
    titleAddon?: ReactNode;
    children?: ReactNode | ReactNode[];
    refreshControl?: React.ReactElement<RefreshControlProps>;
    scrollViewStyle?: ViewStyle;
    onScrollEnd?: () => any;
    titleStyle?: ViewStyle;
    footer?: ReactNode;
    loading?: boolean;
}

@inject('settingsStore', 'navigationStore')
@observer
export default class Layout extends React.Component<IProps> {
    static defaultProps = {} as IProps;
    scrollViewRef: ScrollView;

    defaultHeaderConfig = {
        enabled: true,
        left: <BackButton onPress={() => this.props.navigationStore.ref.goBack()} />,
        center: <Logo/>,
        right: <View />,
    };

    render() {
        const headerConfig = {
            ...this.defaultHeaderConfig,
            ...this.props.headerConfig,
        };

        if (this.props.loading) {
            return (
                <View
                    style={{
                        height: '100%',
                        width: ' 100%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        backgroundColor: this.props.settingsStore.theme.colors.bg1,
                    }}
                >
                    <ActivityIndicator size="small" color="white" />
                </View>
            )
        }

        return (
			<SafeAreaView style={{
				width: '100%',
				height: '100%',
				backgroundColor: this.props.settingsStore.theme.colors.bg1,
				flexDirection: 'column',
			}}>
                {headerConfig.enabled ? (
                    <Header
                        left={headerConfig.left}
                        center={headerConfig.center}
                        right={headerConfig.right}
                    />
                ) : null}
                {this.props.title ? (
                    <View style={{
                        marginBottom: 10,
                        paddingHorizontal: 15,
                        zIndex: 1,
                        ...this.props.titleStyle,
                    }}>
                        {this.props.title}
                    </View>
                ) : null}
                <ScrollView
                    style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        zIndex: 0,
                        ...this.props.scrollViewStyle,
                    }}
                    refreshControl={this.props.refreshControl}
                    onScroll={({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }) => {
                        if (this.props.onScrollEnd && layoutMeasurement.height + contentOffset.y >= contentSize.height - 100)
                            this.props.onScrollEnd();
                    }}
                    ref={ref => this.scrollViewRef = ref}
                >
                    {this.props.children}
                </ScrollView>
                {this.props.footer ? (
                    <View style={{
                        marginVertical: 10,
                        paddingHorizontal: 15,
                    }}>
                        {this.props.footer}
                    </View>
                ) : null}
            </SafeAreaView>
        );
    }
}