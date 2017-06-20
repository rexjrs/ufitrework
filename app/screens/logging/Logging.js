import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
Dimensions,
ScrollView,
ActivityIndicator,
Modal,
TouchableOpacity,
Platform,
Alert
} from 'react-native';
import moment from 'moment'
import Progress from './Progress'
import FoodCard from './FoodCard'
import CompletedCard from './CompletedCard'
import Week from './Week'

var GlobalToday = new Date();

export default class Logging extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            presets: [
                {type: "Breakfast",icon: "breakfast",enabled: true},
                {type: "Lunch",icon: "lunch", enabled: true},
                {type: "Dinner",icon: "dinner", enabled: true},
                {type: "Exercise",icon: "exercise", enabled: true},
            ],
            completedCards: [],
            username: this.props.screenProps.username,
            today: new Date(),
            completedCount: 0,
            dayHistory: [],
            loading: true,
            stateDate: new Date(),
            visible: false,
            selectedPost: null
        };
    }

    componentWillMount(){
        this.fetchDay(moment(this.state.today).format())
    }

    fetchDay(date,force){
        date = moment(date).format('YYYY-MM-DD')
        this.setState({
            presets: [
                {type: "Breakfast",icon: "breakfast",enabled: true},
                {type: "Lunch",icon: "lunch", enabled: true},
                {type: "Dinner",icon: "dinner", enabled: true},
                {type: "Exercise",icon: "exercise", enabled: true},
            ],
            completedCards: [],
            completedCount: 0,
            stateDate: moment(date).format('YYYY-MM-DD')
        })
        let found = false
        if(!force){
            for(var i in this.state.dayHistory){
                if(this.state.dayHistory[i].date === date){
                    found = true
                    this.setState({
                        completedCards: this.state.dayHistory[i].data,
                        presets: this.state.dayHistory[i].presets,
                        completedCount: this.state.dayHistory[i].data.length
                    })
                }
            }
        }
        if(!found){
            this.setState({loading: true})
            fetch(`${APIURL3}/fetchdailyresources3?username=${this.state.username}&date=${date}`, {
                method: 'GET',
                headers: HEADERPARAM3
            })
            .then((response) => {
                this.setState({loading: false})
                let responseJson = JSON.parse(response._bodyInit);
                console.log(responseJson)
                if(responseJson.status == "ok"){
                    if(responseJson.result.breakfast){
                        let tempArray = this.state.presets
                        tempArray[0].enabled = false
                        let cardTempArray = this.state.completedCards
                        let image = responseJson.result.breakfast.photos[0]
                        if(!responseJson.result.breakfast.photos[0]){
                            image = '2017061815314500000719.jpg'
                        }
                        cardTempArray.push({
                            cardType: "Breakfast",
                            date: date,
                            description: responseJson.result.breakfast.description,
                            image: image,
                            id: responseJson.result.breakfast.meal_id
                        })
                        this.setState({
                            presets: tempArray,
                            completedCards: cardTempArray,
                            completedCount: this.state.completedCount+1
                        })
                    }
                    if(responseJson.result.lunch){
                        let tempArray = this.state.presets
                        tempArray[1].enabled = false
                        let cardTempArray = this.state.completedCards
                        let image = responseJson.result.lunch.photos[0]
                        if(!responseJson.result.lunch.photos[0]){
                            image = '2017061815314500000719.jpg'
                        }
                        cardTempArray.push({
                            cardType: "Lunch",
                            date: date,
                            description: responseJson.result.lunch.description,
                            image: image,
                            id: responseJson.result.lunch.meal_id
                        })
                        this.setState({
                            presets: tempArray,
                            completedCards: cardTempArray,
                            completedCount: this.state.completedCount+1
                        })
                    }
                    if(responseJson.result.dinner){
                        let tempArray = this.state.presets
                        tempArray[2].enabled = false
                        let cardTempArray = this.state.completedCards
                        let image = responseJson.result.dinner.photos[0]
                        if(!responseJson.result.dinner.photos[0]){
                            image = '2017061815314500000719.jpg'
                        }
                        cardTempArray.push({
                            cardType: "Dinner",
                            date: date,
                            description: responseJson.result.dinner.description,
                            image: image,
                            id: responseJson.result.dinner.meal_id
                        })
                        this.setState({
                            presets: tempArray,
                            completedCards: cardTempArray,
                            completedCount: this.state.completedCount+1
                        })
                    }
                    if(responseJson.result.exercises.length>0){
                        let exercise = responseJson.result.exercises
                        let cardTempArray = this.state.completedCards
                        for(var i in exercise){
                            cardTempArray.push({
                                cardType: "Exercise",
                                date: date,
                                description: exercise[i].exercise_desc,
                                image: exercise[i].image.image_name,
                                restDay: exercise[i].rest_day,
                                id: exercise[i].exercise_id
                            })
                        }
                        let tempArray = this.state.presets
                        tempArray[3].enabled = false
                        this.setState({
                            presets: tempArray,
                            completedCards: cardTempArray,
                            completedCount: this.state.completedCount+1
                        })
                    }
                    setTimeout(() => {
                        let tempArray = this.state.dayHistory
                        let found = false
                        for(var i in tempArray){
                            if(tempArray[i].date === date){
                                if(force){
                                    tempArray.splice(i,1)
                                    found = false
                                }else{
                                    found = true
                                }
                            }
                        }
                        if(!found){
                            tempArray.push({
                                date: date,
                                data: this.state.completedCards,
                                presets: this.state.presets
                            })
                        }
                        this.setState({
                            dayHistory: tempArray
                        })
                    },50)
                }
            })
        }
    }

    focusPost(value){
        this.setState({
            selectedPost: value,
        })
        if(Platform.OS === "ios"){
            this.setState({
                visible: true
            })
        }else{
            Alert.alert(
                'Delete',
                'Are you sure you want to delete supplement?',
                [
                    {text: 'Cancel', onPress: () => console.log('cancel')},
                    {text: 'Edit', onPress: () => this.editPost(this.state.selectedPost)},
                    {text: 'Delete', onPress: () => this.deletePost(this.state.selectedPost)},
                ]
            )
        }
    }

    editPost(value){
        this.setState({visible: false})
        for(var i in this.state.completedCards){
            if(this.state.completedCards[i].id == value){
                let image  = this.state.completedCards[i].image
                if(image == "2017061815314500000719.jpg"){
                    image = null
                }
                this.props.navigation.navigate('AddPost',{ 
                    cardType: this.state.completedCards[i].cardType, 
                    icon: this.state.completedCards[i].cardType.toLowerCase(), 
                    date: this.state.stateDate, 
                    id: this.state.completedCards[i].id,
                    desc: this.state.completedCards[i].description,
                    image: image,
                    restDay: this.state.completedCards[i].restDay,
                    action: 'edit', 
                    screenProps: this.props.screenProps, 
                    fetchDay: this.fetchDay.bind(this)
                })
            }
        }
    }

    deletePost(value){
        console.log(value)
    }

    render() {
        var FoodCards =  this.state.presets.map((b,i) => {
            return (
                b.enabled &&
                <FoodCard navigation={this.props.navigation} screenProps={this.props.screenProps} fetchDay={this.fetchDay.bind(this)} key={i} cardType={b.type} date={b.date} icon={b.icon} stateDate={this.state.stateDate}/>
            )
        });
        var CompletedCards =  this.state.completedCards.map((b,i) => {
            return (
                <CompletedCard key={i} id={b.id} cardType={b.cardType} focusPost={this.focusPost.bind(this)} date={b.date} description={b.description} image={b.image}/>
            )
        });
        return(
            <View style={styles.container}>
                <Week fetchDay={this.fetchDay.bind(this)}/>
                <ScrollView>
                    <Progress screenProps={this.props.screenProps} completedCount={this.state.completedCount}/>
                    {this.state.loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator
                            animating={true}
                            color="#E91E63"
                            size="small"
                        />
                        <Text style={{color: "#E91E63",marginLeft: 5,marginTop: 2}}>Fetching stuff</Text>
                    </View>
                    }
                    { FoodCards }
                    <View style={styles.completed}>
                        <Text style={styles.completedText}>Completed Activities</Text>
                    </View>
                    { CompletedCards }
                    <View style={styles.bottomPadding}></View>
                </ScrollView>
                <Modal
                    animationType={"slide"}
                    visible={this.state.visible}
                    style={styles.modal}
                    transparent={true}
                >
                    <TouchableOpacity style={styles.modalTop} onPress={()=>this.setState({visible: false})}>
                    </TouchableOpacity>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={()=>this.editPost(this.state.selectedPost)} style={[styles.button,{borderBottomWidth: 1, borderColor: "#CCC", borderTopLeftRadius: 10, borderTopRightRadius: 10}]}>
                            <Text style={styles.buttonText}>Edit Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.deletePost(this.state.selectedPost)} style={[styles.button,{borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                            <Text style={styles.buttonText}>Delete Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({visible: false})} style={[styles.button,{marginTop: 10,borderRadius: 10}]}>
                            <Text style={[styles.buttonText,{fontWeight: "bold"}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    loading: {
        alignItems: "flex-start",
        paddingHorizontal: 10,
        paddingTop: 10,
        flexDirection: "row",
    },
    completed: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    bottomPadding: {
        marginTop: 20
    },
    modalTop: {
        height: window.height*0.7
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
})