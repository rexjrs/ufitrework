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
            challengeID: '',
            needChallenge: null,
            products: []
        };
    }

    componentWillMount(){
        this.getData()
    }

    getProducts(){
        fetch(`${APIURL2}/getproducts`, {
                method: 'GET',
                headers: HEADERPARAM3
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            let result = responseJson.result
            let tempArray = []
            for(var i in result){
                let dosage = result[i].dosage
                if(result[i].dosage == ''){
                    dosage = 1
                }
                tempArray.push({
                    id: result[i].product_id,
                    name: result[i].product_name,
                    dosage: dosage,
                    selected: false
                })
            }
            this.setState({
                products: tempArray
            },this.logIn)
            AsyncStorage.setItem('selectedProducts',JSON.stringify(tempArray))
        })
    }

    getData(){
        AsyncStorage.multiGet(['username','firstName','profileImage','challenge','selectedProducts'], (err, keys) => {
            if(keys[0][1] == null){

            }else{
                this.setState({
                    username: keys[0][1],
                    firstName: keys[1][1],
                    profileImage: keys[2][1],
                    challengeID: keys[3][1],
                })
                if(keys[4][1] == null){
                    this.getProducts()
                }else{
                    this.setState({
                        products: JSON.parse(keys[4][1])
                    },this.logIn)
                }
            }
        })
    }

    logIn(){
        this.setState({loggedIn: true})
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
                        products: this.state.products,
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