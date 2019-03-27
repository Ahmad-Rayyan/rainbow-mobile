import React, { Component } from 'react';
import { Image, Alert, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Form, Item, Label, Button, Text, Input } from 'native-base';
import { Spinner } from './common';
import logo from '../resources/images/logo.png';
import Strings from '../resources/localization/Strings';

class SignInForm extends Component {

    // action creator that tell the reducer to update the email
    onEmailChange(text) {
        this.props.emailChanged(text);
    }

    onButtonPress() {
        // this.props.loginUser(email, password);
    }
    showAlertMessage(title, BodyMsg) {
        Alert.alert(
            title,
            BodyMsg,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }
    renderButton() {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }
        return (
            <Button onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle} block >
                <Text>{Strings.continue}</Text>
            </Button>
        );
    }

    render() {
        if (this.props.error) {
            this.showAlertMessage(Strings.emptyCredentialsMsTitle, Strings.loginFaild);
          }
            return (
                <Container style={styles.containerStyle}>
                    <Content style={styles.contentStyle}>
                        <Image style={styles.imageStyle} source={logo} />
                        <Form>
                            <Item floatingLabel>
                                <Label>{Strings.username}</Label>
                                <Input
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    value={this.props.email}
                                    onChangeText={this.onEmailChange.bind(this)}
                                />
                            </Item>
                        </Form>
                        {this.renderButton()}
                        <View style={styles.existAccount}>
                            <Text>{Strings.alreadyHaveAccount}</Text>
                            <Text style={styles.newAccountTextStyle} onPress={() => Actions.login()}>{Strings.login}</Text>
                        </View>
                    </Content>
                </Container>
            );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

const styles = {
    buttonStyle: {
        marginTop: 100,
        width: 355,
        alignSelf: 'center',
        backgroundColor: '#0086CF',
    },
    contentStyle: {
        marginTop: 40,
        paddingStart: 20,
        paddingEnd: 20
    },
    containerStyle: {
        kgroundColor: 'azure',
    },
    imageStyle: {
        marginTop: 15,
        marginBottom: 25,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    newAccountTextStyle: {
        fontWeight: 'bold',
        color: '#009DD2',
    },
    existAccount: {
        marginTop: 100,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
