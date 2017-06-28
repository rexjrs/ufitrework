import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import CacheableImage from 'react-native-cacheable-image';

export default class FoodCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            comments: [],
            fetchedComments: false,
            commentInput: ""
        };
    }

    componentWillMount(){
        this.getComment()
    }

    getComment(){
        fetch(`${APIURL3}/fetchcomments?postid=${this.props.id}`, {
            method: 'GET',
            headers: HEADERPARAM3
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            let commentsArray = [];
            for(var i in responseJson.result){
                commentsArray.push({
                    username: responseJson.result[i].username,
                    comment: responseJson.result[i].commentString
                })
            }
            this.setState({
                comments: commentsArray,
                fetchedComments: true
            })
        })
    }

    addComment(){
        if(this.state.commentInput == ""){

        }else{
            let param = {
                username: this.props.username,
                postid: this.props.id,
                comment: this.state.commentInput
            }
            let params = JSON.stringify(param)
            fetch(`${APIURL3}/addcomment`, {
                method: 'POST',
                body: params,
                headers: HEADERPARAM3
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
            })
            let commentArray = this.state.comments;
            commentArray.push({
                username: this.props.username,
                comment: this.state.commentInput
            })
            this.setState({
                comments: commentArray,
                commentInput: ""
            })
        }
    }

    render() {
        let imageURI = BUCKETIMAGES
        if(this.props.cardType === "Exercise"){
            imageURI = BUCKETEXERCISEIMAGES
            if(this.props.image == '2017061815314500000719.jpg'){
                imageURI = BUCKETIMAGES
            }
        }
        var Comments = this.state.comments.map((b,i) => {
            return (
                <View key={i} style={styles.commentArea}>
                    <Text style={{fontSize: 15, fontWeight: "bold", color: "#666666"}}>{b.username} </Text><Text style={{fontSize: 13,marginTop: 2}}>{b.comment}</Text>
                </View>
            )
        })
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
                        {this.props.cardType === "Exercise" && this.props.restDay == 1 &&
                        <View style={styles.restDay}>
                            <Text>Today is a rest day</Text>
                        </View>
                        }
                        {!this.state.fetchedComments &&
                        <View style={{alignItems: "flex-start", marginVertical: 5}}>
                            <ActivityIndicator
                                size="small"
                                color="#1CBCD4"
                                animating={true}
                            />
                        </View>
                        }
                        {this.state.fetchedComments &&
                            Comments 
                        }
                        <View style={{flexDirection: "row", alignItems: "center", paddingLeft: 20, paddingRight: 20, marginTop: 10}}>
                             <Icon name="ios-chatboxes-outline" size={30} color="#CCC" />
                            <TextInput 
                                style={styles.commentInput}
                                placeholder="Say something..."
                                placeholderTextColor="gray"
                                underlineColorAndroid="transparent"
                                multiline={true}
                                value={this.state.commentInput}
                                onChangeText={(commentInput) => this.setState({commentInput})}
                            />
                            <TouchableOpacity onPress={this.addComment.bind(this)}>
                                <Icon name="md-send" size={25} color="#CCC" />
                            </TouchableOpacity>
                        </View>
                    </View>
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
    commentArea:{
        marginTop: 5,
        flexDirection: "row",
        width: window.width*0.95,
    },
    commentInput:{
        flex: 0.7,
        paddingLeft: 20,
        fontSize: 13
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
