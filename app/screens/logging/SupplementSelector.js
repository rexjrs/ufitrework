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
  Alert,
  ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
export default class SupplementSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dataSource: ds.cloneWithRows(this.props.screenProps.products),
            dataSourceClean: this.props.screenProps.products,
            products: [],
            clicked: Math.random(),
        };
    }
    
    componentWillMount(){
        let products = this.props.screenProps.products
        let tempArray = []
        for(var i in products){
            tempArray.push({
                id: products[i].id,
                name: products[i].name,
                selected: false
            })
        }
        this.setState({
            dataSource: ds.cloneWithRows(tempArray),
            dataSourceClean: tempArray
        })
    }

    componentWillReceiveProps(nextProps){
        if(this.state.clicked != nextProps.clicked){
            if(!this.props.hasProduct){ //For AddPost
                this.addProducts()
            }
        }
        if(this.props.hasProduct){
            if(this.state.finishedPost != nextProps.finishedPost){
                this.addProducts()
            }
        }
    }

    back(){
        this.props.navigation.goBack()
    }

    selectProduct(value){
        let tempArray = this.state.dataSourceClean
        for(var i in tempArray){
            if(tempArray[i].id == value){
                tempArray[i].selected = !tempArray[i].selected
            }
        }
        // For AddPost
        if(this.props.hasProduct){
            let found = false
            for(var i in tempArray){
                if(tempArray[i].selected){
                    found = true
                }
            }
            if(found){
                this.props.hasProduct(true)
            }else{
                this.props.hasProduct(false)
            }
        }
        // 
        this.setState({
            dataSource: ds.cloneWithRows(tempArray),
            dataSourceClean: tempArray
        })
    }

    addProducts(){
        let tempArray = this.state.dataSourceClean
        let counter = 0
        let products = []
        for(var i in tempArray){
            if(tempArray[i].selected){
                counter = counter+1
                products.push(tempArray[i].id)
            }
        }
        let fetchCounter = 0
        for(var i in products){
            let param ={
                username: this.props.screenProps.username,
                product_id: products[i],
                date: this.props.stateDate,
                is_taken: "1"
            }
            fetch(`${APIURL3}/addsupplement`, {
                method: 'POST',
                body: JSON.stringify(param),
                headers: HEADERPARAM3
            })
            .then((response) => {
                let responseJson = JSON.parse(response._bodyInit);
                fetchCounter = fetchCounter+1
                if(fetchCounter == counter){
                    if(!this.props.hasProduct){
                        this.props.getProduct(this.props.stateDate)
                    }else{
                        this.props.fetchDay(this.props.stateDate,true)
                    }
                    this.props.navigation.goBack()
                }
            })
        }
    }

    _renderRow(value){
        return(
            <TouchableOpacity onPress={()=>this.selectProduct(value.id)} style={styles.productCellModal}>
                <View style={{flex: 0.5, flexDirection: "row"}}>
                    {!value.selected &&
                    <View style={{marginRight: 10,height: 20, width: 20, backgroundColor: "#CCC", justifyContent: "center",alignItems: "center"}}>
                    
                    </View>
                    }
                    {value.selected &&
                    <View style={{marginRight: 10,height: 20, width: 20, backgroundColor: "#FF9800",overflow: 'hidden', justifyContent: "center",alignItems: "center"}}>
                        <Icon name="ios-checkmark" size={35} color="white" />
                    </View>
                    }
                    <Text>{value.name}</Text>
                </View>
                <View style={{flex: 0.5, alignItems: "flex-end"}}>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.cell}>
                    <View style={styles.headerBox}>
                        <Image source={require('../../assets/icons/supplements.png')} style={{width: 30, height: 30}}/>
                        <Text style={styles.icon}>Supplements</Text>
                    </View>
                    <Text style={{fontSize: 10}}>PRODUCT GOALS</Text>
                    <View style={styles.seperator}></View>
                    <Text style={{fontSize: 10, marginBottom: 10}}>ALL A-Z</Text>
                    <ListView
                        dataSource = {this.state.dataSource}
                        renderRow  = {this._renderRow.bind(this)}
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        );
    }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    productCellModal: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15
    },
    seperator: {
        borderBottomWidth: 1,
        borderColor: "#CCC",
        marginVertical: 10
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
        paddingVertical: 10,
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
    }
});
