
import React, {
    Component
} from 'react';
import {
    StyleSheet,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import {
    Actions
} from 'react-native-router-flux';
import {
    Container,
    Content,
    Text,
    Thumbnail
} from 'native-base';
import Sound from 'react-native-sound';
import { connect } from 'react-redux';
import { WebrtcModule } from '../main/RainbowNativeModules';
import { getCallState } from '../features/webrtc/actions';
import StopWatch from './common/StopWatch';
import endCall from '../resources/images/endCall.png';
import answerVideoCall from '../resources/images/answerVideoCall.png';
import answerAudioCall from '../resources/images/answerAudioCall.png';
import videoBackground from '../resources/images/videoBackground.png';
import profilePic from '../resources/images/profilePic.png';
import RTCView from './RTCView';
import { REQUEST_TAKE_VIDEO_CALL, REQUEST_TAKE_AUDIO_CALL } from '../features/webrtc/types';

class Webrtc extends Component {

    constructor(props) {
        super(props);
        this.state = { isRinging: true };
        this.sound = null;
        this.onPeerEndCall = this.onPeerEndCall.bind(this);
        this.onAnswerVideoCallButtonPressed = this.onAnswerVideoCallButtonPressed.bind(this);
        this.onAnswerAudioCallButtonPressed = this.onAnswerAudioCallButtonPressed.bind(this);
        this.onHangupCallButtonPressed = this.onHangupCallButtonPressed.bind(this);
        this.handleRinging = this.handleRinging.bind(this);
        this.stopRinging = this.stopRinging.bind(this);
        this.resetStopwatch = this.resetStopwatch.bind(this);
        this.startStopStopWatch = this.startStopStopWatch.bind(this);
    }

    componentDidMount() {
        console.log('Webrtc: componentDidMount');
        this.handleRinging();
    }
    componentDidUpdate() {
        if (this.props.callState === 'ACTIVE' && !this.props.isVideoCall) {
          this.startStopStopWatch();
        }
      }
    componentWillUnmount() {
        console.log('Webrtc: componentWillUnmount');
        this.stopRinging();
    }
    //callee reject the call
    onPeerEndCall() {
        console.log('Webrtc: onPeerEndCall - Caller End tha call');
        this.resetStopwatch();
        this.stopRinging();
        WebrtcModule.rejectCall();
        Actions.pop();
    }
    // caller end the call before callee answer it
    onHangupCallButtonPressed() {
        console.log('Webrtc: onHangupCallButtonPressed');
        if (this.props.callState !== 'ACTIVE') {
            console.log('unactive call stop ringing');
            this.stopRinging();
        }
        WebrtcModule.hangupCall();
    }
    //callee accept the Incoming call
    onAnswerVideoCallButtonPressed() {
        console.log('Webrtc: Accept the video call : ');
        this.stopRinging();
        WebrtcModule.takeCall(REQUEST_TAKE_VIDEO_CALL);
    }

    onAnswerAudioCallButtonPressed() {
        this.stopRinging();
        WebrtcModule.takeCall(REQUEST_TAKE_AUDIO_CALL);
    }
    handleRinging() {
        console.log('Webrtc: handleRinging');
        const ringingSound = this.props.callState === 'RINGING_OUTGOING' ? 'outgoing_ringing.mp3' : 'incoming_ringing.mp3';
        if (this.sound != null) {
            this.stopRinging();
        }
        this.sound = new Sound(ringingSound, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('something went wrong', error);
            }
            this.sound.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
            //// Loop indefinitely until stop() is called
            this.sound.setNumberOfLoops(-1);
        });
    }
    stopRinging() {
        console.log('stopRinging');
        if (this.sound != null) {
            if (this.sound.isPlaying()) {
                this.sound.stop();
            }
            // this.sound.release();
            this.sound.stop();
        }
    }
    resetStopwatch() {
        this.refs.StopWatch.resetStopwatch();
    }
    startStopStopWatch() {
        this.refs.StopWatch.startStopStopWatch();
    }

    renderProfilePic(image) {
        return (
            image ? <Thumbnail style={styles.thumbnail} source={{ uri: `data:image/gif;base64,${image}` }} /> : <Thumbnail style={styles.thumbnail} source={profilePic} />
        );
    }
    renderCallState(callState) {
        switch (callState) {
            case 'RINGING_INCOMING':
                return 'Incoming Call';
            case 'RINGING_OUTGOING':
                return 'Outgoing Call';
            default: return callState;
        }
    }
    renderCallView() {
        return (
            <ImageBackground source={videoBackground} style={styles.BackgroundImage}>
                <Content style={styles.contentStyleBefore}>
                    <Text style={styles.TextStyle}>{this.renderCallState(this.props.callState)}</Text>
                    <Content style={styles.thumbnailContent}>{this.renderProfilePic(this.props.contactProfilePic)}</Content>
                    {this.renderButtons(this.props.callState)}
                </Content>
            </ImageBackground>
        );
    }
    renderButtons(callState) {
        if (callState === 'RINGING_INCOMING' && this.props.isVideoCall) {
            return (
                <Container style={styles.containerSt}>
                    <TouchableOpacity onPress={() => { this.onPeerEndCall(); }}>
                        <Image source={endCall} style={styles.endCallImageIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.onAnswerVideoCallButtonPressed(); }}>
                        <Image source={answerVideoCall} style={styles.answerVideoCallIcon} />
                    </TouchableOpacity>
                </Container>
            );
        } else if (callState === 'RINGING_INCOMING' && !this.props.isVideoCall){
            return (
                <Container style={styles.containerSt}>
                    <TouchableOpacity onPress={() => { this.onPeerEndCall(); }}>
                        <Image source={endCall} style={styles.endCallImageIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.onAnswerAudioCallButtonPressed(); }}>
                        <Image source={answerAudioCall} style={styles.answerAudioCallIcon} />
                    </TouchableOpacity>
                </Container>

            );
        } else {
            return (
                <TouchableOpacity activeOpacity={0.085} style={styles.endCallImageContainerBefore} onPress={() => { this.onHangupCallButtonPressed(); }}>
                    <Image source={endCall} style={styles.hangUpCallImageIcon} />
                </TouchableOpacity>
            );
        }
    }
    renderContent() {
        if (this.props.callState === 'ACTIVE' && this.props.isVideoCall) {
            this.stopRinging();
            return (
                <ImageBackground source={videoBackground} style={styles.BackgroundImage}>
                    <Content style={styles.contentStyle}>
                        <RTCView
                            streamURL="remote"
                            style={styles.remoteVideo}
                            key="1235"
                        />
                        <RTCView
                            streamURL="local"
                            style={styles.localVideo}
                            key="121"
                        />
                        <TouchableOpacity activeOpacity={0.085} style={styles.endCallImageContainerAfter} onPress={() => { this.onHangupCallButtonPressed(); }}>
                            <Image source={endCall} style={styles.endCallImageIcon} />
                        </TouchableOpacity>
                    </Content>
                </ImageBackground>
            );
        }
        else if (this.props.callState === 'ACTIVE' && !this.props.isVideoCall) {
            this.stopRinging();
            return (
                <ImageBackground source={videoBackground} style={styles.BackgroundImage}>
                <Content style={styles.contentStyleBefore}>
                    <StopWatch ref='StopWatch' />
                    <Content style={styles.thumbnailContent}>{this.renderProfilePic(this.props.contactProfilePic)}</Content>
                    {this.renderButtons(this.props.callState)}
                </Content>
            </ImageBackground>
            );
        } else {
            return (
                <Container>
                {this.renderCallView()}
                </Container>
            );
        }
    }

    render() {
        return (
            <Container >
                {this.renderContent()}
            </Container>
        );
    }
}
const mapStateToProps = state => {
    console.log('Inside Webrtc mapStateToProps function: ');
    return {
        callState: state.webrtcReducer.callState,
        isVideoCall: state.webrtcReducer.wasInitiatedWithVideo
    };
};

const mapDispatchToProps = dispatch => {
    console.log('Inside Webrtc mapDispatchToProps function: ');
    return {
        getCallState: (callState) => dispatch(getCallState(callState))
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    contentStyleBefore: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center'
    },
    thumbnailContent: {
        alignSelf: 'center',
        marginTop: 20,
    },
    thumbnail: {
        marginTop: 10,
        alignSelf: 'center',
        width: 140,
        height: 140,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 100,
    },
    BackgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'cover'
    },
    containerSt: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        width: 400,
        backgroundColor: 'rgba(128, 128, 128, 0.05)'
    },
    endCallImageIcon: {
        width: 80,
        height: 80,
        margin: 30,
        opacity: 1
    },
    answerVideoCallIcon: {
        width: 80,
        height: 80,
        margin: 30,
        opacity: 1
    },
    answerAudioCallIcon: {
        width: 80,
        height: 80,
        margin: 30,
        opacity: 1
    },
    hangUpCallImageIcon: {
        width: 80,
        height: 80,
        marginTop: 30,
        alignSelf: 'center'
    },
    endCallImageContainerBefore: {
        marginTop: 30,
        alignSelf: 'center',
    },
    endCallImageContainerAfter: {
        position: 'absolute',
        bottom: 20,
        width: 100,
        alignSelf: 'center',
    },
    TextStyle: {
        fontSize: 20,
        color: '#ffffff',
        alignSelf: 'center'
    },
    remoteVideo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 30,
    },
    localVideo: {
        position: 'absolute',
        left: 150,
        top: 20,
        width: 150,
        height: 150,
    },

    selfView: {
        width: 200,
        height: 300,
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(Webrtc);
