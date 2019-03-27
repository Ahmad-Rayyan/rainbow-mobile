import React from 'react';
import { TouchableOpacity, DeviceEventEmitter, View, ScrollView, RefreshControl} from 'react-native';
import { Header, Container, Text, Icon, Left, Right, Body, Content, Button } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import { Dialog } from 'react-native-simple-dialogs';
import { connect } from 'react-redux';
import { Spinner } from '../widgets/common';
import { messagesUpdated, clearChat } from '../features/conversations/actions';
import { WebrtcModule, ConversationsModule } from '../main/RainbowNativeModules';
import { REQUEST_MAKE_VIDEO_CALL, REQUEST_MAKE_AUDIO_CALL } from '../features/webrtc/types';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.onMessagesUpdated = this.onMessagesUpdated.bind(this);
        this.onLoadMoreMessages = this.onLoadMoreMessages.bind(this);
        this.onCallButtonPressed = this.onCallButtonPressed.bind(this);
        this.renderCallDialogContent = this.renderCallDialogContent.bind(this);
        this.attachFile = this.attachFile.bind(this);

        this.state = {
            initLoading: true,
            isLoadingMessages: false,
            messages: [],
            userToCallName: '',
            userToCallId: ''
        };

        this.messagesUpdateInterval = null;
    }

    componentWillMount() {
        console.log('Chat: componentWillMount', this.props.messages);
        DeviceEventEmitter.addListener('messages_updated', this.onMessagesUpdated);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.messages && this.props.messagesTime !== nextProps.messagesTime) {
            clearInterval(this.messagesUpdateInterval);
            this.messagesUpdateInterval = setTimeout(() => {
                this.setState({
                    messages: nextProps.messages,
                    initLoading: nextProps.loading,
                    isLoadingMessages: nextProps.loading
                });
            }, 250);
        }
    }
    componentWillUnmount() {
        console.log('Chat: componentWillUnmount');
        this.props.clearChat();
        ConversationsModule.unRegisterMessagesListener();
    }
    onMessagesUpdated(messages) {
        console.log('Chat: onMessaageUpdated event', messages.length);
        this.props.messagesUpdated(messages);
    }
    onSend(message) {
        console.log('Chat: on send message', message);
        ConversationsModule.sendMessage(message.text);
    }

    onLoadMoreMessages() {
        if(!this.state.isLoadingMessages){
            this.setState({
                isLoadingMessages: true
            }, () => {
                ConversationsModule.loadMoreMessages();
            });
        }
    }
    onCallButtonPressed(requestCode, contactJId) {
        this.openDialog(false);
        WebrtcModule.startCall(requestCode, contactJId);
    }
    makeCall(contactJId) {
        console.log('make video call inside chat', contactJId);
        WebrtcModule.startCall(contactJId);
    }
    openDialog(show) {
        this.setState({ showDialog: show });
    }
    openCallDialog(contactData) {
        this.setState({
            userToCallName: contactData.contactName,
            userToCallId: contactData.contactORConversationJId
        });
        this.openDialog(true);
    }
    renderCallDialogContent() {
        return (
            <Content >
                <TouchableOpacity activeOpacity={0.085} >
                    <Button transparent onPress={() => this.onCallButtonPressed(REQUEST_MAKE_AUDIO_CALL, this.state.userToCallId)}>
                        <Icon name="ios-call" style={{ fontSize: 40 }} />
                        <Text>Audio Call</Text>
                    </Button>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.085}>
                    <Button transparent Button onPress={() => this.onCallButtonPressed(REQUEST_MAKE_VIDEO_CALL, this.state.userToCallId)} >
                        <Icon name="ios-videocam" style={{ fontSize: 40 }} />
                        <Text>Video Call</Text>
                    </Button>
                </TouchableOpacity>
                <Button
                    onPress={() => this.openDialog(false)}
                    style={{ marginStart: 100, marginTop: 10 }}>
                    <Text>CLOSE</Text>
                </Button>
            </Content>
        );
    }

    attachFile() {
        DocumentPicker.show(
            {
                filetype: [DocumentPickerUtil.allFiles()],
                //All type of Files DocumentPickerUtil.allFiles()
                //Only PDF DocumentPickerUtil.pdf()
                //Audio DocumentPickerUtil.audio()
                //Plain Text DocumentPickerUtil.plainText()
            },
            (error, res) => {
                if (res) {
                    console.log("RES: ",res)
                    ConversationsModule.sendFile(encodeURI(res.uri));
                }
            }
        );
    }

    renderContent() {
        const { initLoading, messages, isLoadingMessages } = this.state;
        if (initLoading) {
            return (
                <Spinner size="large" />
            );
        }
        return (
            <ScrollView
                contentContainerStyle={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    flexGrow: 1
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingMessages}
                        onRefresh={this.onLoadMoreMessages} />
                }
            >
                <GiftedChat
                    messages={messages}
                    onSend={messages => this.onSend(messages.pop())}
                    user={{
                        _id: 1
                    }}
                />
              {/*  <TouchableOpacity onPress={this.attachFile} style={{ position :'absolute' , bottom:0, start: 0}}>
                    <Icon name="attach" style={{ fontSize: 30, color: 'black' , margin:5 }} />
                </TouchableOpacity>*/}
            </ScrollView>
        );
    }

    render() {
        console.log('render chat');
        return (
            <Container>
                <Header >
                    <Left style={{ flex: 1 }}>
                        <Icon name="ios-arrow-round-back" style={{ fontSize: 40, color: 'white' }} onPress={() => { Actions.pop(); }} />
                    </Left>
                    <Body style={{ flex: 2 }}>
                        <Text style={{ color: 'white' }}>{this.props.conversation.contactName}</Text>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        <TouchableOpacity activeOpacity={0.085} onPress={() => { this.openCallDialog(this.props.conversation); }}>
                            <Icon name="ios-call" style={{ fontSize: 40, color: 'white' }} />
                        </TouchableOpacity>
                    </Right>
                </Header>
                {this.renderContent()}
                <Dialog
                    title={this.state.userToCallName}
                    animationType='fade'
                    contentStyle={{ alignItems: 'flex-start', justifyContent: 'space-between', height: 200 }}
                    onTouchOutside={() => this.openDialog(false)}
                    visible={this.state.showDialog}
                >
                    <View>
                        {this.renderCallDialogContent()}
                    </View>
                </Dialog>
            </Container>
        );
    }
}
const mapStateToProps = state => {
    console.log('Chat: mapStateToProps function: ');
    return {
        messages: state.conversationsReducer.messages,
        loading: state.conversationsReducer.loadingConversationMessages,
        messagesTime: state.conversationsReducer.messagesTime
    };
};

const mapDispatchToProps = dispatch => {
    console.log('Chat: mapDispatchToProps function: ', mapDispatchToProps);
    return {
        messagesUpdated: (messages) => dispatch(messagesUpdated(messages)),
        clearChat: () => dispatch(clearChat())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
