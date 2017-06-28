import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
ListView,
Dimensions,
TouchableOpacity,
Image,
TextInput,
ActivityIndicator,
Platform,
RefreshControl
} from 'react-native';
import { Icon } from 'react-native-elements'
import moment from 'moment';
import CacheableImage from 'react-native-cacheable-image';
import Cards from './Cards'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
export default class Team extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            dataSourceClean: [],
            loading: true,
            refreshing: false,
            keyHeight: null,
            keyHidden: true
        };
    }

    componentWillMount(){
        this.setState({
            username: this.props.screenProps.username
        },this.getFeed)
    }


    _onRefresh(){
        this.setState({refreshing: true,loading: true});
        this.getFeed()
        this.setState({refreshing: false});
    }

    addComment(id,comment){
        if(comment == ""){

        }else{
            let param = {
                username: this.state.username,
                postid: id,
                comment: comment
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
            let tempArray = this.state.dataSourceClean
            let arrayPos = null
            for(var i in tempArray){
                if(tempArray[i].id == id){
                    arrayPos = i
                }
            }
            let commentArray = tempArray[arrayPos].comments
            commentArray.push({
                username: this.state.username,
                comment: comment
            })
            tempArray[arrayPos].comments = commentArray
            this.setState({
                dataSource: ds.cloneWithRows(tempArray),
                dataSourceClean: tempArray,
            })
        }
    }

    getComment(value){
        fetch(`${APIURL3}/fetchcomments?postid=${value}`, {
            method: 'GET',
            headers: HEADERPARAM3
        })
        .then((response) => {
            let commentArray=[];
            let responseJson = JSON.parse(response._bodyInit);
            for(var i in responseJson.result){
                commentArray.push({
                    username: responseJson.result[i].username,
                    comment: responseJson.result[i].commentString
                })
            }
            let tempArray = this.state.dataSourceClean
            for(var i in tempArray){
                if(tempArray[i].id == value){
                    tempArray[i].comments = commentArray
                }
            }
            this.setState({
                dataSource: ds.cloneWithRows(tempArray),
                dataSourceClean: tempArray,
            })
        })
    }

    getFeed(){
        this.setState({
            dataSourceClean: []
        })
        fetch(`${APIURL3}/fetchfeeds?username=${this.state.username}`, {
                method: 'GET',
                headers: HEADERPARAM3
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            if (responseJson.status == "ok") {
                for (var i in responseJson.result) {
                    if (responseJson.result[i].breakfast) {
                        let tempArray = this.state.dataSourceClean
                        let tempDate = moment(responseJson.result[i].date).format('DD MMMM YYYY')
                        tempArray.push({
                            date: tempDate,
                            type: "Breakfast",
                            data: responseJson.result[i].breakfast,
                            id: responseJson.result[i].id,
                            comments: []
                        })
                        this.setState({
                            dataSource: ds.cloneWithRows(tempArray),
                            dataSourceClean: tempArray,
                        })
                        this.getComment(responseJson.result[i].id)
                    }
                    if (responseJson.result[i].lunch) {
                        let tempArray = this.state.dataSourceClean
                        let tempDate = moment(responseJson.result[i].date).format('DD MMMM YYYY')
                        tempArray.push({
                            date: tempDate,
                            type: "Lunch",
                            data: responseJson.result[i].lunch,
                            id: responseJson.result[i].id,
                            comments: []
                        })
                        this.setState({
                            dataSource: ds.cloneWithRows(tempArray),
                            dataSourceClean: tempArray,
                        })
                        this.getComment(responseJson.result[i].id)
                    }
                    if (responseJson.result[i].dinner) {
                        let tempArray = this.state.dataSourceClean
                        let tempDate = moment(responseJson.result[i].date).format('DD MMMM YYYY')
                        tempArray.push({
                            date: tempDate,
                            type: "Dinner",
                            data: responseJson.result[i].dinner,
                            id: responseJson.result[i].id,
                            comments: []
                        })
                        this.setState({
                            dataSource: ds.cloneWithRows(tempArray),
                            dataSourceClean: tempArray,
                        })
                        this.getComment(responseJson.result[i].id)
                    }
                    if(i == responseJson.result.length-1){
                        this.setState({
                            loading: false,
                            refreshing: false
                        })
                    }
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    _renderRow(value){
        return(
            <Cards key={value.id} setImage={this.props.screenProps.setImage} data={value} addComment={this.addComment.bind(this)}/>
        )
    }

    render() {
        console.log(this.props.screenProps)
        return(
            <View style={styles.container}>
                {Platform.OS === "ios" &&
                <View style={styles.statusBar}></View>
                }
                <View style={styles.topPosting}>
                    <View style={{alignItems: "center",justifyContent: "center"}}>
                        <Image style={{height: 50, width: 50, borderRadius: 25, marginLeft: 10}} source={{uri: BUCKETIMAGES+'/'+this.props.screenProps.profileImage}}/>
                    </View>
                    <View>
                        <TextInput
                            placeholder="What are you up to?"
                            placeholderTextColor="gray"
                            style={{marginLeft: 10, height: 40, width: window.width*0.6, marginTop: 15, fontSize: 14}}
                        />
                    </View>
                    <View style={{flex: 0.2, alignItems: 'flex-end', justifyContent: 'center', marginRight: 20}}>
                        <Icon name="ios-attach-outline" size={40} color="gray" type="ionicon" />
                    </View>
                </View>
                {this.state.loading &&
                <ActivityIndicator
                    animating={true}
                    color="#E91E63"
                    size="large"
                    style={{marginTop: 80}}
                />
                }
                {!this.state.loading &&
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    dataSource = {this.state.dataSource}
                    renderRow  = {this._renderRow.bind(this)}
                    initialListSize={10}
                    enableEmptySections={true}
                />}
            </View>
        )
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topPosting:{
    backgroundColor: "white",
    height: 70,
    marginBottom: 15,
    shadowColor: 'gray',
    shadowOffset: {
    width: 2,
    height: 1
    },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    flexDirection: "row"
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