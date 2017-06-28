import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native';

export default class Username extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ba: '',
            createAcc: true
        };
    }

    nextPage() {
        this.setState({
            errorField: false,
            createAcc: false
        })
        if(this.state.ba == "" || this.state.ba == null){
            this.setState({
                errorField: true
            })
        }else{
            AsyncStorage.multiGet(['registerUsername','registerEmail','registerFirstName','registerLastName','registerPassword','regisType','registerId'], (err, keys) => {
                let params = [];
                let urlEnd = "";
                if(keys[5][1] == "google"){
                    params = JSON.stringify({
                        first_name: keys[2][1],
                        email: keys[1][1],
                        last_name: keys[3][1],
                        username: keys[0][1],
                        google_id: keys[6][1],
                        BA: this.state.ba
                    });
                    urlEnd = "socialmediaregistration";
                    AsyncStorage.setItem('loginTypeSocial','google');
                    AsyncStorage.setItem('loginType','socialmedia');
                }else if(keys[5][1] == "facebook"){
                    params = JSON.stringify({
                        first_name: keys[2][1],
                        email: keys[1][1],
                        last_name: keys[3][1],
                        username: keys[0][1],
                        facebook_id: keys[6][1],
                        BA: this.state.ba
                    });
                    urlEnd = "socialmediaregistration";
                    AsyncStorage.setItem('loginTypeSocial','facebook');
                    AsyncStorage.setItem('loginType','socialmedia');
                }else{
                    params = JSON.stringify({
                        email: keys[1][1],
                        first_name: keys[2][1],
                        last_name: keys[3][1],
                        password: keys[4][1],
                        username: keys[0][1],
                        BA: this.state.ba
                    });
                    urlEnd = "registeruser";
                    AsyncStorage.removeItem('loginTypeSocial');
                }
                console.log(params)
                fetch(`${APIURL3}/${urlEnd}`, {
                    method: 'POST',
                    body: params,
                    headers: HEADERPARAM3
                })
                .then((response) => {
                    let responseJson = JSON.parse(response._bodyInit);
                    if(responseJson.status == "ok"){
                        AsyncStorage.setItem('username', keys[0][1]);
                        AsyncStorage.setItem('email', keys[1][1]);
                        AsyncStorage.setItem('firstName', keys[2][1]);
                        AsyncStorage.setItem('lastName', keys[3][1]);
                        if(this.state.ba){
                            AsyncStorage.setItem('BA', this.state.ba);
                        }
                        AsyncStorage.multiRemove(['registerFirstName','registerLastName','registerEmail','registerPassword','registerRePassword','registerUsername','registerBa']);
                        this.props.navigation.navigate('AddChallenge')
                    }else{
                    }
                })
            });
        }
    }

    nextPageNoBA() {
        this.setState({
            createAcc: false
        })
        AsyncStorage.multiGet(['registerUsername','registerEmail','registerFirstName','registerLastName','registerPassword','regisType','registerId'], (err, keys) => {
            let params = [];
            let urlEnd = "";
            if(keys[5][1] == "google"){
                params = JSON.stringify({
                    first_name: keys[2][1],
                    last_name: keys[3][1],
                    username: keys[0][1],
                    email: keys[1][1],
                    google_id: keys[6][1],
                });
                urlEnd = "socialmediaregistration";
                AsyncStorage.setItem('loginTypeSocial','google');
                AsyncStorage.setItem('loginType','socialmedia');
            }else if(keys[5][1] == "facebook"){
                params = JSON.stringify({
                    first_name: keys[2][1],
                    last_name: keys[3][1],
                    email: keys[1][1],
                    username: keys[0][1],
                    facebook_id: keys[6][1],
                });
                urlEnd = "socialmediaregistration";
                AsyncStorage.setItem('loginTypeSocial','facebook');
                AsyncStorage.setItem('loginType','socialmedia');
            }else{
                params = JSON.stringify({
                    email: keys[1][1],
                    first_name: keys[2][1],
                    last_name: keys[3][1],
                    password: keys[4][1],
                    username: keys[0][1],
                });
                urlEnd = "registeruser";
                AsyncStorage.removeItem('loginTypeSocial');
            }
            console.log(params)
            fetch(`${APIURL3}/${urlEnd}`, {
                method: 'POST',
                body: params,
                headers: HEADERPARAM3
            })
            .then((response) => {
                console.log(response)
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    AsyncStorage.setItem('username', keys[0][1]);
                    AsyncStorage.setItem('email', keys[1][1]);
                    AsyncStorage.setItem('firstName', keys[2][1]);
                    AsyncStorage.setItem('lastName', keys[3][1]);
                    if(this.state.ba){
                        AsyncStorage.setItem('BA', this.state.ba);
                    }
                    AsyncStorage.multiRemove(['registerFirstName','registerLastName','registerEmail','registerPassword','registerRePassword','registerUsername','registerBa']);
                    this.props.navigation.navigate('AddChallenge')
                }else{
                    console.log(responseJson);
                }
            })
        });
    }

    getData() {
        AsyncStorage.multiGet(['registerBa'], (err, keys) => {
            this.setState({
                ba: keys[0][1],
            })
        });
    }

    componentWillMount() {
        this.getData();
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
            >
                <View style={styles.backTop}>
                    <TouchableOpacity 
                        style={styles.backBtn}
                        onPress={()=>this.props.navigation.goBack()}
                    >
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    {/*<Text style={{fontSize: 40, color: "gray", fontWeight: "bold", fontStyle: "italic"}}>ThomFIT</Text>*/}
                    {/*<Image source={require('../../../assets/logo/logoColor.png')} style={styles.uniLogo}>
                    </Image>*/}
                </View>
                <View style={styles.titleArea}> 
                    <Text style={{fontWeight: "600",color: "black"}}>Business Associate Number</Text>
                    <Text style={{fontSize: 14, marginTop: 10, paddingLeft: 50, paddingRight: 50, textAlign: "center"}}>This is your Unicity BA number. If you don't have one, tap 'skip'</Text>
                </View>
                <View style={styles.formArea}>
                        <Text style={styles.inputText}>BUSINESS ASSOCIATE NUMBER</Text>
                        <View style={{borderBottomColor: "gray", borderBottomWidth: 1}}>
                        <TextInput 
                            style={styles.inputDetail}
                            value={this.state.ba}
                            returnKeyType="next"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="numeric"
                            underlineColorAndroid="transparent"
                            onChangeText={(ba) => this.setState({ba})}
                            onSubmitEditing={this.nextPage.bind(this)}
                        />
                        </View>
                        {this.state.errorField &&
                            <Text style={{color: "red", fontSize: 14}}>Please enter a business associate number or tap "Skip"</Text>
                        }
                        <View style={styles.nextBtnContainer}>
                            {!this.state.createAcc &&
                                <ActivityIndicator
                                    style={{marginTop: 20}}
                                    animating={true}
                                    color="#FF9800"
                                    size="large"
                                />
                            }
                            {this.state.createAcc &&
                            <TouchableOpacity
                            style={styles.nextBtn}
                            onPress={this.nextPage.bind(this)}
                            >
                            <Text style={styles.nextBtnText}>Create Account</Text>
                            </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.skipContainer}>
                            {this.state.createAcc &&
                            <TouchableOpacity
                            onPress={this.nextPageNoBA.bind(this)}
                            >
                            <Text style={styles.skipText} >Skip</Text>
                            </TouchableOpacity>
                            }
                        </View>
                </View>
            </ScrollView>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    backBtn: {
        padding: 10,
    },
    backTop: {
        alignItems: "flex-start",
        paddingLeft: 10,
        paddingTop: 10,
        marginBottom: 120
    },
    backText: {
        color: "gray",
    },
    logoContainer: {
        flex: 0.25,
        alignItems: "center",
        justifyContent: "center",
    },
    titleArea: {
        flex: 0.2,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    formArea: {
        flex: 0.55,
        alignItems: "center"
    },
    inputText: {
        marginTop: 10,
        width: window.width * 0.7,
        textAlign: "left",
        fontSize: 12
    },
    inputDetail: {
        padding: 0,
        borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: "gray",
        color: "gray",
        height: 25,
        width: window.width*0.7
    },
    nextBtnContainer: {
        height: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    nextBtn: {
        width: window.width * 0.7,
        height: 45,
        backgroundColor: "#FF9800",
        alignItems: "center",
        justifyContent: "center"
    },
    nextBtnText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
    skipContainer: {
        width: window.width * 0.7,
        alignItems: "flex-end"
    },
    skipText: {
        color: "#FF9800"
    }
});
