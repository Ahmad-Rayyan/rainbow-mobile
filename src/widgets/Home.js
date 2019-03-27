import React, { Component } from 'react';
import { Container, Header, Content, Footer, Drawer, FooterTab, Button, Icon, Text, Badge, Item, Input } from 'native-base';
import { DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Contacts from './Contacts';
import Conversations from './Conversations';
import { getCallState } from '../features/webrtc/actions';
import { getConnectedUser } from '../features/authentication/actions';
import { WebrtcModule, Authentication } from '../main/RainbowNativeModules';
import MenuSideBar from './MenuSideBar';
import Strings from '../resources/localization/Strings'

class Home extends Component {

    constructor(props) {
        super(props);
        this.onCallAdded = this.onCallAdded.bind(this);
        this.onCallModifed = this.onCallModifed.bind(this);
        this.renderScreen = this.renderScreen.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.getConnectedUserData = this.getConnectedUserData.bind(this);
        this.setTotal = this.setTotal.bind(this);
        this.state = {
            screen: 'conversations',
            totalUnread: 0
        };
        this.onCallAddedSubscribtion = null;
        this.onCallDeclinedSubscribtion = null;
        this.onCallModifiedSubscribtion = null;
    }
    componentDidMount() {
        WebrtcModule.listenToTelephonyEvents();
        this.onCallAddedSubscribtion = DeviceEventEmitter.addListener('on_call_added', this.onCallAdded);
        this.onCallDeclinedSubscribtion = DeviceEventEmitter.addListener('call_Declined', this.onCallDeclined);
        this.onCallModifiedSubscribtion = DeviceEventEmitter.addListener('call_Modified', this.onCallModifed);
        DeviceEventEmitter.addListener('connected_user_data', this.getConnectedUserData);
    }
    componentWillUnmount() {
        this.onCallAddedSubscribtion.remove();
        this.onCallModifiedSubscribtion.remove();
        this.onCallDeclinedSubscribtion.remove();
    }
    onCallAdded(event) {
        this.props.getCallState(event);
        Actions.webrtc({
            contactProfilePic: event.contactPic,
        });
    }
    onCallDeclined(call) {
        console.log('Home: onCallDeclined event', call);
        Actions.pop();
    }
    onCallModifed(call) {
        console.log('Home: onCallModifed event', call.callState);
        this.props.getCallState(call);
    }
    getConnectedUserData(connectedUser) {
        this.props.getConnectedUser(connectedUser);
    }
    openDrawer() {
        Authentication.getConnectedUser();
        this._drawer._root.open();
    }
    setTotal(total) {
        this.setState({
            totalUnread: total
        });
    }
    closeDrawer() {
        this._drawer._root.close();
    }
    switchScreen(screen) {
        console.log('switchScreen called', screen);
        this.setState({ screen });
    }

    renderScreen() {
        if (this.state.screen === 'conversations') {
            console.log('renderScreen called conversations');
            return (<Conversations setTotal={this.setTotal} />);
        } else if (this.state.screen === 'contacts') {
            return (<Contacts />);
        } else {
            return (<Text>No Bubbles Found </Text>);
        }
    }

    isActive(screen) {
        return (this.state.screen === screen);
    }

    renderTotalUnread(totalUnread) {
        if (this.state.totalUnread > 0) return <Badge><Text>{totalUnread}</Text></Badge>;
    }

    render() {
        let { totalUnread } = this.state;
        return (
            <Drawer
                ref={(ref) => { this._drawer = ref; }}
                content={<MenuSideBar navigator={this._navigator} />}
                onClose={() => this.closeDrawer()}
            >
                <Container>
                    <Header searchBar rounded style={{ backgroundColor: '#0086CF' }}>
                        <Item>
                            <Icon name="menu" size={25} onPress={() => this.openDrawer()} />
                            <Input placeholder={Strings.search} disabled />
                            <Icon name="ios-search" size={25} />
                        </Item>
                        <Button transparent>
                            <Text>{Strings.search}</Text>
                        </Button>
                    </Header>
                    <React.Fragment>
                        <Content>
                            {this.renderScreen()}
                        </Content>
                        <Footer>
                            <FooterTab style={{ backgroundColor: '#ffffff' }}>
                                <Button style={{ backgroundColor: '#ffffff' }} active={this.isActive('conversations')} badge={totalUnread > 0} vertical onPress={() => this.switchScreen('conversations')} >
                                    {this.renderTotalUnread(totalUnread)}
                                    <Icon style={{ color: '#0086CF' }} name="ios-chatboxes" />
                                    <Text style={{ color: '#0086CF' }}>{Strings.conversations}</Text>
                                </Button>
                                <Button style={{ backgroundColor: '#ffffff' }} active={this.isActive('contacts')} vertical onPress={() => this.switchScreen('contacts')} >
                                    <Icon style={{ color: '#0086CF' }} color='#0086CF' name="person" />
                                    <Text style={{ color: '#0086CF' }} style={{ color: '#0086CF' }} >{Strings.contacts}</Text>
                                </Button>
                                <Button style={{ backgroundColor: '#ffffff' }} active={this.isActive('bubbles')} vertical onPress={() => this.switchScreen('bubbles')} >
                                    <Icon style={{ color: '#0086CF' }} name="ios-chatbubbles" color='#0086CF' />
                                    <Text style={{ color: '#0086CF' }} >{Strings.bubbles}</Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                    </React.Fragment>
                </Container>
            </Drawer>
        );
    }
}

const mapStateToProps = state => {
    return {
        callState: state.webrtcReducer.callState,
        user: state.authenticationReducer.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCallState: (callState) => dispatch(getCallState(callState)),
        getConnectedUser: (connectedUser) => dispatch(getConnectedUser(connectedUser))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
