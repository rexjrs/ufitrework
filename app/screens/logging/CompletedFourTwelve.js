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
  ActivityIndicator,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

export default class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: false
        };
    }

    componentWillMount(){

    }

    componentDidMount(){

    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback>
                    <View style={styles.cellContainer}>
                        <View style={styles.headerCell}>
                            <View style={{flex: 0.5,marginTop: 25}}>
                                <Text style={styles.headerText}>4-4-12</Text>
                            </View>
                            {!this.state.loading &&
                            <TouchableOpacity style={styles.headerIcon}>
                                {this.props.is_taken < 1 &&
                                <Icon name="ios-close-circle" type="ionicon" size={35} color="#E91E63" />
                                }
                                {this.props.is_taken > 0 &&
                                <Icon name="ios-close-circle" type="ionicon" size={35} color="#CCC" />
                                }
                            </TouchableOpacity>
                            }
                            {!this.state.loading &&
                            <TouchableOpacity style={styles.headerIcon}>
                                {this.props.is_taken > 0 &&
                                <Icon name="ios-checkmark-circle" type="ionicon" size={35} color="#8BC34A" />
                                }
                                {this.props.is_taken < 1 &&
                                <Icon name="ios-checkmark-circle" type="ionicon" size={35} color="#CCC" />
                                }
                            </TouchableOpacity>
                            }
                            {this.state.loading &&
                            <View style={[styles.headerIcon,{marginTop: 25}]}>
                                <ActivityIndicator
                                    size="small"
                                    color="#E91E63"
                                    animating={true}
                                />
                            </View>
                            }
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
    headerIcon: {
        marginTop: 18,
        paddingHorizontal: 10
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
        shadowOpacity: 0.3,
        borderWidth: (Platform.OS === 'ios') ? 0 : 0.2,
        borderColor: "#CCC"
    },
    headerCell: {
        flexDirection: "row",
        paddingRight: 10
    },
    headerText: {
        marginLeft: 20,
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
