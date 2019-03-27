import React, { Component } from 'react';
import { StyleSheet, DeviceEventEmitter, FlatList, TouchableOpacity, TouchableWithoutFeedback, View, PermissionsAndroid, Image } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, ListItem, Left, Thumbnail, Right, Text, Body, Button } from 'native-base';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Spinner } from './common';
import { updatePresence } from '../features/contacts/actions';
import { WebrtcModule, ConversationsModule } from '../main/RainbowNativeModules';
import profilePicHolder from '../resources/images/profilePicHolder.png';
import online from '../resources/images/online.png';
import offline from '../resources/images/offline.png';
import away from '../resources/images/away.png';
import onlineMobile from '../resources/images/online_mobile.png';
import dnd from '../resources/images/dnd.png';
import busy from '../resources/images/busy.png';
import { REQUEST_MAKE_VIDEO_CALL, REQUEST_MAKE_AUDIO_CALL } from '../features/webrtc/types';
import Strings from '../resources/localization/Strings'

class Contacts extends Component {

    constructor(props) {
        super(props);
        this.onPresenceChanged = this.onPresenceChanged.bind(this);
        this.onCallButtonPressed = this.onCallButtonPressed.bind(this);
        this.updateContactPresence = this.updateContactPresence.bind(this);
        this.renderPresenceImage = this.renderPresenceImage.bind(this);
        this.renderCallDialogContent = this.renderCallDialogContent.bind(this);
        this.state = {
            userToCallName: '',
            userToCallId: '',
        };
    }

    componentDidMount() {
        console.log('inside contacts Did mount component');
        DeviceEventEmitter.addListener('presence_updated', this.onPresenceChanged);
    }

    onPresenceChanged(presense) {
        this.props.updatePresence(presense);
    }
    onCallButtonPressed(requestCode, contactJId) {
        console.log('onCallButtonPressed: contactJId', contactJId);
        this.openDialog(false);
        WebrtcModule.startCall(requestCode, contactJId);
        // this.requestPermissions(requestCode, contactJId);
    }
    openCallDialog(item) {
        console.log('openCallDialog', item.contactJId);
        this.setState({
            userToCallName: item.contactName,
            userToCallId: item.contactJId
        });
        this.openDialog(true);
    }
    openDialog(show) {
        console.log('openDialog', show);
        this.setState({ showDialog: show });
    }

    openConversation(contactData) {
        console.log('contactData', contactData);
        ConversationsModule.openConversation(contactData, false);
        Actions.chat({
            conversation: contactData
        });
    }
    async requestPermissions(contactJId, requestCode) {
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
                    WebrtcModule.startCall(contactJId, requestCode);
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

    updateContactPresence(contact) {
        if (this.props.contactPresence != null && contact != null) {
            console.log('Contacts:updateContactPresence', this.props.contactPresence);
            if (contact.contactJId === this.props.contactPresence.contactJId) {
                return (
                    <ListItem avatar>
                        <Left style={styles.thumbnailContainer}>
                            <Thumbnail style={styles.fakeThumbnailStyle} size={80} source={profilePicHolder} />
                            <Thumbnail style={styles.realThumbnailStyle} size={80} source={{ uri: contact.contactProfilePic }} />
                            {this.renderPresenceImage(this.props.contactPresence.status)}
                        </Left>
                        <Body style={styles.bodyContainer}>
                            <Text numberoflines={1}>{contact.contactName}</Text>
                            <Text note >{this.props.contactPresence.status}</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity activeOpacity={0.085} style={styles.containerStyle} onPress={() => { this.openCallDialog(contact); }}>
                                <Icon name='ios-call' size={40} color='#6666ff' />
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                );
            }
        }
        return (
            <ListItem avatar>
            <Left style={styles.thumbnailContainer}>
                <Thumbnail style={styles.fakeThumbnailStyle} size={80} source={profilePicHolder} />
                <Thumbnail style={styles.realThumbnailStyle} size={80} source={{ uri: contact.contactProfilePic }} />
                {this.renderPresenceImage(contact.status)}
            </Left>
            <Body style={styles.bodyContainer}>
                <Text numberoflines={1}>{contact.contactName}</Text>
                <Text note >{contact.status}</Text>
            </Body>
            <Right>
                <TouchableOpacity activeOpacity={0.085} style={styles.containerStyle} onPress={() => { this.openCallDialog(contact); }}>
                    <Icon name='ios-call' size={40} color='#0086CF' />
                </TouchableOpacity>
            </Right>
        </ListItem>
        );
    }

    ListEmpty = () => {
        if (this.props.loading) {
            return (
                <Content>
                    <Spinner size="large" />
                </Content>
            );
        }
        return (
            //View to show when list is empty
            <View style={styles.NoDataMessages}>
                <Text style={styles.NoDataMessagesText}>No Contacts Found</Text>
            </View>
        );
    }
    renderPresenceImage(presence) {
            console.log('Contacts:renderPresenceImage', presence);
            switch (presence) {
                case 'online':
                    return <Image style={styles.presenceIcon} source={online} />;
                case 'away':
                    return <Image style={styles.presenceIcon} source={away} />;
                case 'mobile_online':
                    return <Image style={styles.presenceIcon} source={onlineMobile} />;
                case 'manual_away':
                    return <Image style={styles.presenceIcon} source={away} />;
                case 'DoNotDisturb':
                    return <Image style={styles.presenceIcon} source={dnd} />;
                case 'busy':
                    return <Image style={styles.presenceIcon} source={busy} />;
                case 'busy_audio':
                    return <Image style={styles.presenceIcon} source={busy} />;
                case 'busy_video':
                    return <Image style={styles.presenceIcon} source={busy} />;
                default: return <Image style={styles.presenceIcon} source={offline} />;

            }
    }
    renderContent() {
        if (this.props.loading) {
            return (
                <Spinner size="large" />
            );
        }
        return (
            <Content>
                <FlatList
                    data={this.props.myContactsList}
                    extraData={this.props.contactPresence}
                    renderItem={({ item }) =>
                        <TouchableWithoutFeedback onPress={() => { this.openConversation(item); }}>
                        {this.updateContactPresence(item)}
                        </TouchableWithoutFeedback>
                    }
                    ListEmptyComponent={this.ListEmpty}
                    keyExtractor={item => item.contactJId}
                />
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
            </Content>
        );
    }
    renderCallDialogContent() {
        return (
            <Content >
                <TouchableOpacity activeOpacity={0.085} >
                    <Button transparent onPress={() => this.onCallButtonPressed(REQUEST_MAKE_AUDIO_CALL, this.state.userToCallId)}>
                        <Icon name="ios-call" size={40} />
                        <Text>{Strings.audioCall}</Text>
                    </Button>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.085}>
                    <Button transparent Button onPress={() => this.onCallButtonPressed(REQUEST_MAKE_VIDEO_CALL, this.state.userToCallId)} >
                        <Icon name="ios-videocam" size={40} />
                        <Text>{Strings.videoCall}</Text>
                    </Button>
                </TouchableOpacity>
                <Button
                    onPress={() => this.openDialog(false)}
                    style={{ marginStart: 100, marginTop: 10 }}
                >
                    <Text>{Strings.close}</Text>
                </Button>
            </Content>
        );
    }
    render() {
        console.log('Inside Render contacts content');
        return (
            <Container style={styles.containerStyle}>
                {this.renderContent()}
            </Container>
        );
    }
}
const mapStateToProps = state => {
    console.log('Inside Contacts mapStateToProps function: ');
    return {
        myContactsList: state.contactsReducer.contacts,
        loading: state.contactsReducer.loadingContacts,
        contactPresence: state.contactsReducer.contactPresence
    };
};

const mapDispatchToProps = dispatch => {
    console.log('Inside Contacts mapDispatchToProps function: ');
    return {
        updatePresence: (contactPresence) => dispatch(updatePresence(contactPresence)),
    };
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        flexDirection: 'column',
        margin: 10,
    },
    item: {
        fontSize: 18,
        height: 44,

    },
    NoDataMessages: {
        fontSize: 25,
        justifyContent: 'center',
        flex: 1,
        marginTop: 100
    },
    NoDataMessagesText: {
        textAlign: 'center'
    },
    image: {
        width: 70,
        height: 70
    },
    containerStyle: {
        backgroundColor: '#ffffff',
        height: 'auto'
    },
    bodyContainer: {
        paddingStart: 45,
    },
    thumbnailContainer: {
        position: 'relative',
        top: 5
    },
    realThumbnailStyle: {
        position: 'absolute',
        zIndex: 2
    },
    fakeThumbnailStyle: {
        position: 'absolute',
        zIndex: 1,
    },
    presenceIcon: {
        position: 'absolute',
        zIndex: 3,
        width: 16,
        height: 16,
        top: 40,
        marginLeft: 40,
        borderColor: 'white',
        borderRadius: 40,
        borderWidth: 1
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
