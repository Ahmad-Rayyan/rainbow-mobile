import React, { Component } from 'react';
import { Image, PermissionsAndroid, Alert, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Form, Item, Label, Button, Text, Input } from 'native-base';
import { Spinner } from './common';
import { emailChanged, passwordChanged, loginUser } from '../features/authentication/actions';
import logo from '../resources/images/logo.png';
import Strings from '../resources/localization/Strings';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
       this.state = { focusPasswordInput: false };
    }
    componentWillMount() {
        this.requestPermissions();
    }

    async requestPermissions() {
        const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        try {
            PermissionsAndroid.requestMultiple(permissions).then((result) => {
                let granted = 0;
                for (const permission in result) {
                    if (result[permission] === 'denied') {
                        break;
                    } else {
                        granted++;
                    }
                }
                if (granted === permissions.length) {
                    console.log('PERMISSIONS RESULT', result);
                } else {
                    console.log('PERMISSIONS DENIED', result);
                }
            }).catch((error) => {
                console.log('PERMISSIONS ERROR', error);
            });

        } catch (err) {
            console.warn(err);
        }
    }
    // action creator that tell the reducer to update the email
    onEmailChange(text) {
        this.props.emailChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }

    onButtonPress() {
        const { email, password } = this.props;
        if ((email === null || email === '') || (password === null || password === '')) {
            this.showAlertMessage(Strings.emptyCredentialsMsTitle, Strings.emptyCredentialsMsgBody);
        } else {
            this.props.loginUser(email, password);
        }
    }
    handleTitleInputSubmit() {
        this.setState({ focusPasswordInput: true });
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
    focus() {
        this.refs.TextInput.focus();
    }
    renderButton() {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }
        return (
            <Button onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle} block >
                <Text>{Strings.login}</Text>
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
                                    returnKeyType={'next'}
                                    value={this.props.email}
                                    onChangeText={this.onEmailChange.bind(this)}
                                    // autoFocus
                                    // blurOnSubmit={false}
                                    // onSubmitEditing={(event) => { this.refs.SecondInput.focus(); }}
                                    // onSubmitEditing={this.handleTitleInputSubmit}
                                />
                            </Item>
                            <Item floatingLabel last >
                                <Label>{Strings.password}</Label>
                                <Input
                                    ref={'SecondInput'}
                                    returnKeyType='done'
                                    value={this.props.password}
                                    onChangeText={this.onPasswordChange.bind(this)}
                                    blurOnSubmit
                                    focus={this.F}
                                    secureTextEntry
                                />
                            </Item>
                        </Form>
                        <Text style={styles.forgotPwdTextStyle} onPress={() => console.log('Forgot psw')}>{Strings.forgotPwd}</Text>
                        {this.renderButton()}
                        <Text style={styles.newAccountTextStyle} onPress={() => Actions.signIn()}>{Strings.createAccountMsgNew}</Text>
                    </Content>
                </Container>
            );
    }
}

const mapStateToProps = state => {
    return {
        email: state.authenticationReducer.email,
        password: state.authenticationReducer.password,
        error: state.authenticationReducer.error,
        loading: state.authenticationReducer.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        emailChanged: (text) => dispatch(emailChanged(text)),
        passwordChanged: (text) => dispatch(passwordChanged(text)),
        loginUser: (email, password) => dispatch(loginUser(email, password))
    };
};

const styles = {
    errorTextStyle: {
        marginTop: 5,
        color: 'red',
        fontSize: 20,
        alignSelf: 'center'
    },
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
    forgotPwdTextStyle: {
        marginTop: 30,
        color: '#009DD2',
        paddingStart: 12,
        fontWeight: 'bold'
    },
    newAccountTextStyle: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 150,
        color: '#009DD2',
        paddingStart: 12,
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
