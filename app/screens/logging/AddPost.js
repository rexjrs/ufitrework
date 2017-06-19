import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

export default class FoodCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            imageSource: null
        };
    }

    componentWillMount(){
        
    }

    back(){
        this.props.navigation.goBack()
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
                        <TouchableOpacity style={styles.buttons}>
                        <Icon name="ios-checkmark-circle" type="ionicon" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={styles.scrollview}>
                    <View style={styles.cell}>
                        <View style={styles.headerBox}>
                            <Icon name="ios-beer-outline" size={30} color="#808184" />
                            <Text style={styles.icon}>Lunch</Text>
                        </View>
                        {this.state.imageSource &&
                            <Image style={styles.image}/>
                        }
                    </View>
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
    scrollview: {
        paddingHorizontal: 10
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#1CBCD4",
        height: 65,
        alignItems: "center"
    },
    headerCells:{
        flex: 0.5
    },
    buttons: {
        padding: 20,
        paddingTop: 25
    },
    backText: {
        color: "white",
        fontWeight: "bold"
    },
    image: {
        width: window.width*0.9,
        height: 170
    },
    cell: {
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
