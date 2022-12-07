import React from "react";
import { Text, TextStyle } from "react-native";
import moment, { MomentInput } from "moment";

interface IProps {
    style?: TextStyle;
    toTime: MomentInput;
    onExpire?: () => any;
}

interface IState {
    str: string;
}

export default class CountDown extends React.Component<IProps, IState> {
    private updateInterval: any;

    state: IState = {
        str: '',
    };

    componentDidMount() {
        this.updateInterval = setInterval(this.updateTime, 1000);
        this.updateTime();
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    updateTime = () => {
        this.forceUpdate();
    };

    render() {
        let str = '...';
        if (this.props.toTime) {
            const dur = Math.max(moment.duration(moment(this.props.toTime).diff(moment())).asSeconds(), 0);
            str = `${Math.floor(dur / 60)}:${Math.round(dur % 60).toString().padStart(2, '0')}`;
            if (!Number.isNaN(dur) && dur <= 0 && this.props.onExpire) {
                this.props.onExpire();
            }
        }

        return (
            <Text style={this.props.style}>
                {str}
            </Text>
        )
    }
}
