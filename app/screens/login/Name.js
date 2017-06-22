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
  Platform,
  ScrollView
} from 'react-native';

export default class Name extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            firstname: '',
            lastname: '',
            errorField: false,
        };
    }

    nextPage() {
        console.log(this.state.firstname);
        this.setState({
            errorField: false
        })
        if(this.state.firstname == null || this.state.lastname == null || this.state.firstname == "" || this.state.lastname == ""){
            this.setState({
                errorField: true
            })
        }else{
            AsyncStorage.setItem('registerFirstName', this.state.firstname);
            AsyncStorage.setItem('registerLastName', this.state.lastname);
            AsyncStorage.setItem('regisType', 'normal');
            this.props.navigation.navigate('User')
        }
    }

    getData() {
        AsyncStorage.multiGet(['registerFirstName','registerLastName'], (err, keys) => {
            this.setState({
                firstname: keys[0][1],
                lastname: keys[1][1]
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
                    <Text style={{fontWeight: "600",color: "black"}}>What's your name?</Text>
                    <Text style={{fontSize: 14, marginTop: 10}}>Your name is only visible to you</Text>
                </View>
                <View style={styles.formArea}>
                        <Text style={styles.inputText}>FIRST NAME</Text>
                        <View style={{borderBottomColor: "gray", borderBottomWidth: 1}}>
                        <TextInput 
                            value={this.state.firstname}
                            style={styles.inputDetail}
                            onSubmitEditing={()=> this.lastName.focus()}
                            returnKeyType="next"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            onChangeText={(firstname) => this.setState({firstname})}
                        />
                        </View>
                        <Text style={styles.inputText}>LAST NAME</Text>
                        <View style={{borderBottomColor: "gray", borderBottomWidth: 1}}>
                        <TextInput 
                            value={this.state.lastname}
                            style={styles.inputDetail}
                            ref={(input) => this.lastName = input}
                            returnKeyType="next"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            onChangeText={(lastname) => this.setState({lastname})}
                            onSubmitEditing={this.nextPage.bind(this)}
                        />
                        </View>
                        {this.state.errorField &&
                            <Text style={{color: "red", fontSize: 14}}>Firstname or lastname cannot be empty</Text>
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
        padding: 20,
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
