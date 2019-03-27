import React, {
    Component
} from 'react';
import { DeviceEventEmitter } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Home from '../widgets/Home';
import LoginForm from '../widgets/LoginForm';
import SignInForm from '../widgets/SignInForm';
import Webrtc from '../widgets/Webrtc';
import Chat from '../widgets/Chat';
import Launch from '../widgets/Launch';
import { KeepUserloggedIn } from '../features/authentication/actions';
import { conversationsUpdated } from '../features/conversations/actions';
import { contactsUpdated } from '../features/contacts/actions';

class RouterComponent extends Component {

    constructor(props) {
        super(props);
        this.onConverationsUpdated = this.onConverationsUpdated.bind(this);
        this.onContactsUpdated = this.onContactsUpdated.bind(this);
        this.checkIfUserConnected = this.checkIfUserConnected.bind(this);
        this.keepConnectedUserLoggedIn = this.keepConnectedUserLoggedIn.bind(this);
    }
    state = {
        userIsConnected: false,
        user: null
    }

    componentWillMount() {
        this.checkIfUserConnected();
    }
    componentDidMount() {
        DeviceEventEmitter.addListener('conversations_updated', this.onConverationsUpdated);
        DeviceEventEmitter.addListener('contacts_updated', this.onContactsUpdated);
    }
    onConverationsUpdated(conversations) {
        console.log('onConverationsUpdated');
        this.props.conversationsUpdated(conversations);
    }

    onContactsUpdated(contacts) {
        console.log('onContactsUpdated', contacts);
        this.props.contactsUpdated(contacts);
    }
    async checkIfUserConnected() {
        console.log('RouterComponent: checkIfUserConnected');
        try {
            // Retreive the credentials
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log('Credentials successfully loaded for user ');
                this.setState({
                    userIsConnected: true,
                    user: credentials
                });
                this.keepConnectedUserLoggedIn(credentials);
            } else {
                console.log('No credentials stored');
                this.setState({ user: null });
            }
        } catch (error) {
            console.log('Keychain couldn\'t be accessed!', error);
        }
    }
    keepConnectedUserLoggedIn(credentials) {
        if (credentials != null) {
            console.log('keepConnectedUserLoggedIn');
            this.props.KeepUserloggedIn(credentials.username, credentials.password);
        }
    }
    render() {
        return (
            <Router headerMode="none">
                <Scene key="root" headerMode="none">
                <Scene key="launch" component={Launch} initial={!this.state.userIsConnected} />
                <Scene key="login" component={LoginForm} initial={!this.state.user} title="login" />
                <Scene key="signIn" component={SignInForm} title="signIn" />
                    <Scene key="main" type={ActionConst.RESET}>
                        <Scene key="home" component={Home} />
                        <Scene key="webrtc" component={Webrtc} />
                        <Scene key="chat" component={Chat} />
                    </Scene>
                </Scene>
            </Router>);
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        contactsUpdated: (contacts) => dispatch(contactsUpdated(contacts)),
        conversationsUpdated: (conversations) => dispatch(conversationsUpdated(conversations)),
        KeepUserloggedIn: (email, password) => dispatch(KeepUserloggedIn(email, password))
    };
};

export default connect(null, mapDispatchToProps)(RouterComponent);

