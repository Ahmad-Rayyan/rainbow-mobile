import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, TouchableWithoutFeedback, FlatList, View, Image } from 'react-native';
import { Container, Content, ListItem, Thumbnail, Left, Text, Body, Right ,Badge} from 'native-base';
import moment from 'moment';
import { Spinner } from './common';
import profilePicHolder from '../resources/images/profilePicHolder.png';
import online from '../resources/images/online.png';
import { ConversationsModule } from '../main/RainbowNativeModules';


class Conversation extends Component {

    constructor(props) {
        super(props);
        this.onClickConversation = this.onClickConversation.bind(this);
    }


    componentDidUpdate() {
        {this.getTotal()}
    }

    getTotal() {
        let {myConversations,setTotal} = this.props;
        let count = 0 ;
        for(let key in myConversations){
            if(parseInt(myConversations[key].unreadMsgNb) > 0 ) {
                count += parseInt(myConversations[key].unreadMsgNb);
            }
        }
        setTotal(count)
    }

    onClickConversation(conversation) {
        console.log('ConversationsModule', conversation);
        ConversationsModule.openConversation(conversation, true);
        Actions.chat({
            conversation
        });
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
                <Text style={styles.NoDataMessagesText}>No Conversations Found</Text>
            </View>
        );
    }


    renderBadge(number) {
        if (number>0) {
            return (
                <Badge style={styles.badge} ><Text>{number}</Text></Badge>
            );
        }
    }

    renderContent() {
        if (this.props.loading) {
            return (
               <Spinner />
            );
        }
        return (
            <Content>
                <FlatList
                    data={this.props.myConversations}
                    renderItem={({ item }) =>
                    <TouchableWithoutFeedback onPress={() => { this.onClickConversation(item); }}>
                        <ListItem avatar>
                            <Left style={styles.thumbnailContainer}>
                                {this.renderBadge(item.unreadMsgNb)}
                                <Thumbnail style={styles.fakeThumbnailStyle} size={80} source={profilePicHolder} />
                                <Thumbnail style={styles.realThumbnailStyle} size={80} source={{ uri: item.contactProfilePic }} />
                                <Image style={styles.presenceIcon} source={online} />
                            </Left>
                            <Body style={styles.bodyContainer}>
                                <Text numberoflines={1} style={styles.textStyle}>{item.contactName}</Text>
                                <Text style={styles.textStyle} note>{(item.lastMessage == null) ? 'test message!' : item.lastMessage.split('\n')[0].slice(0, 10)}</Text>
                            </Body>
                            <Right>
                                <Text note>{ (item.date == null) ? ' ' : moment(new Date(item.date)).format('YYYY-M-D H:m')}</Text>
                            </Right>
                        </ListItem>
                    </TouchableWithoutFeedback>
                    }
                    ListEmptyComponent={this.ListEmpty}
                    keyExtractor={item => item.contactORConversationJId}
                />
            </Content>
        );
    }

    render() {
        console.log('Inside Render Conversation content');
        return (
            <Container style={styles.containerStyle}>
                {this.renderContent()}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    console.log('Inside Conversation mapStateToProps function: ');
    return {
        myConversations: state.conversationsReducer.conversations,
        loading: state.conversationsReducer.loadingConversations
    };
};

const mapDispatchToProps = (dispatch) => {
    console.log('Inside Conversation mapDispatchToProps function: ');
    return {

    };
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        flexDirection: 'column',
        margin: 10
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
        textAlign: 'center',
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
        paddingStart: 45
    },
    textStyle:{
        alignSelf:'flex-start'
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
    badge: {
        position: 'absolute',
        zIndex: 3,
        marginTop: -5,
        marginEnd:-5,
        scaleX: 0.7,
        scaleY: 0.7
    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);

