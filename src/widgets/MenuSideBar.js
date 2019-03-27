import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Content, List, ListItem, Thumbnail, Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { logOutUser } from '../features/authentication/actions';
import { Spinner } from './common';

class MenuSampling extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.connectedUser
        };
        this.logout = this.logout.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.connectedUser === this.props.connectedUser) {
          return;
        }
        //fetch connecteduser and set state to reload
        this.setState({ user: nextProps.connectedUser });
    }
    logout() {
        this.props.logOutUser();
    }
    render() {
        if (this.state.user) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: '#0086CF', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                        <Thumbnail
                            source={{ uri: this.state.user[0].profilePic }}
                            size={400}
                        />
                        <Text style={{ color: '#fff', fontSize: 20, marginTop: 20, marginBottom: 20 }}>{this.state.user[0].name} </Text>
                    </View>
                    <View style={{ flex: 2, backgroundColor: '#fff' }}>
                        <Content>
                            <List>
                                <TouchableNativeFeedback >
                                    <ListItem>
                                        <Button transparent>
                                            <Icon style={{ color: '#0086CF' }} name="ios-person" size={30} />
                                            <Text>My profile</Text>
                                        </Button>
                                    </ListItem>
                                </TouchableNativeFeedback>
                                <TouchableOpacity activeOpacity={0.085}>
                                    <ListItem>
                                        <Button transparent Button onPress={() => this.logout()}>
                                            <Icon style={{ color: '#0086CF' }} name="ios-log-out" size={30} />
                                            <Text>Logout</Text>
                                        </Button>
                                    </ListItem>
                                </TouchableOpacity>
                            </List>
                        </Content>
                    </View>
                </View>
            );
        }
        return (
            <Spinner />
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        flexDirection: 'column',
        margin: 10,
    }
});
const mapStateToProps = state => {
    return {
        connectedUser: state.authenticationReducer.connectedUser
    };
};
const mapDispatchToProps = dispatch => {
    return {
        logOutUser: () => dispatch(logOutUser()),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MenuSampling);
