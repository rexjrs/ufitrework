import React, { Component } from 'react'
import { Tabs } from './config/router'
import { LoginNav } from './config/router'
import {
  StyleSheet,
  View,
  AsyncStorage,
  StatusBar
} from 'react-native';
import './config/config';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loggedIn: false,
            addChallenge: false,
            username: '',
            firstName: '',
            profileImage: '',
            challengeID: ''
        };
    }

    componentWillMount(){
        this.getData()
    }

    getData(){
        AsyncStorage.multiGet(['username','firstName','profileImage','challenge'], (err, keys) => {
            if(keys[0][1] == null){

            }else{
                console.log(keys[3][1])
                this.setState({
                    username: keys[0][1],
                    firstName: keys[1][1],
                    profileImage: keys[2][1],
                    challengeID: keys[3][1],
                    loggedIn: true,
                })
            }
        })
    }

    loggedIn(){
        this.getData()
    }

    logout(){
        this.setState({
            loggedIn: false
        })
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <StatusBar
                    barStyle="default"
                />
                {this.state.loggedIn &&
                    <Tabs screenProps={{
                        username: this.state.username,
                        firstName: this.state.firstName,
                        profileImage: this.state.profileImage,
                        challengeID: this.state.challengeID,
                        logout: this.logout.bind(this)
                    }}/>
                }
                {!this.state.loggedIn &&
                    <LoginNav screenProps={{
                        login: this.loggedIn.bind(this)
                    }}/>
                }
            </View>
        ) 
    }
}

export default Index;