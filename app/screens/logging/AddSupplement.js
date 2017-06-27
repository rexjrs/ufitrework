import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import SupplementSelector from './SupplementSelector';

export default class AddSupplement extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            clicked: Math.random()
        };
    }

    componentWillMount(){

    }

    back(){
        this.props.navigation.goBack()
    }

    submit(){
        this.setState({
            clicked: Math.random(),
            loading: true
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerCells}>
                        <TouchableOpacity onPress={this.back.bind(this)} style={styles.buttons}>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.headerCells,{alignItems: "flex-end"}]}>
                        {!this.state.loading &&
                        <TouchableOpacity onPress={this.submit.bind(this)} style={styles.buttons}>
                            <Icon name="ios-checkmark-circle" type="ionicon" size={30} color="white" />
                        </TouchableOpacity>
                        }
                        {this.state.loading &&
                        <View style={[styles.buttons,{flexDirection: "row"}]}>
                            <Text style={{color: "white", marginRight: 10}}>{this.state.loadingMessage}</Text>
                            <ActivityIndicator
                                color="white"
                                size="small"
                            />
                        </View>
                        }
                    </View>
                </View>
                <ScrollView style={styles.scrollview}>
                    <SupplementSelector clicked={this.state.clicked} screenProps={this.props.navigation.state.params.screenProps} getProduct={this.props.navigation.state.params.getProduct} stateDate={this.props.navigation.state.params.stateDate} navigation={ this.props.navigation}/>
                </ScrollView>
            </View>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2"
    },
    exerciseCheck: {
        alignItems: "flex-end",
        marginBottom: 10
    },
    exerciseCheckBox: {
        height: 30,
        width: 30,
        borderWidth: 1,
        borderColor: "#CCC",
        alignItems: "center",
        justifyContent: "center",
    },
    error: {
        color: 'red',
        marginVertical: 10
    },
    input:{
        marginVertical: 4,
        fontSize: 15
    },
    inputDesc: {
        marginTop: 25,
        borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderBottomColor: "#CCC"
    },
    modalTop: {
        height: window.height*0.7,
    },
    button:{
        height: 60,
        marginHorizontal: 15,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#2874f1"
    },
    modalContainer: {
        paddingTop: 10,
        height: window.height*0.3,
        width: window.width,   
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    scrollview: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#1CBCD4",
        height: (Platform.OS === 'ios') ? 65 : 55,
        alignItems: "center"
    },
    headerCells:{
        flex: 0.5
    },
    buttons: {
        padding: 20,
        paddingTop: (Platform.OS === 'ios') ? 35 : 20,
    },
    backText: {
        color: "white",
        fontWeight: "bold"
    },
    image: {
        width: window.width*0.85,
        height: 170
    },
    cell: {
        backgroundColor: "white",
        marginTop: 7,
        shadowColor: 'gray',
        shadowOffset: {
        width: 2,
        height: 1
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        width: window.width * 0.95,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    headerBox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    icon: {
        marginLeft: 15,
        color: "gray",
        fontSize: 17
    },
    desc: {
        marginBottom: 10
    }
});
