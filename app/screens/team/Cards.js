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
    Platform,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CacheableImage from 'react-native-cacheable-image';

export default class Cards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            comment: ""
        };
    }

    componentWillMount(){

    }

    addComment(){
        this.props.addComment(this.state.data.id,this.state.comment)
        this.setState({
            comment: ""
        })
    }

    render() {
        let tempWidth = window.width / 2.13
        if(this.state.data.data.length == 1){
            tempWidth = window.width*0.970
        }
        var Images =  this.state.data.data.map((b,i) => {
            let source = { uri: BUCKETIMAGES+'/'+b.image_filename}
            if(this.state.data.type == "Exercise"){
                source = {uri: BUCKETEXERCISEIMAGES+"/"+b.image_filename}
            }
            return (
                <TouchableOpacity key={i} style={styles.cardImage} onPress={()=>this.props.setImage(BUCKETIMAGES+'/'+b.image_filename)}>
                    {b.profile_picture &&
                    <View style={{zIndex: 4, width:31,height:31,borderWidth:1,borderColor:"#ccc",borderRadius:20, position: "absolute", right: -6, top: -6}}>
                        <CacheableImage style={{width:30,height:30,borderWidth:3,borderColor:"white",borderRadius:15,position: "absolute", right: 0, top: 0}} source={{uri: BUCKETIMAGES+'/'+b.profile_picture}}/>
                    </View>
                    }
                    <Image source={source} style={{height: 150, width: tempWidth}}/>
                </TouchableOpacity>
            )
        });
        var Comments =  this.state.data.comments.map((b,i) => {
            return (
                <Text key={i} style={{color: "#666666", fontSize: 14, paddingLeft: window.width*0.01}}><Text style={{fontWeight: "bold"}}>{b.username}</Text> {b.comment}</Text>
            )
        });
        return (
            <View style={styles.statusContainer}>
                    <View style={[styles.statusHeader,{height: 50, alignItems: "center"}]}>
                    <View style={{flex:0.85}}>
                            <View style={{flexDirection: "row"}}> 
                                <Text style={{color: "#666666", fontWeight: "bold", fontSize: 18, paddingLeft: 20}}>Team {this.state.data.type}</Text>
                            </View>
                            <Text style={{color: "grey", fontSize: 15, paddingLeft: 20, paddingRight: 20}}>{this.state.data.date}</Text>
                    </View>
                    <View style={{flex:0.15,height: 20, justifyContent: "center",width: 30}}>
                            <Icon name="ios-more" type="ionicon" size={40} color="#a9a9a9" />
                    </View>
                </View>
                <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                { Images }
                </View>
                <View style={{zIndex: 10}}>
                { Comments }
                </View>
                <View style={[styles.commentHeader,{height: 30,flex:0.8, zIndex: 5}]}>
                    <View style={{height: 30, width: 40}}>
                            <Icon name="ios-chatboxes-outline" type="ionicon" size={30} color="grey" />
                    </View>
                    <View style={{flex:0.9}}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Say something..."
                                placeholderTextColor="gray"
                                underlineColorAndroid="transparent"
                                multiline={true}
                                blurOnSubmit={true}
                                value={this.state.comment}
                                onChangeText={(comment)=>this.setState({comment})}
                            />
                    </View>
                    <View style={{justifyContent: "center", marginRight: 20}}>
                        <TouchableOpacity style={{paddingLeft: 10}} onPress={this.addComment.bind(this)}>
                            <Icon name="md-send" type="ionicon" size={25} color="#CCC" />
                        </TouchableOpacity>
                    </View>
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
    keyboardInput:{
        position: "absolute",
        backgroundColor: "white",
        width: window.width,
        height: 40,
        shadowColor: 'gray',
        shadowOffset: {
            width: 2,
            height: 1
        },
        shadowRadius: 4,
        shadowOpacity: 0.3
    },
    statusBar:{
        height: 20,
        backgroundColor: "#1CBCD4"
    },
    profilePic: {
        width:60,
        height:60,
        borderWidth:3,
        borderColor:"transparent",
        borderRadius:100
    },
    statusHeader: {
        marginTop: 15,
        flexDirection: "row",
        marginBottom: 15,
        paddingLeft: 15
    },
    statusContainer:{
        marginBottom: window.width*0.03,
        backgroundColor: "white",
        borderWidth: 0.3,
        borderColor: "#CCC",
        overflow: "hidden"
    },
    statusInput: {
        fontSize: 15,
        padding: 4,
        paddingLeft: 20,
        paddingRight: 20,
        height: 60,
    },
    messageHeader: {
        flexDirection: "row",
        height: 45,
        marginLeft :20,
        marginRight :20,
        marginBottom: 10,
        marginTop: 10,
        flex:0.9,
    },
    photoContainer:{
        flexDirection: "row",
        marginLeft :10,
        marginRight :10,
        marginBottom: 10,
        marginTop: 10,
        flex:0.9,
    },
    commentHeader: {
        marginTop: 5,
        flexDirection: "row",
        marginBottom: 20,
        paddingLeft: 15
    },
    commentInput: {
        fontSize: 14,
        padding: 4,
        paddingLeft: 20,
        paddingRight: 20,
        height: 30,
    },
    cardImage:{
        height: 150,
        margin: 5,
    }
});