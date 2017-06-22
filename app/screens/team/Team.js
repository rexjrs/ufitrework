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

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
export default class Team extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            dataSourceClean: [],
            loading: true,
            refreshing: false
        };
    }

    componentWillMount(){
        this.setState({
            username: this.props.screenProps.username
        },this.getFeed)
    }

    _onRefresh(){
        this.setState({refreshing: true, loading: true});
        this.getFeed()
        this.setState({refreshing: false});
    }

    getFeed(){
        this.setState({ dataSource: ds.cloneWithRows([]), dataSourceClean: [], loadingData: true }) //reset datastore
        fetch(`${APIURL3}/fetchfeeds?username=${this.state.username}`, {
                method: 'GET',
                headers: HEADERPARAM3
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            responseJson.result = responseJson.result.reverse()
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
                            ['comment'+responseJson.result[i].id]: ''
                        })
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
                            ['comment'+responseJson.result[i].id]: ''
                        })
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
                            ['comment'+responseJson.result[i].id]: ''
                        })
                    }
                    if(i == responseJson.result.length-1){
                        this.setState({
                            loading: false
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
        let tempWidth = window.width / 2.13
        if(value.data.length == 1){
            tempWidth = window.width*0.970
        }
        var Images =  value.data.map((b,i) => {
            let source = { uri: BUCKETIMAGES+'/'+b.image_filename}
            return (
                <TouchableOpacity key={i} style={styles.cardImage}>
                    {b.profile_picture &&
                    <View style={{zIndex: 4, width:31,height:31,borderWidth:1,borderColor:"#ccc",borderRadius:20, position: "absolute", right: -6, top: -6}}>
                        <CacheableImage style={{width:30,height:30,borderWidth:3,borderColor:"white",borderRadius:15,position: "absolute", right: 0, top: 0}} source={{uri: BUCKETIMAGES+'/'+b.profile_picture}}/>
                    </View>
                    }
                    <CacheableImage source={source} style={{height: 150, width: tempWidth}}/>
                </TouchableOpacity>
            )
        });
        return(
                <View key={value.id} style={styles.statusContainer}>
                     <View style={[styles.statusHeader,{height: 50, alignItems: "center"}]}>
                        <View style={{flex:0.85}}>
                                <View style={{flexDirection: "row"}}> 
                                    <Text style={{color: "#666666", fontWeight: "bold", fontSize: 18, paddingLeft: 20}}>Team {value.type}</Text>
                                </View>
                                <Text style={{color: "grey", fontSize: 15, paddingLeft: 20, paddingRight: 20}}>{value.date}</Text>
                        </View>
                        <View style={{flex:0.15,height: 20, justifyContent: "center",width: 30}}>
                                <Icon name="ios-more" type="ionicon" size={40} color="#a9a9a9" />
                        </View>
                    </View>
                    <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                        { Images }
                    </View>
                    <View style={{zIndex: 10}}>

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
                                    value={this.state['comment'+value.id]}
                                    onChangeText={(commentInput) => {this.setState({["comment"+value.id]: commentInput})}}
                                />
                        </View>
                        <View style={{justifyContent: "center", marginRight: 20}}>
                            <TouchableOpacity onPress={() => {this.setState({commentID: value.id}, this.addComment)}}>
                                <Icon name="md-send" type="ionicon" size={25} color="#CCC" />
                            </TouchableOpacity>
                        </View>
                    </View>    
                </View>
        )
    }

    render() {
        return(
            <View style={styles.container}>
                {Platform.OS === "ios" &&
                <View style={styles.statusBar}></View>
                }
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