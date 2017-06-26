import React, { Component } from 'react';
import {
    StyleSheet, 
    Text, 
    View,
    Dimensions,
    AsyncStorage,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class JoinChallenge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            id: "",
            loading: false,
            error: false,
            error2: false,
            current: null
        };
    }

    componentWillMount(){
        AsyncStorage.getItem('username').then((value)=>{
            this.setState({
                username: value
            })
        })
    }

    join(){
        if(this.state.id){
            this.setState({
                loading: true,
                error: false,
                error2: false
            })
            let params = {
                username: this.state.username,
                share_id: this.state.id
            }
            fetch(`${APIURL3}/joinchallenge`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: HEADERPARAM3
            })
            .then((response) => {
                this.setState({
                    loading: false,
                })
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    AsyncStorage.setItem('challenge', responseJson.userDetails.coachChallengeId);
                    this.props.navigation.goBack();
                }else{
                    this.setState({
                        error2: true
                    })
                }
            })
        }else{
            this.setState({
                error: true
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cancel}>  
                        <TouchableOpacity 
                            style={styles.loginBtn}
                            onPress={()=>this.props.navigation.goBack()}
                        >
                            <Text style={{color: "white"}}>Back</Text>
                        </TouchableOpacity>      
                    </View>
                </View>
                <View style={{alignItems: "center",}}>
                    <Text style={{color: "gray", fontSize: 18}}>Enter a new challenge.</Text>
                </View>
                <View style={{alignItems: 'center',marginTop: 10}}>
                    <View style={{borderBottomColor: "gray", borderBottomWidth: 1}}>
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Share ID"
                        placeholderTextColor="gray"
                        style={styles.inputDetail}
                        onChangeText={(id) => this.setState({id})}
                        value={this.state.id}
                    />
                    </View>
                </View>
                <View style={{alignItems: "center", marginTop: 10}}>
                    {this.state.loading &&
                        <ActivityIndicator
                            color="#FF9800"
                            size="large"
                            animating={true}
                        />
                    }
                    <Text style={{marginBottom: 10}}>Thomas recommends Share ID: w0OQVF</Text>
                    {this.state.error &&
                        <Text style={{color: "red",marginBottom: 10}}>Enter a share ID</Text>
                    }
                    {this.state.error2 &&
                        <Text style={{color: "red",marginBottom: 10}}>Share ID not found</Text>
                    }
                    {!this.state.loading &&
                    <TouchableOpacity onPress={this.join.bind(this)} style={{padding: 20,paddingVertical: 15, backgroundColor: "#FF9800"}}>
                        <Text style={{color:"white"}}>Join Challenge</Text>
                    </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }
}
var window = Dimensions.get('window'); 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
  uniLogo:{
      flex: 0.5,
      alignItems: "center",
      justifyContent: "center"
  },
  headerContainer:{
      flexDirection: "row",
      marginTop: 20
  },
  backContainer: {
      flex: 0.25,
      alignItems: "flex-start",
      padding: 20,
      justifyContent: "center"
  },
    loginBtn: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        paddingTop: 20
    },
    inputText: {
        color: "black",
        marginTop: 10
    },
    inputhead:{
        color: "gray",
    },
    inputDetail: {
        padding: 0,
        borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: "gray",
        color: "gray",
        height: 25,
        width: window.width*0.7
    },
    mainBtn: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "white",
        padding: 15,
        width: window.width * 0.7,
        alignItems: "center",
        backgroundColor:"#1cbcd4"
    },
    mainBtnText: {
        color: "white"
    },
    header: {
        backgroundColor:"#1cbcd4",
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: (Platform.OS === 'ios') ? 60 : 0,
    },
    changePasswordText: {
        fontSize: 17,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
        color:"black"
    },
    cancel: {
        flex: 0.2,
        marginLeft:10,
    },
    headerCancel :{
        marginTop: 20,
        marginBottom: 20
    },
});