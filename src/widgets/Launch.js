import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { Spinner } from './common';
import logo from '../resources/images/logo.png';
import Strings from '../resources/localization/Strings'

class Launch extends Component {
    render() {
        return (
            <Container style={styles.containerStyle}>
                <Content style={styles.contentStyle}>
                    <Image style={styles.imageStyle} source={logo} />
                    <Text style={styles.errorTextStyle}>{Strings.connectionProgress}</Text>
                    <Text style={styles.errorTextStyle}>{this.props.error}</Text>
                    <Spinner size="large" />
                </Content>
            </Container>
        );
    }
}
const styles = {
    errorTextStyle: {
        marginTop: 15,
        marginBottom: 15,
        color: '#C6C6C6',
        fontSize: 20,
        alignSelf: 'center'
    },
    contentStyle: {
        marginTop: 40
    },
    containerStyle: {
        // kgroundColor: 'azure',
    },
    imageStyle: {
        marginTop: 60,
        width: 130,
        height: 130,
        alignSelf: 'center'
    },

};
export default Launch;
