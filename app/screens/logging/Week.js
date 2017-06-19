import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import moment from 'moment';

export default class FoodCard extends Component {
    constructor(props) {
        super(props);
        this.state = { 

        };
    }

    componentWillMount(){
        let date = new Date()
        this.getDays(date)
        this.selectedDay(moment(date).format('ddd'))
    }

    selectedDay(value){
        this.setState({
            selectedDay: value,
            MonColor: "white",TueColor: "white",WedColor: "white",ThuColor: "white",FriColor: "white",SatColor: "white",SunColor: "white",
            MonCircleColor: "transparent",TueCircleColor: "transparent",WedCircleColor: "transparent",ThuCircleColor: "transparent",FriCircleColor: "transparent",SatCircleColor: "transparent",SunCircleColor: "transparent",
            [value+'Color']: "#1CBCD4",
            [value+'CircleColor']: "white"
        })
    }

    getDays(value){
        let monday = moment().startOf('isoweek')
        if(value){
            monday = moment(value).startOf('isoweek')
        }
        this.setState({
            monday: moment().startOf('isoweek').format('ddd'), mondayDD: moment().startOf('isoweek').format('DD'), mondayReal: moment().startOf('isoweek'),
            tuesday: moment(monday).add(1,'days').format('ddd'), tuesdayDD: moment(monday).add(1,'days').format('DD'), tuesdayReal: moment(monday).add(1,'days'),
            wednesday: moment(monday).add(2,'days').format('ddd'), wednesdayDD: moment(monday).add(2,'days').format('DD'), wednesdayReal: moment(monday).add(2,'days'),
            thursday: moment(monday).add(3,'days').format('ddd'), thursdayDD: moment(monday).add(3,'days').format('DD'), thursdayReal: moment(monday).add(3,'days'),
            friday: moment(monday).add(4,'days').format('ddd'), fridayDD: moment(monday).add(4,'days').format('DD'), fridayReal: moment(monday).add(4,'days'),
            saturday: moment(monday).add(5,'days').format('ddd'), saturdayDD: moment(monday).add(5,'days').format('DD'), saturdayReal: moment(monday).add(5,'days'),
            sunday: moment(monday).add(6,'days').format('ddd'), sundayDD: moment(monday).add(6,'days').format('DD'), sundayReal: moment(monday).add(6,'days'),
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerRow}> 
                    <TouchableOpacity onPress={()=>{this.selectedDay(this.state.monday);this.props.fetchDay(this.state.mondayReal)}} style={styles.day}>
                        <Text style={styles.dayText}>{this.state.monday}</Text>
                        <View style={{backgroundColor: this.state.MonCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.MonColor}]}>{this.state.mondayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.selectedDay(this.state.tuesday);this.props.fetchDay(this.state.tuesdayReal)}} style={styles.day}>
                        <Text style={styles.dayText}>{this.state.tuesday}</Text>
                        <View style={{backgroundColor: this.state.TueCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.TueColor}]}>{this.state.tuesdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.selectedDay(this.state.wednesday);this.props.fetchDay(this.state.wednesdayReal)}} style={styles.day}>
                        <Text style={styles.dayText}>{this.state.wednesday}</Text>
                        <View style={{backgroundColor: this.state.WedCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.WedColor}]}>{this.state.wednesdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.selectedDay(this.state.thursday);this.props.fetchDay(this.state.thursdayReal)}} style={styles.day}>
                        <Text style={styles.dayText}>{this.state.thursday}</Text>
                        <View style={{backgroundColor: this.state.ThuCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.ThuColor}]}>{this.state.thursdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.selectedDay(this.state.friday);this.props.fetchDay(this.state.fridayReal)}} style={styles.day}>
                        <Text style={styles.dayText}>{this.state.friday}</Text>
                        <View style={{backgroundColor: this.state.FriCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.FriColor}]}>{this.state.fridayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.selectedDay(this.state.saturday);this.props.fetchDay(this.state.saturdayReal)}} style={styles.day}>
                        <Text style={styles.dayText}>{this.state.saturday}</Text>
                        <View style={{backgroundColor: this.state.SatCircleColor, borderRadius: 10, overflow: "hidden",padding: 2}}>
                            <Text style={[styles.dateText,{color: this.state.SatColor}]}>{this.state.saturdayDD}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.selectedDay(this.state.sunday);this.props.fetchDay(this.state.sundayReal)}} style={styles.day}>
                        <Text style={styles.dayText}>{this.state.sunday}</Text>
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
        height: 75,
        backgroundColor: "#1CBCD4",
        paddingTop: 30
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
