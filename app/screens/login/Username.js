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
  Platform,
  ScrollView
} from 'react-native';

export default class Username extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '',
            usernameTaken: false,
            loading: false,
            usernameInvalid: false
        };
    }

    nextPage() {
        this.setState({
            errorField: false,
            usernameTaken: false
        })
        if(this.state.username == "" || this.state.username == null){
            this.setState({
                errorField: true
            })
        }
        else if(this.validateUsername()){
            this.setState({
                usernameInvalid: true
            })
        }
        else{
            this.setState({
                loading: true
            })
            fetch(`${APIURL}/checkusername?username=${this.state.username}`, {
                method: 'GET',
                headers: HEADERPARAM
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    this.setState({
                        loading: false
                    })
                    AsyncStorage.setItem('registerUsername', this.state.username);
                    this.props.navigation.navigate('Ba')
                }else{
                    this.setState({
                        usernameTaken: true,
                        loading: false
                    })
                }
            })
        }
    }

    getData() {
        AsyncStorage.multiGet(['registerUsername'], (err, keys) => {
            this.setState({
                username: keys[0][1],
            })
        });
    }

    componentWillMount() {
        this.getData();
    }

     validateUsername(){
        return this.state.username.indexOf(' ') >=0
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
                    <Text style={{fontWeight: "600",color: "black"}}>Create a username</Text>
                    <Text style={{fontSize: 14, marginTop: 10}}>This is the name your friends will see</Text>
                </View>
                <View style={styles.formArea}>
                        <Text style={styles.inputText}>Username</Text>
                        <View style={{borderBottomColor: "gray", borderBottomWidth: 1}}>
                        <TextInput 
                            style={styles.inputDetail}
                            value={this.state.username}
                            returnKeyType="next"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            onChangeText={(username) => this.setState({username})}
                            onSubmitEditing={this.nextPage.bind(this)}
                        />
                        </View>
                        {this.state.usernameInvalid &&
                            <Text style={{color: "red", fontSize: 14}}>Username may not contain spaces</Text>
                        }
                        {this.state.errorField &&
                            <Text style={{color: "red", fontSize: 14}}>Username cannot be empty</Text>
                        }
                        {this.state.usernameTaken &&
                            <Text style={{color: "red", fontSize: 14}}>This username has been taken</Text>
                        }
                        {this.state.loading &&
                                <ActivityIndicator
                                    style={{marginTop: 20}}
                                    animating={true}
                                    color="#FF9800"
                                    size="large"
                                />
                        }
                        <View style={styles.nextBtnContainer}>
                            <TouchableOpacity
                                style={styles.nextBtn}
                                onPress={this.nextPage.bind(this)}
                            >
                                <Text style={styles.nextBtnText}>Next</Text>
                            </TouchableOpacity>
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
        backgroundColor: "white",
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
    }
});
