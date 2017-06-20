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
import CacheableImage from 'react-native-cacheable-image';

export default class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            firstName: this.props.firstName+'!',
            dailyMsg: "Hello, ",
            imageNeeded: this.props.imageNeeded,
            profileImage: this.props.profileImage,
            progress: window.width,
            completedCount: 0,
            colorBar: '#FF9800',
            dayMsg: "NO PROGRESS YET",
            logMsg: this.props.logMsg,
            loadingImage: false
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.logMsg != this.state.logMsg){
            this.setState({
                logMsg: nextProps.logMsg
            })
        }
        if(this.props.completedCount != nextProps.completedCount ){
            this.setState({
                progress: window.width*(5-nextProps.completedCount)/5,
                completedCount: nextProps.completedCount,
                dayMsg: "GET LOGGING"
            })
            if(nextProps.completedCount == 5){
                this.setState({
                    colorBar: '#8BC34A',
                })
            }
        }
        if(this.props.noLog != nextProps.noLog){
            this.setState({
                dailyMsg: "You can not log future days.",
                firstName: "",
            })
        }
    }

    componentWillMount(){
        this.setState({
            completedCount: this.props.completedCount,
            progress: window.width*(5-this.props.completedCount)/5,
            dayMsg: "GET LOGGING",
            firstName: this.props.firstName+'!'
        })
        if(this.props.completedCount == 5){
            this.setState({
                colorBar: '#8BC34A',
            })
        }
        AsyncStorage.multiGet(['firstName','profileImage'], (err, keys) => {
            if(this.props.noLog){
                this.setState({
                    dailyMsg: "You can not log future days.",
                    firstName: "",
                })
            }else{
                this.setState({
                    dailyMsg: "Hello, ",
                    firstName: this.props.firstName+"!",
                })
            }
        });
    }

    componentDidMount(){
        
    }

    render() {
        return (
            <Image source={require('../../assets/logback.png')} style={styles.progressContainer}>
                <View style={{alignItems: "center", marginTop: 20, zIndex: 1}}>
                    {this.state.imageNeeded &&
                    <View style={{height: 65, width: 65, borderRadius: 200, borderWidth: 3, justifyContent: "center", alignItems: "center", borderColor: "white", backgroundColor: "#CCC"}}>
                        <Icon name="md-person" size={50} color="white" />
                    </View>
                    }
                    {!this.state.imageNeeded &&
                    <View style={{height: 65, width: 65, borderWidth: 3, borderColor: "white", borderRadius: 200, justifyContent: "center", alignItems: "center", backgroundColor: "#CCC"}}>
                        {!this.state.loadingImage &&
                        <Image style={styles.profileImage} source={{uri: BUCKETIMAGES+'/'+this.props.screenProps.profileImage}}/>
                        }
                    </View>
                    }
                    <Text style={{color: "white",backgroundColor: "transparent", fontWeight: "600", fontSize: 18, marginTop: 5}}>{this.state.dailyMsg} {this.props.screenProps.firstName}!</Text>
                    <Text style={{color: "white",backgroundColor: "transparent",}}>{this.state.logMsg}</Text>
                </View>
                <Text style={{fontSize: 12, color: "rgba(255, 255, 255, 0.5)", marginLeft: 20, marginTop: 5,backgroundColor: "transparent"}}>{this.state.dayMsg}</Text>
                <View style={styles.progressOuter}>
                    <View style={[styles.progressInner,{marginRight: this.state.progress, backgroundColor: this.state.colorBar}]}></View>
                </View>
            </Image>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    progressContainer: {
        height: null,
        width: window.width,
    },
    profileImage: {
        width: 62,
        height: 62,
        borderRadius: 30,
    },
    progressOuter: {
        marginLeft: window.width*0.05,
        marginRight: window.width*0.05,
        height: 25,
        backgroundColor: "white",
        marginTop: 5,
        marginBottom: 10,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: "center",
        paddingHorizontal: 2
    },
    progressInner: {
        height: 21,
        borderRadius: 50
    }
});
