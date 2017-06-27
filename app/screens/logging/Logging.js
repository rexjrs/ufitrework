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
Alert,
AsyncStorage,
Image
} from 'react-native';
import moment from 'moment'
import Progress from './Progress'
import FoodCard from './FoodCard'
import CompletedCard from './CompletedCard'
import ProductCard from './ProductCard'
import Week from './Week'
import FourTwelve from './FourTwelve'
import CompletedProduct from './CompletedProduct'
import CompletedFourTwelve from './CompletedFourTwelve'

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
            selectedPost: null,
            products: [],
            originalProduct: this.props.screenProps.products,
            supplements: [],
            fourTwelveEnabled: false,
            activityHappening: false,
            incompleteDays: []
        };
    }

    componentWillMount(){
        let result = this.props.screenProps.fourTwelve
        if(result === "true"){
            result = true
        }else{
            result = false
        }
        this.setState({
            fourTwelveEnabled: result
        })
        this.fetchDay(moment(this.state.today).format())
        this.getProducts()
    }

    componentWillReceiveProps(nextProps){
        this.getProducts(nextProps.screenProps.products,true)
        this.setState({
            fourTwelveEnabled: nextProps.screenProps.fourTwelve,
            incompleteDays: nextProps.screenProps.incompleteDays
        })
    }

    activityHappening(value){
        this.setState({
            activityHappening: value
        })
    }

    updateFourTwelve(value){
        if(value == "1"){
            this.setState({
                fourTwelveTaken: true
            })
        }else{
            this.setState({
                fourTwelveTaken: false
            })
        }
        this.setState({
            fourTwelveLogged: true
        },this.setFourTwelveDayHistory)
    }

    setFourTwelveDayHistory(){
        let tempArray = this.state.dayHistory
        for(var i in tempArray){
            if(tempArray[i].date == this.state.stateDate){
                tempArray[i].fourTwelveLogged = true,
                tempArray[i].fourTwelveTaken = this.state.fourTwelveTaken
            }
        }
    }

    getProducts(value,update){
        let products = this.props.screenProps.products
        if(value){
            products = value
        }
        let tempArray = []
        for(var i in products){
            if(products[i].selected){
                for(var e = 0;e<products[i].dosage;e++){
                    let dosage
                    let outOf
                    if(products[i].dosage>1){
                        dosage = products[i].dosage
                        outOf = e+1
                    }else{
                        dosage = ""
                        outOf = ""
                    }
                    tempArray.push({
                        id: products[i].id,
                        name: products[i].name,
                        outOf: outOf,
                        dosage: dosage,
                        enabled: true
                    })
                }
            }
        }
        if(update){
            this.setState({
                products: tempArray
            },this.setTaken)
        }else{
            this.setState({
                products: tempArray
            })
        }
    }

    setTaken(){
        let supplements = this.state.supplements
        let tempArray = this.state.products
        for(var i in supplements){
            let found = false
            for(var e in tempArray){
                if(tempArray[e].id == supplements[i].id){
                    if(!found){
                        if(tempArray[e].enabled){
                            tempArray[e].enabled = false
                            found = true
                        }
                    }
                }
            }
        }
        this.setState({
            products: tempArray
        })
    }

    getProduct(date){
            this.setState({activityHappening: true})
            fetch(`${APIURL3}/fetchdailyresources3?username=${this.state.username}&date=${date}`, {
                method: 'GET',
                headers: HEADERPARAM3
            })
            .then((response) => {
                this.setState({activityHappening: false})
                let responseJson = JSON.parse(response._bodyInit);
                if(responseJson.status == "ok"){
                    if(responseJson.result.supplements.length>0){
                        this.setState({
                            supplements: [],
                            someData: responseJson
                        },this.setSupplements)
                    }else{
                        this.setState({
                            supplements: []
                        },this.getProductsCallback)
                    }
                }
            })
    }

    getProductsCallback(){
        this.getProducts(this.props.screenProps.products,true)
    }

    setSupplements(){
        let responseJson = this.state.someData
        let supplements = responseJson.result.supplements
        let cardTempArray = this.state.supplements
        let tempArray = this.state.products
        for(var i in supplements){
            cardTempArray.push({
                real_id: supplements[i].id,
                id: supplements[i].product_id,
                name: supplements[i].product_name,
                is_taken: supplements[i].is_taken
            })
        }
        let tempHistory = this.state.dayHistory
        for(var i in tempHistory){
            if(tempHistory[i].date == this.state.stateDate){
                tempHistory[i].supplements = cardTempArray
            }
        }
        this.setState({
            supplements: cardTempArray,
            dayHistory: tempHistory
        },this.getProducts(this.props.screenProps.products,true))
    }

    figureIfIncomplete(){
        let incompleteTemp = this.state.incompleteDays
        if(this.state.completedCount < 5){
            let found = false
            for(var i in incompleteTemp){
                if(incompleteTemp[i] == this.state.stateDate){
                    found = true
                }
            }
            if(!found){
                incompleteTemp.push(this.state.stateDate)
            }
        }else{
            for(var i in incompleteTemp){
                if(incompleteTemp[i] == this.state.stateDate){
                    incompleteTemp.splice(i,1);
                }
            }
        }
        AsyncStorage.setItem('incompleteDays',JSON.stringify(incompleteTemp));
        this.setState({
            incompleteDays: incompleteTemp
        })
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
            supplements: [],
            completedCount: 0,
            stateDate: moment(date).format('YYYY-MM-DD')
        },this.getProducts(this.props.screenProps.products,true))
        let found = false
        if(!force){
            for(var i in this.state.dayHistory){
                if(this.state.dayHistory[i].date === date){
                    found = true
                    let completedCounter = this.state.dayHistory[i].data.length
                    if(this.state.dayHistory[i].fourTwelveLogged){
                        completedCounter = completedCounter+1
                    }
                    this.figureIfIncomplete()
                    this.setState({
                        completedCards: this.state.dayHistory[i].data,
                        presets: this.state.dayHistory[i].presets,
                        supplements: this.state.dayHistory[i].supplements,
                        completedCount: completedCounter,
                        fourTwelveLogged: this.state.dayHistory[i].fourTwelveLogged,
                        fourTwelveTaken: this.state.dayHistory[i].fourTwelveTaken
                    })
                }
            }
        }
        if(!found){
            this.setState({loading: true,activityHappening: true})
            fetch(`${APIURL3}/fetchdailyresources3?username=${this.state.username}&date=${date}`, {
                method: 'GET',
                headers: HEADERPARAM3
            })
            .then((response) => {
                this.setState({loading: false})
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
                            let image
                            if(exercise[i].image){
                                image = exercise[i].image.image_name
                            }else{
                                image = '2017061815314500000719.jpg'
                            }
                            cardTempArray.push({
                                cardType: "Exercise",
                                date: date,
                                description: exercise[i].exercise_desc,
                                image: image,
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
                    if(responseJson.result.supplements.length>0){
                        let supplements = responseJson.result.supplements
                        let cardTempArray = this.state.supplements
                        let tempArray = this.state.products
                        for(var i in supplements){
                            cardTempArray.push({
                                real_id: supplements[i].id,
                                id: supplements[i].product_id,
                                name: supplements[i].product_name,
                                is_taken: supplements[i].is_taken
                            })
                        }
                        this.setState({
                            supplements: cardTempArray
                        },this.setTaken)
                    }
                    if(responseJson.result.four_four_twelve){
                        if(responseJson.result.four_four_twelve == 1){
                            this.setState({
                                fourTwelveTaken: true
                            })
                        }else{
                            this.setState({
                                fourTwelveTaken: false
                            })
                        }
                        this.setState({
                            fourTwelveLogged: true,
                            completedCount: this.state.completedCount+1
                        })
                    }else{
                        this.setState({
                            fourTwelveLogged: false
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
                                presets: this.state.presets,
                                supplements: this.state.supplements,
                                fourTwelveLogged: this.state.fourTwelveLogged,
                                fourTwelveTaken: this.state.fourTwelveTaken
                            })
                        }
                        this.figureIfIncomplete()
                        this.setState({
                            dayHistory: tempArray,
                            activityHappening: false,
                            deletingID: null
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
                'Post',
                'What would you like to do to your post?',
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
        this.setState({visible: false, deletingID: value})
        this.activityHappening(true)
        let param = {
            id: value,
            username: this.state.username
        }
        let params = JSON.stringify(param);
        fetch(`${APIURL3}/deletepost`, {
            method: 'POST',
            body: params,
            headers: HEADERPARAM3
        })
        .then((response) => {
            this.fetchDay(this.state.stateDate,true)
        })
    }

    render() {
        var FoodCards =  this.state.presets.map((b,i) => {
            return (
                b.enabled &&
                <FoodCard navigation={this.props.navigation} screenProps={this.props.screenProps} fetchDay={this.fetchDay.bind(this)} key={i} cardType={b.type} date={b.date} icon={b.icon} stateDate={this.state.stateDate}/>
            )
        });
        var CompletedCards =  this.state.completedCards.map((b,i) => {
            if(this.state.deletingID != b.id){
                return (
                    <CompletedCard key={i} id={b.id} cardType={b.cardType} focusPost={this.focusPost.bind(this)} date={b.date} description={b.description} image={b.image} restDay={b.restDay}/>
                )
            }else{
                return(
                    <ActivityIndicator
                        key={i}
                        size="large"
                        color="#E91E63"
                        animating={true}
                        style={{marginTop: 25,marginBottom: 10}}
                    />
                )
            }
        });
        var ProductCards = this.state.products.map((b,i)=>{
            return(
                b.enabled &&
                <ProductCard key={i} id={b.id} name={b.name} outOf={b.outOf} dosage={b.dosage} screenProps={this.props.screenProps} stateDate={this.state.stateDate} getProduct={this.getProduct.bind(this)} activityHappening={this.activityHappening.bind(this)}/>
            )
        })
        var CompletedProducts = this.state.supplements.map((b,i)=>{
            return(
                <CompletedProduct key={i} name={b.name} is_taken={b.is_taken} real_id={b.real_id} stateDate={this.state.stateDate} getProduct={this.getProduct.bind(this)} activityHappening={this.activityHappening.bind(this)}/>
            )
        })
        return(
            <View style={styles.container}>
                <Week fetchDay={this.fetchDay.bind(this)} activityHappening={this.state.activityHappening} incompleteDays={this.state.incompleteDays}/>
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
                    { ProductCards }
                    {this.state.fourTwelveEnabled &&
                        !this.state.fourTwelveLogged &&
                        <FourTwelve username={this.state.username} stateDate={this.state.stateDate} updateFourTwelve={this.updateFourTwelve.bind(this)} activityHappening={this.activityHappening.bind(this)}/>
                    }
                    <View style={styles.completed}>
                        <Text style={styles.completedText}>Completed Activities</Text>
                    </View>
                    { CompletedProducts }
                    {this.state.fourTwelveLogged &&
                    <CompletedFourTwelve is_taken={this.state.fourTwelveTaken}/>
                    }
                    { CompletedCards }
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={[styles.bottomButtons, {marginLeft: 10}]}
                            onPress={()=>this.props.navigation.navigate('AddPost',{ cardType: 'Exercise', icon: 'exercise', date: this.state.stateDate, action: 'add', screenProps: this.props.screenProps, fetchDay: this.fetchDay.bind(this)})}
                        >
                            <Image source={require('../../assets/icons/exercise.png')} style={{width: 30, height: 30}} />
                            <Text style={{fontSize: 13, fontWeight: "400", color: "gray"}}>Add Exercise</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.bottomButtons, {marginHorizontal: 10}]}>
                            <Image source={require('../../assets/icons/snack.png')} style={{width: 30, height: 30}} />
                            <Text style={{fontSize: 13, fontWeight: "400", color: "gray"}}>Add Snack</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.bottomButtons, {marginRight: 10}]}>
                            <Image source={require('../../assets/icons/supplements.png')} style={{width: 30, height: 30}} />
                            <Text style={{fontSize: 13, fontWeight: "400", color: "gray"}}>Add Supplement</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomPadding}></View>
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
    bottomContainer: {
        flexDirection: "row",
        marginTop: 20
    },
    bottomButtons: {
        flex: 1/3,
        alignItems: "center",
        height: 80,
        backgroundColor: "white",
        borderWidth: 0.2,
        borderColor: "#CCC",
        justifyContent: "center"
    },
})