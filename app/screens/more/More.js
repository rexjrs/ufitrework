import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
Dimensions,
TouchableOpacity,
StatusBar,
AsyncStorage,
Platform,
Switch
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';

export default class More extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            fourTwelve: false
        }
    }

    componentWillMount(){
        let result = this.props.screenProps.fourTwelve;
        if(result === "true"){
            result = true
        }else{
            result = false
        }
        this.setState({
            fourTwelve: result
        })
    }

    logout(){
        AsyncStorage.removeItem('loginType');
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('BA');
        AsyncStorage.removeItem('challenge');
        AsyncStorage.removeItem('firstName');
        AsyncStorage.removeItem('lastName');
        AsyncStorage.removeItem('email');
        AsyncStorage.removeItem('birthday');
        AsyncStorage.removeItem('vision');
        AsyncStorage.removeItem('gender');
        AsyncStorage.removeItem('profileImage');
        AsyncStorage.removeItem('selectedProducts');
        AsyncStorage.removeItem('fourTwelve');
        setTimeout(() => {
            GoogleSignin.signOut()
            .then(() => {

            })
            .catch((err) => {

            });
            this.props.screenProps.logout()
        }, 1000)
    }

    setFourTwelve(value){
        this.setState({
            fourTwelve: value
        })
        this.props.screenProps.setFourTwelve(value)
        AsyncStorage.setItem('fourTwelve', value.toString());
    }
    
    render() {
        return(
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={styles.navBar}>
                    <Text style={styles.navBarText}>Settings</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Profile</Text>
                </View>
                {/*<TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Add Coach & Friends</Text>
                </TouchableOpacity>*/}
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('Product',{products: this.props.screenProps.products, screenProps: this.props.screenProps})} style={styles.cellContainer}>
                    <Text style={styles.cellText}>Edit Goals</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('JoinChallenge')} style={styles.cellContainer}>
                    <Text style={styles.cellText}>Join Challenges</Text>
                </TouchableOpacity>
                <View style={[styles.cellContainer, {flexDirection: "row",justifyContent: "flex-start",alignItems: "center"}]}>
                    <View style={{flex: 0.5}}>
                        <Text style={styles.cellText}>4-4-12 goal:</Text>
                    </View>
                    <View style={{flex: 0.5, alignItems: "flex-end"}}>
                        <Switch
                            value={this.state.fourTwelve}
                            onValueChange={(value)=>this.setFourTwelve(value)}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.cellContainer} onPress={this.logout.bind(this)}>
                    <Text style={styles.cellText}>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    navBar: {
        height: (Platform.OS === 'ios') ? 60 : 50,
        backgroundColor: "#1CBCD4",
        alignItems: "center",
        paddingTop: (Platform.OS === 'ios') ? 30 : 15,
        marginBottom: 20
    },
    navBarText: {
        color: "white"
    },  
    header: {
        paddingHorizontal: 30,
        marginBottom: 20
    },
    headerText: {
        fontSize: 18
    },
    cellContainer: {
        width: window.width,
        height: 50,
        justifyContent: "center",
        paddingHorizontal: 30
    },
    cellText: {
        fontSize: 14
    }
})