import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import SupplementSelector from './SupplementSelector'

export default class FoodCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            imageSource: null,
            imageDisplay: null,
            visible: false,
            desc: "",
            cardType: this.props.navigation.state.params.cardType,
            icon: this.props.navigation.state.params.icon,
            date: this.props.navigation.state.params.date,
            username: this.props.navigation.state.params.screenProps.username,
            coachChallengeId: this.props.navigation.state.params.screenProps.challengeID,
            loadingMessage: 'Logging meal',
            loading: false,
            action: this.props.navigation.state.params.action,
            error: "",
            isSelected: false,
            postid: this.props.navigation.state.params.id,
            hasProduct: false
        };
    }

    componentWillMount(){
        this.initialEditState()
    }

    initialEditState(){
        if(this.props.navigation.state.params.action === "edit"){
            let imageURI = BUCKETIMAGES
            if(this.state.cardType === "Exercise"){
                imageURI = BUCKETEXERCISEIMAGES
            }
            this.setState({
                desc: this.props.navigation.state.params.desc,
            })
            if(this.props.navigation.state.params.image){
                this.setState({
                    imageDisplay: {uri: imageURI+'/'+this.props.navigation.state.params.image}
                })
            }
        }
    }

    back(){
        this.props.navigation.goBack()
    }

    hasProduct(value){
        this.setState({
            hasProduct: value
        })
    }

    openGallery(){
        ImagePicker.openPicker({
            compressImageMaxHeight: 1000,
            compressImageMaxWidth: 2000,
            includeBase64: true
        }).then(image => {
            this.setState({
                imageSource: image.data,
                imageDisplay: {uri: image.path},
                visible: false
            })
        })
        .catch(e => {
            this.setState({visible: false})
        });
    }

    openCamera(){
        ImagePicker.openCamera({
            compressImageMaxHeight: 1000,
            compressImageMaxWidth: 2000,
            includeBase64: true
        }).then(image => {
            this.setState({
                imageSource: image.data,
                imageDisplay: {uri: image.path},
                visible: false
            })
        })
        .catch(e => {
            this.setState({visible: false})
        });
    }

    callback(){
        this.props.navigation.state.params.fetchDay(moment(this.state.date).format(),true)
        this.props.navigation.goBack()
    }

    figureOut(){
        if(this.state.action === "add"){
            this.addPost()
        }else{
            this.updatePost()
        }
    }

    verifyFields(){
        let count = 0
        if(this.state.imageSource){
            count = count+1
        }
        if(this.state.desc !== ""){
            count = count+1
        }
        if(this.state.isSelected){
            count = count+1
        }
        if(count > 0){
            this.figureOut()
            this.setState({error: ''})
        }else{
            if(this.props.navigation.state.params.action === "edit"){
                if(this.state.imageDisplay){
                    this.figureOut()
                    this.setState({error: ''})
                }else{
                this.setState({
                    error: 'Please attach either a description or an image',
                })
                }
            }else{
                this.setState({
                    error: 'Please attach either a description or an image',
                })
            }
        }
    }

    addPost(){
        this.setState({loadingMessage: 'Creating post...', loading: true})
        let params = {
            username: this.state.username,
            coachChallengeId: this.state.coachChallengeId,
            description: this.state.desc,
            type: this.state.cardType.toLowerCase(),
            dateofpost: this.state.date
        }
        if(this.state.cardType === "Exercise"){
            params['restDay'] = (this.state.isSelected?1:0).toString()
        }
        fetch(`${APIURL3}/addpost`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: HEADERPARAM3
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            if(responseJson.status == "ok"){
                let id = responseJson.post.id;
                if(this.state.imageSource){
                    this.uploadImage(id);
                }else{
                    if(this.state.hasProduct){
                        this.setState({
                            finishedPost: Math.random()
                        })
                    }else{
                        this.callback()
                    }
                }
            }
        })
    }

    updatePost(){
        this.setState({loadingMessage: 'Updating post...', loading: true})
        let params = {
            username: this.state.username,
            description: this.state.desc,
            postid: this.state.postid.toString(),
            photos_to_remove: []
        }
        if(this.state.cardType === "Exercise"){
            params['restDay'] = (this.state.isSelected?1:0).toString()
        }
        fetch(`${APIURL3}/updatepost`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: HEADERPARAM3
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            if(responseJson.status == "ok"){
                let id = responseJson.post.id;
                if(this.state.imageSource){
                    this.uploadImage(this.state.postid.toString());
                }else{
                    if(this.state.hasProduct){
                        this.setState({
                            finishedPost: Math.random()
                        })
                    }else{
                        this.callback()
                    }
                }
            }
        })
    }

    uploadImage(id){
        if(this.state.isSelected){
            this.callback()
        }else{
            this.setState({loadingMessage: 'Uploading image...', loading: true})
            let params = {
                username: this.state.username,
                imageType: 'Images',
                postid: id.toString(),
                image: this.state.imageSource
            }
            if(this.state.cardType === "Exercise"){
                params['imageType'] = 'Exercise'
            }
            fetch(`${APIURL3}/uploadimage`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: HEADERPARAM3
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    console.log(responseJson)
                    if(this.state.hasProduct){
                        this.setState({
                            finishedPost: Math.random()
                        })
                    }else{
                        this.callback()
                    }
                }
            })
        }
    }

    openMenu(){
        if(Platform.OS === "ios"){
            this.setState({visible: true})
        }else{
            Alert.alert(
                'Image',
                'Please select an image',
                [
                    {text: 'Cancel', onPress: () => console.log('cancel')},
                    {text: 'Gallery', onPress: () => this.openGallery()},
                    {text: 'Camera', onPress: () => this.openCamera()},
                ]
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerCells}>
                        <TouchableOpacity onPress={this.back.bind(this)} style={styles.buttons}>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.headerCells,{alignItems: "flex-end"}]}>
                        {!this.state.loading &&
                        <TouchableOpacity onPress={this.verifyFields.bind(this)} style={styles.buttons}>
                            <Icon name="ios-checkmark-circle" type="ionicon" size={30} color="white" />
                        </TouchableOpacity>
                        }
                        {this.state.loading &&
                        <View style={[styles.buttons,{flexDirection: "row"}]}>
                            <Text style={{color: "white", marginRight: 10}}>{this.state.loadingMessage}</Text>
                            <ActivityIndicator
                                color="white"
                                size="small"
                            />
                        </View>
                        }
                    </View>
                </View>
                <ScrollView style={styles.scrollview}>
                    <View style={[styles.cell,{marginBottom: 20}]}>
                        <View style={styles.headerBox}>
                            {this.state.icon === "breakfast" &&
                            <Image source={require('../../assets/icons/breakfast.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.state.icon === "lunch" &&
                            <Image source={require('../../assets/icons/lunch.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.state.icon === "dinner" &&
                            <Image source={require('../../assets/icons/dinner.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.state.icon === "exercise" &&
                            <Image source={require('../../assets/icons/exercise.png')} style={{width: 30, height: 30}}/>
                            }
                            {this.state.icon === "snack" &&
                            <Image source={require('../../assets/icons/snack.png')} style={{width: 30, height: 30}}/>
                            }
                            <Text style={styles.icon}>{this.state.cardType}</Text>
                        </View>
                        {this.state.cardType === "Exercise" &&
                        <View style={styles.exerciseCheck}>
                            <TouchableOpacity onPress={()=>this.setState({isSelected: !this.state.isSelected})} style={styles.exerciseCheckBox}>
                                {this.state.isSelected &&
                                <Icon name="ios-checkmark" type="ionicon" size={30} style={{backgroundColor: "transparent"}} color="#1CBCD4"/>
                                }
                            </TouchableOpacity>
                        </View>
                        }
                        {this.state.imageDisplay &&
                            <Image source={this.state.imageDisplay} style={styles.image}/>
                        }
                        {!this.state.imageDisplay &&
                        <TouchableOpacity onPress={()=>this.openMenu()} style={[styles.image,{justifyContent: "center",alignItems: "center",backgroundColor: "#F8F8F8",borderWidth: 1,borderColor: "#CCC"}]}>
                            <Icon name="ios-camera" type="ionicon" size={30} color="#CCC" />
                        </TouchableOpacity>
                        }
                        <View style={styles.inputDesc}>
                            <TextInput 
                                placeholder="What did you eat?"
                                placeholderTextColor="gray"
                                style={styles.input}
                                multiline={true}
                                value={this.state.desc}
                                onChangeText={(value)=>this.setState({desc: value})}
                            />
                        </View>
                        {this.state.error !== "" &&
                        <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </View>
                    <SupplementSelector finishedPost={this.state.finishedPost} hasProduct={this.hasProduct.bind(this)} screenProps={this.props.navigation.state.params.screenProps} stateDate={this.state.date} navigation={ this.props.navigation} fetchDay={this.props.navigation.state.params.fetchDay}/>
                </ScrollView>
                <Modal
                    animationType={"slide"}
                    visible={this.state.visible}
                    style={styles.modal}
                    transparent={true}
                    onRequestClose={()=>this.setState({visible: false})}
                >
                    <TouchableOpacity style={styles.modalTop} onPress={()=>this.setState({visible: false})}>

                    </TouchableOpacity>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={this.openCamera.bind(this)}  style={[styles.button,{borderBottomWidth: 1, borderColor: "#CCC", borderTopLeftRadius: 10, borderTopRightRadius: 10}]}>
                            <Text style={styles.buttonText}>Open Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.openGallery.bind(this)} style={[styles.button,{borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                            <Text style={styles.buttonText}>Open Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({visible: false})} style={[styles.button,{marginTop: 10,borderRadius: 10}]}>
                            <Text style={[styles.buttonText,{fontWeight: "bold"}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2"
    },
    exerciseCheck: {
        alignItems: "flex-end",
        marginBottom: 10
    },
    exerciseCheckBox: {
        height: 30,
        width: 30,
        borderWidth: 1,
        borderColor: "#CCC",
        alignItems: "center",
        justifyContent: "center",
    },
    error: {
        color: 'red',
        marginVertical: 10
    },
    input:{
        marginVertical: 4,
        fontSize: 15
    },
    inputDesc: {
        marginTop: 25,
        borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderBottomColor: "#CCC"
    },
    modalTop: {
        height: window.height*0.7,
    },
    button:{
        height: 60,
        marginHorizontal: 15,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#2874f1"
    },
    modalContainer: {
        paddingTop: 10,
        height: window.height*0.3,
        width: window.width,   
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    scrollview: {
        paddingHorizontal: 10
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#1CBCD4",
        height: (Platform.OS === 'ios') ? 65 : 55,
        alignItems: "center"
    },
    headerCells:{
        flex: 0.5
    },
    buttons: {
        padding: 20,
        paddingTop: (Platform.OS === 'ios') ? 35 : 20,
    },
    backText: {
        color: "white",
        fontWeight: "bold"
    },
    image: {
        width: window.width*0.85,
        height: 170
    },
    cell: {
        backgroundColor: "white",
        marginTop: 7,
        shadowColor: 'gray',
        shadowOffset: {
        width: 2,
        height: 1
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        width: window.width * 0.95,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    headerBox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    icon: {
        marginLeft: 15,
        color: "gray",
        fontSize: 17
    },
    desc: {
        marginBottom: 10
    }
});
