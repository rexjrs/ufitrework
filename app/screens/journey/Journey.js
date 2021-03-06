import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
Dimensions,
Platform,
TextInput
} from 'react-native';

export default class Journey extends Component {
    render() {
        return(
            <View style={styles.container}>
                {Platform.OS === "ios" &&
                <View style={styles.statusBar}></View>
                }
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
    statusBar:{
        height: 20,
        backgroundColor: "#1CBCD4"
    },
})