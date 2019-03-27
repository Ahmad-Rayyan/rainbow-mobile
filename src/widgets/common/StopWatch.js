/*This is an Example of Timer/Stopwatch in React Native */
import React, { Component } from 'react';
//import React in our project

import { View } from 'react-native';
//import all the required components

import { Stopwatch } from 'react-native-stopwatch-timer';
//importing library to use Stopwatch and Timer

export default class StopWatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTimerStart: false,
            isStopwatchStart: false,
            timerDuration: 90000,
            resetStopwatch: false,
        };
        this.startStopStopWatch = this.startStopStopWatch.bind(this);
        this.resetStopwatch = this.resetStopwatch.bind(this);
    }

    getFormattedTime(time) {
        this.currentTime = time;
    }

    startStopStopWatch() {
        this.setState({
            isStopwatchStart: !this.state.isStopwatchStart,
            resetStopwatch: false,
        });
    }

    resetStopwatch() {
        this.setState({ isStopwatchStart: false, resetStopwatch: true });
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        flex: 1,
                        marginTop: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Stopwatch
                        laps
                        start={this.state.isStopwatchStart}
                        //To start
                        reset={this.state.resetStopwatch}
                        //To reset
                        options={options}
                        //options for the styling
                        getTime={this.getFormattedTime}
                        refs='StopWatch'
                    />
                </View>

            </View>
        );
    }
}

const options = {
    container: {
        backgroundColor: '#FF0000',
        padding: 5,
        borderRadius: 5,
        width: 150,
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        color: '#FFF',
        marginLeft: 7,
    },
};
