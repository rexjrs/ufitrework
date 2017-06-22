import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  ActivityIndicator,
  TextInput,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: "",
            loading: false,
            error: false,
            error2: false
        }
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
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    AsyncStorage.setItem('challenge', responseJson.userDetails.coachChallengeId);
                    this.props.screenProps.login()
                }else{
                    this.setState({
                        error2: true,
                        loading: false
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
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.backContainer}>
                        {/*<Icon name="ios-arrow-back" size={25} color="#FF9800" />*/}
                    </View>
                    {/*<View style={styles.uniLogo}>
                        <Image source={require('../../../assets/logo/logoColor.png')}/>
                    </View>*/}
                    <View style={styles.backContainer}>

                    </View>
                </View>
                <View style={{alignItems: "center",}}>
                    <Text style={{color: "gray", fontSize: 20}}>Enter a challenge.</Text>
                </View>
                <View style={{alignItems: 'center',marginTop: 10}}>
                    <View style={{borderBottomColor: "gray", borderBottomWidth: 1}}>
                    <TextInput
                        underlineColorAndroid="gray"
                        placeholder="Share ID"
                        placeholderTextColor="gray"
                        underlineColorAndroid="transparent"
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
                <View style={{alignItems: "center", marginTop: 20}}> 
                    <Text>Thomas recommends Share ID: w0OQVF</Text>
                </View>
            </ScrollView>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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
    inputDetail: {
        padding: 0,
        borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: "gray",
        color: "gray",
        height: 25,
        width: window.width*0.7
    },
});
