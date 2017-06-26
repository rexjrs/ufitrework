import React, { Component } from 'react'
import { Tabs } from './config/router'
import { LoginNav } from './config/router'
import {
  StyleSheet,
  View,
  AsyncStorage,
  StatusBar,
  Image
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
            products: [],
            loaded: false
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
        AsyncStorage.multiGet(['username','firstName','profileImage','challenge','selectedProducts','fourTwelve'], (err, keys) => {
            if(keys[0][1] == null){
                this.setState({loaded: true})
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
                if(keys[5][1] == null){
                    this.setState({
                        fourTwelve: "false"
                    })
                }else{
                    this.setState({
                        fourTwelve: keys[5][1]
                    })
                }
            }
        })
    }

    setFourTwelve(value){
        this.setState({
            fourTwelve: value
        })
    }

    setProducts(value){
        AsyncStorage.setItem('selectedProducts',JSON.stringify(value));
        this.setState({
            products: value
        })
    }

    logIn(){
        this.setState({loaded: true,loggedIn: true})
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
        var restingView = ()=>{
            return(
                <Image source={require('./assets/gradientBg.png')} style={{flex: 1,backgroundColor: "#FF9800",height: null,width: null}}>

                </Image>
            )
        }
        return(
            <View style={{flex: 1}}>
                <StatusBar
                    barStyle="default"
                />
                {!this.state.loaded &&
                    restingView()
                }
                {this.state.loggedIn &&
                    this.state.loaded &&
                    <Tabs screenProps={{
                        username: this.state.username,
                        firstName: this.state.firstName,
                        profileImage: this.state.profileImage,
                        challengeID: this.state.challengeID,
                        products: this.state.products,
                        fourTwelve: this.state.fourTwelve,
                        setFourTwelve: this.setFourTwelve.bind(this),
                        setProducts: this.setProducts.bind(this),
                        logout: this.logout.bind(this)
                    }}/>
                }
                {!this.state.loggedIn &&
                    this.state.loaded &&
                    <LoginNav screenProps={{
                        login: this.loggedIn.bind(this)
                    }}/>
                }
            </View>
        ) 
    }
}

export default Index;