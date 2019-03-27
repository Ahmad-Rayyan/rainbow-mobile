import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge, Item, Input } from 'native-base';
import { DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Contacts from './Contacts';
import Conversations from './Conversations';
import { getCallState } from '../features/webrtc/actions';
import { WebrtcModule } from '../main/RainbowNativeModules';
import { TabsStyle } from '../resources/styles/Style';


class Home extends Component {

    constructor(props) {
        super(props);
        this.onCallAdded = this.onCallAdded.bind(this);
        this.onCallModifed = this.onCallModifed.bind(this);
        this.renderScreen = this.renderScreen.bind(this);
        this.state = {
            screen: 'conversations'
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
    }
    componentWillUnmount() {
        console.log('Home: componentWillUnmount called');
        this.onCallAddedSubscribtion.remove();
        this.onCallModifiedSubscribtion.remove();
        this.onCallDeclinedSubscribtion.remove();
    }
    onCallAdded(event) {
        this.props.getCallState(event.callState);
        console.log('Home: onCallAdded');
        Actions.webrtc({
            contactProfilePic: event.contactPic,
        });
    }
    onCallDeclined(call) {
        console.log('Home: onCallDeclined event', call);
        Actions.main();
    }
    onCallModifed(call) {
        console.log('Home: onCallModifed event', call.callState);
        this.props.getCallState(call.callState);
    }

    switchScreen(screen) {
        console.log('switchScreen called', screen);

        this.setState({ screen });
    }

    renderScreen() {
        if (this.state.screen === 'conversations') {
            console.log('renderScreen called conversations');
            return (
                <React.Fragment>
                    <Content>
                        <Conversations />
                    </Content>
                    <Footer>
                        <FooterTab style={TabsStyle.backgroundColor}>
                            <Button style={TabsStyle.backgroundColor} active badge vertical onPress={() => this.switchScreen('conversations')} >
                                <Badge><Text>2</Text></Badge>
                                <Icon name="ios-chatboxes" color={TabsStyle.iconColor.color} />
                                <Text color={TabsStyle.iconColor.color} >conversations</Text>
                            </Button>
                            <Button vertical onPress={() => this.switchScreen('contacts')} >
                                <Icon color={TabsStyle.iconColor.color} name="person" />
                                <Text color={TabsStyle.iconColor.color} >contacts</Text>
                            </Button>
                            <Button badge vertical onPress={() => this.switchScreen(0)} >
                                <Badge ><Text>51</Text></Badge>
                                <Icon color={TabsStyle.iconColor.color} name="ios-chatbubbles" />
                                <Text color={TabsStyle.iconColor.color} >bubbles</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </React.Fragment>
            );
        } else if (this.state.screen === 'contacts') {
            return (
                <React.Fragment>
                    <Content>
                        <Contacts />
                    </Content>
                    <Footer>
                        <FooterTab style={TabsStyle.backgroundColor}>
                            <Button badge vertical onPress={() => this.switchScreen('conversations')} >
                                <Badge><Text>2</Text></Badge>
                                <Icon color={TabsStyle.iconColor.color} name="ios-chatboxes" />
                                <Text color={TabsStyle.iconColor.color} >conversations</Text>
                            </Button>
                            <Button style={TabsStyle.backgroundColor} active vertical onPress={() => this.switchScreen('contacts')} >
                                <Icon color={TabsStyle.iconColor.color} name="person" />
                                <Text color={TabsStyle.iconColor.color} >contacts</Text>
                            </Button>
                            <Button badge vertical onPress={() => this.switchScreen(0)} >
                                <Badge ><Text>51</Text></Badge>
                                <Icon color={TabsStyle.iconColor.color} name="ios-chatbubbles" />
                                <Text color={TabsStyle.iconColor.color} >bubbles</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Content style={{ top: 150, alignSelf: 'center' }}>
                    <Text>No Bubbles Found </Text>
                    </Content>
                    <Footer>
                        <FooterTab style={TabsStyle.backgroundColor}>
                            <Button badge vertical onPress={() => this.switchScreen('conversations')} >
                                <Badge><Text>2</Text></Badge>
                                <Icon color={TabsStyle.iconColor.color} name="ios-chatboxes" />
                                <Text color={TabsStyle.iconColor.color}>conversations</Text>
                            </Button>
                            <Button vertical onPress={() => this.switchScreen('contacts')} >
                                <Icon color={TabsStyle.iconColor.color} name="person" />
                                <Text color={TabsStyle.iconColor.color}>contacts</Text>
                            </Button>
                            <Button style={TabsStyle.backgroundColor} active badge vertical onPress={() => this.switchScreen('bubbles')} >
                                <Badge ><Text>51</Text></Badge>
                                <Icon color={TabsStyle.iconColor.color} name="ios-chatbubbles" />
                                <Text color={TabsStyle.iconColor.color}>bubbles</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </React.Fragment>
            );
        }
    }
    render() {
        return (
            <Container>
                <Header searchBar rounded style={TabsStyle.backgroundColor}>
                    <Item>
                        <Icon name="ios-search" size={25} />
                        <Input placeholder="Search" disabled />
                        <Icon name="ios-people" size={25} />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                {this.renderScreen()}
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        callState: state.webrtcReducer.callState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCallState: (callState) => dispatch(getCallState(callState))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
