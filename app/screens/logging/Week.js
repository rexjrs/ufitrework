import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  PanResponder,
  Platform
} from 'react-native';
import moment from 'moment';

export default class FoodCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            incompleteDays: this.props.incompleteDays
        };
    }

    componentWillMount(){
        let date = new Date()
        this.getDays(date)
        this.selectedDay(moment(date).format('ddd'),date)

        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 5;
            },
            onPanResponderGrant: (evt, gestureState) => {
                let posStart = evt.nativeEvent.pageX;
                pStart = posStart;
            },
            onPanResponderMove: (evt) => {
                let posMove = evt.nativeEvent.pageX;
            },
            onPanResponderRelease: (evt, gestureState) => {
                let posEnd = evt.nativeEvent.pageX;
                pEnd = posEnd;
                if(gestureState.dx > 0 && gestureState.dx < 50){
                }else if(gestureState.dx > -50 && gestureState.dx < 0){
                }else{
                    if(pStart < pEnd){
                    this.changeWeek(false)
                }else if(pStart > pEnd){
                    this.changeWeek(true)
                }  
            }
        }
        });
    }

    componentWillReceiveProps(nextProps){
        if(this.state.incompleteDays != nextProps.incompleteDays){
            this.setState({
                incompleteDays: nextProps.incompleteDays
            },this.getIndicator)
        }
        this.getIndicator()
    }

    getIndicator(){
        let mondayFound = false
        let tuesdayFound = false
        let wednesdayFound = false
        let thursdayFound = false
        let fridayFound = false
        let saturdayFound = false
        let sundayFound = false
        let incompleteDays = this.state.incompleteDays
        for(var i in incompleteDays){
            if(incompleteDays[i] == moment(this.state.mondayReal).format('YYYY-MM-DD')){
                mondayFound = true
            }   
            if(incompleteDays[i] == moment(this.state.tuesdayReal).format('YYYY-MM-DD')){
                tuesdayFound = true    
            }
            if(incompleteDays[i] == moment(this.state.wednesdayReal).format('YYYY-MM-DD')){
                wednesdayFound = true
            }
            if(incompleteDays[i] == moment(this.state.thursdayReal).format('YYYY-MM-DD')){
                thursdayFound = true
            }
            if(incompleteDays[i] == moment(this.state.fridayReal).format('YYYY-MM-DD')){
                fridayFound = true
            }
            if(incompleteDays[i] == moment(this.state.saturdayReal).format('YYYY-MM-DD')){
                saturdayFound = true
            }
            if(incompleteDays[i] == moment(this.state.sundayReal).format('YYYY-MM-DD')){
                sundayFound = true
            }
        }
        this.setState({
            mondayFound: mondayFound,
            tuesdayFound: tuesdayFound,
            wednesdayFound: wednesdayFound,
            thursdayFound: thursdayFound,
            fridayFound: fridayFound,
            saturdayFound: saturdayFound,
            sundayFound: sundayFound
        })
    }

    changeWeek(period){
        let week;
        this.setState({
            MonColorTop: "white",TueColorTop: "white",WedColorTop: "white",ThuColorTop: "white",FriColorTop: "white",SatColorTop: "white",SunColorTop: "white",
            MonColor: "white",TueColor: "white",WedColor: "white",ThuColor: "white",FriColor: "white",SatColor: "white",SunColor: "white",
            MonCircleColor: "transparent",TueCircleColor: "transparent",WedCircleColor: "transparent",ThuCircleColor: "transparent",FriCircleColor: "transparent",SatCircleColor: "transparent",SunCircleColor: "transparent",
        })
        if(period){
            week = moment(this.state.currentWeek).add('1','week')
            this.getDays(week)
        }else{
            week = moment(this.state.currentWeek).subtract('1','week')    
            this.getDays(week)
        }
        if(moment(week).startOf('isoweek').format('YYYY-MM-DD') == moment(this.state.realSelectedDay).startOf('isoweek').format('YYYY-MM-DD')){
            let day = moment(this.state.realSelectedDay).format('ddd')
            this.setState({
                [day+'Color']: "#1CBCD4",
                [day+'CircleColor']: "white"
            })
        }
    }

    selectedDay(value,real){
        let monday = moment(real).startOf('isoweek')
        if(moment(monday) > moment()){
            this.setState({MonColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({MonColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({MonColor: 'white'})
            this.setState({MonColorTop: 'white'})
        }
        if(moment(monday).add(1,'days') > moment()){
            this.setState({TueColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({TueColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({TueColor: 'white'})
            this.setState({TueColorTop: 'white'})
        }
        if(moment(monday).add(2,'days') > moment()){
            this.setState({WedColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({WedColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({WedColor: 'white'})
            this.setState({WedColorTop: 'white'})
        }
        if(moment(monday).add(3,'days') > moment()){
            this.setState({ThuColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({ThuColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({ThuColor: 'white'})
            this.setState({ThuColorTop: 'white'})
        }
        if(moment(monday).add(4,'days') > moment()){
            this.setState({FriColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({FriColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({FriColor: 'white'})
            this.setState({FriColorTop: 'white'})
        }
        if(moment(monday).add(5,'days') > moment()){
            this.setState({SatColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({SatColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({SatColor: 'white'})
            this.setState({SatColorTop: 'white'})
        }
        if(moment(monday).add(6,'days') > moment()){
            this.setState({SunColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({SunColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({SunColor: 'white'})
            this.setState({SunColorTop: 'white'})
        }
        this.setState({
            selectedDay: value,
            realSelectedDay: real,
            MonCircleColor: "transparent",TueCircleColor: "transparent",WedCircleColor: "transparent",ThuCircleColor: "transparent",FriCircleColor: "transparent",SatCircleColor: "transparent",SunCircleColor: "transparent",
            [value+'Color']: "#1CBCD4",
            [value+'CircleColor']: "white"
        })
    }

    getDays(value){
        let monday = moment().startOf('isoweek')
        if(value){
            monday = moment(value).startOf('isoweek')
            this.setState({
                currentWeek: moment(value).startOf('isoweek'),
                monday: moment(value).startOf('isoweek').format('ddd'), mondayDD: moment(value).startOf('isoweek').format('DD'), mondayReal: moment(value).startOf('isoweek')
            })
        }else{
            this.setState({
                currentWeek: moment().startOf('isoweek'),
                monday: moment().startOf('isoweek').format('ddd'), mondayDD: moment().startOf('isoweek').format('DD'), mondayReal: moment().startOf('isoweek')
            })
        }
        this.setState({
            tuesday: moment(monday).add(1,'days').format('ddd'), tuesdayDD: moment(monday).add(1,'days').format('DD'), tuesdayReal: moment(monday).add(1,'days'),
            wednesday: moment(monday).add(2,'days').format('ddd'), wednesdayDD: moment(monday).add(2,'days').format('DD'), wednesdayReal: moment(monday).add(2,'days'),
            thursday: moment(monday).add(3,'days').format('ddd'), thursdayDD: moment(monday).add(3,'days').format('DD'), thursdayReal: moment(monday).add(3,'days'),
            friday: moment(monday).add(4,'days').format('ddd'), fridayDD: moment(monday).add(4,'days').format('DD'), fridayReal: moment(monday).add(4,'days'),
            saturday: moment(monday).add(5,'days').format('ddd'), saturdayDD: moment(monday).add(5,'days').format('DD'), saturdayReal: moment(monday).add(5,'days'),
            sunday: moment(monday).add(6,'days').format('ddd'), sundayDD: moment(monday).add(6,'days').format('DD'), sundayReal: moment(monday).add(6,'days'),
        },this.getIndicator)
        if(moment(monday) > moment()){
            this.setState({MonColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({MonColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({MonColor: 'white'})
            this.setState({MonColorTop: 'white'})
        }
        if(moment(monday).add(1,'days') > moment()){
            this.setState({TueColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({TueColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({TueColor: 'white'})
            this.setState({TueColorTop: 'white'})
        }
        if(moment(monday).add(2,'days') > moment()){
            this.setState({WedColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({WedColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({WedColor: 'white'})
            this.setState({WedColorTop: 'white'})
        }
        if(moment(monday).add(3,'days') > moment()){
            this.setState({ThuColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({ThuColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({ThuColor: 'white'})
            this.setState({ThuColorTop: 'white'})
        }
        if(moment(monday).add(4,'days') > moment()){
            this.setState({FriColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({FriColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({FriColor: 'white'})
            this.setState({FriColorTop: 'white'})
        }
        if(moment(monday).add(5,'days') > moment()){
            this.setState({SatColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({SatColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({SatColor: 'white'})
            this.setState({SatColorTop: 'white'})
        }
        if(moment(monday).add(6,'days') > moment()){
            this.setState({SunColor: 'rgba(255, 255, 255, 0.5)'})
            this.setState({SunColorTop: 'rgba(255, 255, 255, 0.5)'})
        }else{
            this.setState({SunColor: 'white'})
            this.setState({SunColorTop: 'white'})
        }
    }

    fetchDayCallback(value,day){
        if(!this.props.activityHappening){
            if(value<moment()){
                this.props.fetchDay(value)
                this.selectedDay(day,value)
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerRow} {...this._panResponder.panHandlers}> 
                    <TouchableOpacity onPress={()=>{this.fetchDayCallback(this.state.mondayReal,this.state.monday)}} style={styles.day}>
                        <Text style={[styles.dayText,{color: this.state.MonColorTop}]}>{this.state.monday}</Text>
                        {this.state.mondayFound &&
                        this.state.MonCircleColor !== "white" &&
                        <View style={styles.indicator}>
                            <View style={styles.innerIndicator}></View>
                        </View>
                        }
                        <View style={{backgroundColor: this.state.MonCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.MonColor}]}>{this.state.mondayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.fetchDayCallback(this.state.tuesdayReal,this.state.tuesday)}} style={styles.day}>
                        <Text style={[styles.dayText,{color: this.state.TueColorTop}]}>{this.state.tuesday}</Text>
                        {this.state.tuesdayFound &&
                        this.state.TueCircleColor !== "white" &&
                        <View style={styles.indicator}>
                            <View style={styles.innerIndicator}></View>
                        </View>
                        }
                        <View style={{backgroundColor: this.state.TueCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.TueColor}]}>{this.state.tuesdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.fetchDayCallback(this.state.wednesdayReal,this.state.wednesday)}} style={styles.day}>
                        <Text style={[styles.dayText,{color: this.state.WedColorTop}]}>{this.state.wednesday}</Text>
                        {this.state.wednesdayFound &&
                        this.state.WedCircleColor !== "white" &&
                        <View style={styles.indicator}>
                            <View style={styles.innerIndicator}></View>
                        </View>
                        }
                        <View style={{backgroundColor: this.state.WedCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.WedColor}]}>{this.state.wednesdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.fetchDayCallback(this.state.thursdayReal,this.state.thursday)}} style={styles.day}>
                        <Text style={[styles.dayText,{color: this.state.ThuColorTop}]}>{this.state.thursday}</Text>
                        {this.state.thursdayFound &&
                        this.state.ThuCircleColor !== "white" &&
                        <View style={styles.indicator}>
                            <View style={styles.innerIndicator}></View>
                        </View>
                        }
                        <View style={{backgroundColor: this.state.ThuCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.ThuColor}]}>{this.state.thursdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.fetchDayCallback(this.state.fridayReal,this.state.friday)}} style={styles.day}>
                        <Text style={[styles.dayText,{color: this.state.FriColorTop}]}>{this.state.friday}</Text>
                        {this.state.fridayFound &&
                        this.state.FriCircleColor !== "white" &&
                        <View style={styles.indicator}>
                            <View style={styles.innerIndicator}></View>
                        </View>
                        }
                        <View style={{backgroundColor: this.state.FriCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.FriColor}]}>{this.state.fridayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.fetchDayCallback(this.state.saturdayReal,this.state.saturday)}} style={styles.day}>
                        <Text style={[styles.dayText,{color: this.state.SatColorTop}]}>{this.state.saturday}</Text>
                        {this.state.saturdayFound &&
                        this.state.SatCircleColor !== "white" &&
                        <View style={styles.indicator}>
                            <View style={styles.innerIndicator}></View>
                        </View>
                        }
                        <View style={{backgroundColor: this.state.SatCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.SatColor}]}>{this.state.saturdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.fetchDayCallback(this.state.sundayReal,this.state.sunday)}} style={styles.day}>
                        <Text style={[styles.dayText,{color: this.state.SunColorTop}]}>{this.state.sunday}</Text>
                        {this.state.sundayFound &&
                        this.state.SunCircleColor !== "white" &&
                        <View style={styles.indicator}>
                            <View style={styles.innerIndicator}></View>
                        </View>
                        }
                        <View style={{backgroundColor: this.state.SunCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.SunColor}]}>{this.state.sundayDD}</Text>
                         </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        width: window.width,
        height: (Platform.OS === 'ios') ? 75 : 65,
        backgroundColor: "#1CBCD4",
        paddingTop: (Platform.OS === 'ios') ? 30 : 15,
    },
    indicator:{
        position: "absolute",
        width: 8,
        height: 8,
        backgroundColor: "white",
        borderRadius: 20,
        right: window.width*0.03,
        justifyContent: "center",
        alignItems: "center"
    },  
    innerIndicator:{
        width: 5,
        height: 5,
        backgroundColor: "#FF9800",
        borderRadius: 18
    },
    containerRow: {
        flexDirection: "row"
    },
    day:{
        justifyContent: 'center',
        alignItems: "center",
        flex: 1/7,
        borderRadius: 20,
        overflow: "hidden"
    },
    dayText: {
        fontWeight: "bold",
        fontSize: 10,
        color: 'white'
    },
    dateText: {
        fontWeight: "bold",
        fontSize: 15,
        color: "white"
    }
});
