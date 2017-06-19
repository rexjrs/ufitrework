import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
Image,
TouchableOpacity,
Dimensions,
KeyboardAvoidingView,
TextInput,
AsyncStorage,
ActivityIndicator
} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class NormalLogin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '',
            password: '',
            loading: false,
            loginBtn: true,
            emptyError: false,
            loginFailed: false
        };
    }

    loginAttempt() {
        this.setState({
            emptyError: false,
            loginFailed: false
        });
        dismissKeyboard();
        let username = this.state.username;
        let password = this.state.password;
        if(username == "" || password == "" || username == undefined || password == undefined){
            this.setState({
                emptyError: true,
            });
        }else{
            this.setState({
                loading: true,
                loginBtn: false,
                loginFailed: false
            });
            let params = {
                username: username,
                password: password
            }
            fetch(`${APIURL3}/login`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: HEADERPARAM3
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    setTimeout(() => {
                        AsyncStorage.setItem('loginType','normal');
                        AsyncStorage.setItem('username',responseJson.result.username);
                        AsyncStorage.setItem('BA', responseJson.result.BA);
                        AsyncStorage.setItem('challenge', responseJson.result.coach_challenge_id);
                        AsyncStorage.setItem('firstName', responseJson.result.first_name);
                        AsyncStorage.setItem('lastName', responseJson.result.last_name);
                        AsyncStorage.setItem('email', responseJson.result.email);
                        AsyncStorage.setItem('birthday', responseJson.result.birthday);
                        AsyncStorage.setItem('vision', responseJson.result.vision);
                        AsyncStorage.setItem('gender', responseJson.result.gender);
                        AsyncStorage.setItem('profileImage', responseJson.result.profile_picture);
                        this.setState({
                            loading: false,
                            loginBtn: true
                        })
                        if(!responseJson.result.coach_challenge_id){
                            this.props.navigator.push({
                                id: 'addchallenge'
                            })
                        }else{
                            this.props.screenProps.login()
                        }
                    }, 2000)
                }else{
                    setTimeout(() => {
                        this.setState({
                            loading: false,
                            loginBtn: true,
                            loginFailed: true
                        });
                    }, 2000)
                }
            })
        }
    }
    
    backToLogin() {
        this.props.navigation.goBack()
    }

    render() {
        return(
            <Image source={require('../../assets/gradientBg.png')} style={styles.container}>
                <View style={styles.backTop}>
                    <TouchableOpacity 
                        style={styles.backBtn}
                        onPress={this.backToLogin.bind(this)}
                    >
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    {/*<Text style={{fontSize: 40, color: "white", fontWeight: "bold", fontStyle: "italic"}}>ThomFIT</Text>*/}
                    <Image source={require('../../assets/logos/logo.png')} style={styles.uniLogo}>
                    </Image>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonRow}>
                        <Text style={styles.inputText}>Email/Username</Text>
                        <View style={{borderBottomColor: "white", borderBottomWidth: 1}}>
                        <TextInput 
                            style={styles.inputDetail}
                            onSubmitEditing={()=> this.passwordInput.focus()}
                            returnKeyType="next"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            onChangeText={(username) => this.setState({username})}
                        />
                        </View>
                        <Text style={styles.inputText}>Password</Text>
                        <View style={{borderBottomColor: "white", borderBottomWidth: 1}}>
                        <TextInput 
                            style={styles.inputDetail}
                            ref={(input) => this.passwordInput = input}
                            secureTextEntry
                            returnKeyType="go"
                            underlineColorAndroid="transparent"
                            onChangeText={(password) => this.setState({password})}
                            blurOnSubmit={true}
                            onSubmitEditing={this.loginAttempt.bind(this)}
                        />
                        </View>
                        {this.state.emptyError &&
                            <View style={styles.loadingContainer}>
                                <Text style={styles.errorLogin}>Email and password can't be empty</Text>
                            </View>
                        }
                        {this.state.loginFailed &&
                            <View style={styles.loadingContainer}>
                                <Text style={styles.errorLogin}>Email or password was incorrect</Text>
                            </View>
                        }
                        {this.state.loading &&
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator
                                    animating={true}
                                    color="white"
                                    size="large"
                                />
                            </View>
                        }
                        {this.state.loginBtn &&
                        <TouchableOpacity 
                            style={styles.mainBtn}
                            onPress={this.loginAttempt.bind(this)}
                        >
                            <Text style={styles.mainBtnText}>Login</Text>
                        </TouchableOpacity>
                        }
                    </View>
                </View>
            </Image>
        )
    }
}
var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: null,
        width: null,
    },
    backBtn: {
        padding: 10,
    },
    backTop: {
        alignItems: "flex-start",
        paddingLeft: 10,
        paddingTop: 10
    },
    backText: {
        color: "white",
        backgroundColor: "transparent"
    },
    logoContainer: {
        flex: 0.3,
        alignItems: "center",
        justifyContent: "center",
    },
    uniLogo: {
    },
        buttonContainer: {
        flex: 0.7,
        alignItems: "center"
    },
        loadingContainer: {
        width: window.width * 0.7,
        alignItems: "center",
        marginTop: 10
    },
        mainBtn: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 4,
        padding: 7,
        width: window.width * 0.7,
        alignItems: "center"
    },
    mainBtnText: {
        color: "white",
        backgroundColor: "transparent"
    },
    inputText: {
        color: "white",
        marginTop: 10,
        backgroundColor: "transparent"
    },
    inputDetail: {
        padding: 0,
        borderBottomWidth: 1,
        borderColor: "white",
        color: "white",
        height: 25
    },
    errorLogin: {
        color: "white",
        fontSize: 12
    }
});
