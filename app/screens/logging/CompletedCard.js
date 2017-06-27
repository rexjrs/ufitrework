import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import CacheableImage from 'react-native-cacheable-image';

export default class FoodCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        };
    }

    componentWillMount(){

    }

    render() {
        let imageURI = BUCKETIMAGES
        if(this.props.cardType === "Exercise"){
            imageURI = BUCKETEXERCISEIMAGES
            if(this.props.image == '2017061815314500000719.jpg'){
                imageURI = BUCKETIMAGES
            }
        }
        return (
            <View style={styles.container}>
                <View style={styles.cell}>
                    <View style={styles.header}>
                        <View style={{flex: 0.5, flexDirection: "row",alignItems: "center"}}>
                            {this.props.cardType === "Breakfast" &&
                            <Image source={require('../../assets/icons/breakfast.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.props.cardType === "Lunch" &&
                            <Image source={require('../../assets/icons/lunch.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.props.cardType === "Dinner" &&
                            <Image source={require('../../assets/icons/dinner.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.props.cardType === "Exercise" &&
                            <Image source={require('../../assets/icons/exercise.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.props.cardType === "Snack" &&
                            <Image source={require('../../assets/icons/snack.png')} style={{width: 30, height: 30}}/>
                            }
                            <Text style={styles.icon}>{this.props.cardType}</Text>
                        </View>
                        <View style={{flex: 0.5, alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={()=>this.props.focusPost(this.props.id)} style={{paddingHorizontal: 10,paddingTop: 10}}>
                             <Icon name="ios-more" type="ionicon" size={35} color="#CCC"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        {this.props.description !== "" && this.props.restDay != 1 &&
                        <Text style={styles.desc}>{this.props.description}</Text>
                        }
                        {this.props.restDay != 1 &&
                        <CacheableImage source={{ uri: imageURI+'/'+this.props.image}} style={styles.image}/>
                        }
                    </View>
                    {this.props.cardType === "Exercise" && this.props.restDay == 1 &&
                    <View style={styles.restDay}>
                        <Text>Today is a rest day</Text>
                    </View>
                    }
                </View>
            </View>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        marginTop: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: window.width*0.9,
        height: 170
    },
    restDay: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
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
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: (Platform.OS === 'ios') ? 0 : 0.2,
        borderColor: "#CCC",
        backgroundColor: "white"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    icon: {
        marginLeft: 15
    },
    desc: {
        marginBottom: 10
    }
});
