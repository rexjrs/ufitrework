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
  ScrollView,
  AsyncStorage,
  TouchableWithoutFeedback,
  ListView,
  Modal,
  LayoutAnimation,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

export default class FoodCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cardType: this.props.cardType,
            icon: this.props.icon,
        };
    }

    componentWillMount(){

    }

    componentDidMount(){

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('AddPost',{ cardType: this.props.cardType, icon: this.props.icon, date: this.props.stateDate, action: 'add', screenProps: this.props.screenProps, fetchDay: this.props.fetchDay})} style={styles.cell}>
                    <View style={styles.cellContainer}>
                        <View style={styles.headerCell}>
                            {this.state.icon === "breakfast" &&
                            <View style={styles.foodIcon}><Image source={require('../../assets/icons/breakfast.png')} style={{width: 30, height: 30}}/></View>
                            }
                            {this.state.icon === "lunch" &&
                            <View style={styles.foodIcon}><Image source={require('../../assets/icons/lunch.png')} style={{width: 30, height: 30}}/></View>
                            }
                            {this.state.icon === "dinner" &&
                            <View style={styles.foodIcon}><Image source={require('../../assets/icons/dinner.png')} style={{width: 30, height: 30}}/></View>
                            }
                            {this.state.icon === "exercise" &&
                            <View style={styles.foodIcon}><Image source={require('../../assets/icons/exercise.png')} style={{width: 30, height: 30}}/></View>
                            }
                            <Text style={styles.headerText}>{this.state.cardType}</Text>
                            <View style={styles.cameraIcon}><Icon name="ios-camera" size={35} color="#808184" /></View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7
    },
    cell: {
        minHeight: 80,
        alignItems: "center"
    },
    cellContainer: {
        width: window.width * 0.95,
        backgroundColor: "white",
        minHeight: 70,
        shadowColor: 'gray',
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.3
    },
    headerCell: {
        flexDirection: "row",
    },
    headerText: {
        flex: 0.5,
        marginLeft: 20,
        marginTop: 28,
        fontWeight: "400",
        fontSize: 15
    },
    cameraIcon: {
        flex: 0.5,
        marginTop: 20,
        marginRight: 15,
        alignItems: "flex-end"
    },
    foodIcon:{
        marginTop: 22,
        marginLeft: 20,
    },
});
