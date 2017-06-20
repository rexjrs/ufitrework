import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
Dimensions,
TouchableOpacity,
StatusBar,
AsyncStorage
} from 'react-native';

export default class More extends Component {
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

        this.props.screenProps.logout()
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
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Add Coach & Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Edit Goals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cellContainer}>
                    <Text style={styles.cellText}>Join Challenges</Text>
                </TouchableOpacity>
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
        height: 60,
        backgroundColor: "#1CBCD4",
        alignItems: "center",
        paddingTop: 30,
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