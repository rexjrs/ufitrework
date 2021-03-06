import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
    StatusBar,
    Platform
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
// import FBSDK, {LoginManager, AccessToken} from 'react-native-fbsdk'
import {FBLogin, FBLoginManager} from 'react-native-facebook-login'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    componentDidMount(){
        try{
            GoogleSignin.hasPlayServices({ autoResolve: true });
            GoogleSignin.configure({
            webClientId: "365391078149-4dnmsf3tnsrusgsvsr5eu42i52ft5iia.apps.googleusercontent.com",
            offlineAccess: false
            });
        }
        catch(err) {
        console.log("Google error: ", err.code, err.message);
        }
    }

    androidFBLogin(){
        this.setState({
            loadingFacebook: true,
            loading: true
        })
        FBLoginManager.loginWithPermissions(["email","user_friends"], (error, data) => {
        if (!error) {
            this.loginFB(JSON.parse(data.profile))
        } else {
            this.setState({
                loadingFacebook: false,
                loading: false
            })
        }
        })
    }

    loginFB(value){
        console.log(value.id)
        let params = {
            facebook_id: value.id
        }
        fetch(`${APIURL3}/socialmedialogin`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: HEADERPARAM3
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            if(responseJson.code == "00"){
                AsyncStorage.setItem('loginType','socialmedia');
                AsyncStorage.setItem('loginTypeSocial','facebook');
                AsyncStorage.setItem('username',responseJson.result.username);
                if(responseJson.result.profile_picture){
                    AsyncStorage.setItem('profileImage', responseJson.result.profile_picture);
                }
                if(responseJson.result.BA){
                    AsyncStorage.setItem('BA', responseJson.result.BA);
                }
                if(responseJson.result.coach_challenge_id){
                    AsyncStorage.setItem('challenge', responseJson.result.coach_challenge_id);
                }
                if(responseJson.result.first_name){
                    AsyncStorage.setItem('firstName', responseJson.result.first_name);  
                }
                if(responseJson.result.birthday){
                    AsyncStorage.setItem('birthday', responseJson.result.birthday);
                }
                if(responseJson.result.vision){
                    AsyncStorage.setItem('vision', responseJson.result.vision);
                }
                if(responseJson.result.gender){
                    AsyncStorage.setItem('gender', responseJson.result.gender);
                }
                AsyncStorage.setItem('lastName', responseJson.result.last_name);
                AsyncStorage.setItem('email', responseJson.result.email);
                if(!responseJson.result.coach_challenge_id){
                    this.props.navigation.navigate('AddChallenge')
                }else{
                    this.props.screenProps.login()
                }
            }else{
                const nameSplit = value.name.split(" ");
                AsyncStorage.setItem('registerFirstName', nameSplit[0]);
                AsyncStorage.setItem('registerLastName', nameSplit[nameSplit.length -1]);
                AsyncStorage.setItem('regisType', 'facebook');
                AsyncStorage.setItem('registerId', value.id);
                this.props.navigation.navigate('Email')
            }
        })
    }

    signInFacebook(){
        if(Platform.OS === "android"){
            this.androidFBLogin()
        }else{
            let that = this
            this.setState({
                loadingFacebook: true,
                loading: true
            })
            LoginManager.logInWithReadPermissions(['email','public_profile']).then(
                function(result) {
                    if (result.isCancelled) {
                        this.setState({
                            loadingFacebook: false,
                            loading: false
                        })
                    } else {
                        console.log(result)
                        AccessToken.getCurrentAccessToken().then(
                            (data)=>{
                                let token = data.accessToken
                                fetch('https://graph.facebook.com/v2.5/me?fields=name&access_token=' + token, {
                                    method: 'GET',
                                    headers: HEADERPARAM3
                                })
                                .then((response) => {
                                    let responseJson = JSON.parse(response._bodyInit);
                                    that.loginFB(responseJson)
                                })
                            }
                        )
                    }
                },
                function(error) {
                    this.setState({
                        loadingFacebook: false,
                        loading: false
                    })
                }
            );
        }
    }

    signInGoogle(){
        this.setState({
            loadingGoogle: true,
            loading: true
        })
        GoogleSignin.signIn()
        .then((user) => {
            console.log(user)
            let userinfo = GoogleSignin.currentUser();
            let params = {
                google_id: userinfo.id
            }
            console.log(userinfo)
            fetch(`${APIURL3}/socialmedialogin`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: HEADERPARAM3
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.code == "00"){
                    AsyncStorage.setItem('loginType','socialmedia');
                    AsyncStorage.setItem('loginTypeSocial','google');
                    AsyncStorage.setItem('username',responseJson.result.username);
                    if(responseJson.result.profile_picture){
                        AsyncStorage.setItem('profileImage', responseJson.result.profile_picture);
                    }
                    if(responseJson.result.BA){
                        AsyncStorage.setItem('BA', responseJson.result.BA);
                    }
                    if(responseJson.result.coach_challenge_id){
                        AsyncStorage.setItem('challenge', responseJson.result.coach_challenge_id);
                    }
                    if(responseJson.result.first_name){
                        AsyncStorage.setItem('firstName', responseJson.result.first_name);  
                    }
                    if(responseJson.result.birthday){
                        AsyncStorage.setItem('birthday', responseJson.result.birthday);
                    }
                    if(responseJson.result.vision){
                        AsyncStorage.setItem('vision', responseJson.result.vision);
                    }
                    if(responseJson.result.gender){
                        AsyncStorage.setItem('gender', responseJson.result.gender);
                    }
                    AsyncStorage.setItem('lastName', responseJson.result.last_name);
                    AsyncStorage.setItem('email', responseJson.result.email);
                    if(!responseJson.result.coach_challenge_id){
                        this.props.navigation.navigate('AddChallenge')
                    }else{
                        this.props.screenProps.login()
                    }
                }else{
                    const nameSplit = userinfo.name.split(" ");
                    AsyncStorage.setItem('registerFirstName', nameSplit[0]);
                    AsyncStorage.setItem('registerLastName', nameSplit[nameSplit.length -1]);
                    AsyncStorage.setItem('regisType', 'google');
                    AsyncStorage.setItem('registerId', userinfo.id);
                    this.props.navigation.navigate('Email')
                }
            })
        })
        .catch((err) => {
            console.log(err)
                this.setState({
                    loadingGoogle: false,
                    loading: false
                })
        })
        .done();
    }

    normalLogin() {
        this.props.navigation.navigate('NormalLogin')
    }

    render() {
        return(
            <Image source={require('../../assets/gradientBg.png')} style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={styles.loginTop}>
                    <TouchableOpacity 
                        style={styles.loginBtn}
                        onPress={this.normalLogin.bind(this)}
                    >
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    {/*<Text style={{fontSize: 40, color: "white", fontWeight: "bold", fontStyle: "italic"}}>ThomFIT</Text>*/}
                    <Image source={require('../../assets/logos/logo.png')} style={styles.uniLogo}>
                    </Image>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonRow}>
                        {/*{!this.state.loadingFB &&
                        }
                        {this.state.loadingFB &&
                        <View style={{width: window.width*0.7, alignItems: "center", marginTop: 5}}>
                            <ActivityIndicator
                                animating={true}
                                color="white"
                                size="large"
                            />
                        </View>
                        }
                        {!this.state.loading &&
                        }
                        {this.state.loading &&
                        <View style={{width: window.width*0.7, alignItems: "center", marginTop: 5}}>
                            <ActivityIndicator
                                animating={true}
                                color="white"
                                size="large"
                            />
                        </View>
                        }*/}
                        {!this.state.loadingFacebook &&
                        <TouchableOpacity 
                            style={styles.mainBtn}
                            onPress={this.signInFacebook.bind(this)}
                        >
                            <Text style={styles.mainBtnText}>Continue with Facebook</Text>
                        </TouchableOpacity>
                        }
                        {this.state.loading &&
                        <View style={{width: window.width*0.7, alignItems: "center", marginTop: 5}}>
                            <ActivityIndicator
                                animating={true}
                                color="white"
                                size="small"
                            />
                        </View>
                        }
                        {!this.state.loadingGoogle &&
                        <TouchableOpacity
                            style={styles.mainBtn}
                            onPress={this.signInGoogle.bind(this)}
                        >
                            <Text style={styles.mainBtnText}>Continue with Google</Text>
                        </TouchableOpacity>
                        }
                        <TouchableOpacity 
                            style={styles.mainBtn}
                            onPress={()=>this.props.navigation.navigate('Name')}
                        >
                            <Text style={styles.mainBtnText}>Create Account</Text>
                        </TouchableOpacity>
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
    loginTop: {
        alignItems: "flex-end",
        paddingRight: 30,
        paddingTop: 10
    },
        loginBtn: {
            padding: 10,
        },
    loginText: {
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
    buttonRow: {
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
    }
})