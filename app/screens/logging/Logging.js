import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
Dimensions,
ScrollView
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
            stateDate: new Date()
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
            loading: true,
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
                        loading: false,
                        completedCount: this.state.dayHistory[i].data.length
                    })
                }
            }
        }
        if(!found){
            fetch(`${APIURL3}/fetchdailyresources3?username=${this.state.username}&date=${date}`, {
                method: 'GET',
                headers: HEADERPARAM3
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
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
                            image: image
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
                            image: image
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
                            image: image
                        })
                        this.setState({
                            presets: tempArray,
                            completedCards: cardTempArray,
                            completedCount: this.state.completedCount+1
                        })
                    }
                    if(responseJson.result.exercises.length>0){
                        let exercise = responseJson.result.exercises
                        console.log(exercise)
                        let cardTempArray = this.state.completedCards
                        for(var i in exercise){
                            cardTempArray.push({
                                cardType: "Exercise",
                                date: date,
                                description: exercise[i].exercise_desc,
                                image: exercise[i].image.image_name,
                                restDay: exercise[i].rest_day
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
                        this.setState({
                            loading: false
                        })
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

    render() {
        var FoodCards =  this.state.presets.map((b,i) => {
            return (
                b.enabled &&
                <FoodCard navigation={this.props.navigation} screenProps={this.props.screenProps} fetchDay={this.fetchDay.bind(this)} key={i} cardType={b.type} date={b.date} icon={b.icon} stateDate={this.state.stateDate}/>
            )
        });
        var CompletedCards =  this.state.completedCards.map((b,i) => {
            return (
                <CompletedCard key={i} cardType={b.cardType} date={b.date} description={b.description} image={b.image}/>
            )
        });
        return(
            <View style={styles.container}>
                <Week fetchDay={this.fetchDay.bind(this)}/>
                <ScrollView>
                    <Progress screenProps={this.props.screenProps} completedCount={this.state.completedCount}/>
                    { FoodCards }
                    <View style={styles.completed}>
                        <Text style={styles.completedText}>Completed Activities</Text>
                    </View>
                    {!this.state.loading &&
                        CompletedCards 
                    }
                    <View style={styles.bottomPadding}></View>
                </ScrollView>
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
    completed: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    bottomPadding: {
        marginTop: 20
    }
})