import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput
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
        }
        return (
            <View style={styles.container}>
                <View style={styles.cell}>
                    <View style={styles.header}>
                        {this.props.cardType === "Breakfast" &&
                        <Image source={require('../../assets/icons/breakfast.png')} style={{width: 30, height: 30}}/>
                        }
                        {this.props.cardType === "Lunch" &&
                        <Image source={require('../../assets/icons/lunch.png')} style={{width: 30, height: 30}}/>
                        }
                        {this.props.cardType === "Dinner" &&
                        <Image source={require('../../assets/icons/dinner.png')} style={{width: 30, height: 30}}/>
                        }
                        {this.state.cardType === "Exercise" &&
                        <Image source={require('../../assets/icons/exercise.png')} style={{width: 30, height: 30}}/>
                        }
                        <Text style={styles.icon}>{this.props.cardType}</Text>
                    </View>
                    {this.props.cardType !== "Exercise" &&
                    <View>
                        <Text style={styles.desc}>{this.props.description}</Text>
                        <CacheableImage source={{ uri: imageURI+'/'+this.props.image}} style={styles.image}/>
                    </View>
                    }
                    {this.props.cardType === "Exercise" &&
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
        alignItems: "center"
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
        paddingVertical: 10
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
