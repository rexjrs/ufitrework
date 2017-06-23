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

export default class Email extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            errorField: false,
            loading: false,
            emailTaken: false,
            emailInvalid: false
        };
    }
    nextPage() {
        this.setState({
            errorField: false,
            emailTaken: false,
            emailInvalid: false
        })
        if(this.state.email == "" || this.state.email == null){
            this.setState({
                errorField: true
            })
        }
        else if(!this.validateEmail(this.state.email)){
            this.setState({
                emailInvalid: true
            }) 
        }
        else{
            this.setState({
                loading: true
            })
            fetch(`${APIURL}/checkemail?email=${this.state.email}`, {
                method: 'GET',
                headers: HEADERPARAM
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    this.setState({
                        loading: false
                    })
                    AsyncStorage.setItem('registerEmail', this.state.email);
                    this.props.navigation.navigate('Username')
                }else{
                    this.setState({
                        emailTaken: true,
                        loading: false
                    })
                }
            })
        }
    }

    getData() {
        AsyncStorage.multiGet(['registerEmail'], (err, keys) => {
            this.setState({
                email: keys[0][1],
            })
        });
    }

    componentWillMount() {
        this.getData();
    }

     validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
     };
    
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
                    {/*<Image source={require('../../../assets/logo/logoColor.png')} style={styles.uniLogo}>
                    </Image>*/}
                </View>
                <View style={styles.titleArea}> 
                    <Text style={{fontWeight: "600",color: "black"}}>Create Email</Text>
                </View>
                <View style={styles.formArea}>
                        <Text style={styles.inputText}>EMAIL ADDRESS</Text>
                        <View style={{borderBottomColor: "gray", borderBottomWidth: 1}}>
                        <TextInput 
                            style={styles.inputDetail}
                            value={this.state.email}
                            returnKeyType="next"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            onChangeText={(email) => this.setState({email})}
                        />
                        </View>
                        {this.state.emailInvalid &&
                            <Text style={{color: "red", fontSize: 14}}>Email is invalid</Text>
                        }
                        {this.state.errorField &&
                            <Text style={{color: "red", fontSize: 14}}>Email cannot be empty</Text>
                        }
                        {this.state.emailTaken &&
                            <Text style={{color: "red", fontSize: 14}}>This email has been taken</Text>
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
        flex: 0.1,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    formArea: {
        flex: 0.65,
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
