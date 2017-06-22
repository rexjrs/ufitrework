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
    StatusBar
} from 'react-native';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
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
                        <TouchableOpacity 
                            style={styles.mainBtn}
                        >
                            <Text style={styles.mainBtnText}>Continue with Facebook</Text>
                        </TouchableOpacity>
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
                        <TouchableOpacity
                            style={styles.mainBtn}
                        >
                            <Text style={styles.mainBtnText}>Continue with Google</Text>
                        </TouchableOpacity>
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