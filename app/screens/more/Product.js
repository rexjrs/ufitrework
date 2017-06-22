import React, { Component } from 'react';
import {
StyleSheet,
Text,
View,
Dimensions,
TouchableOpacity,
StatusBar,
AsyncStorage,
Platform,
Modal,
ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
export default class Product extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cells: [1,2,3,4,5],
            selected: [],
            visible: false,
            dataSource: ds.cloneWithRows(this.props.navigation.state.params.products),
            dataSourceClean: this.props.navigation.state.params.products
        }
    }

    componentWillMount(){
        this.getSelected()
    }  

    getSelected(){
        let tempArray = this.state.dataSourceClean
        let tempProduct = []
        for(var i in tempArray){
            if(tempArray[i].selected){
                tempProduct.push(tempArray[i].id)
            }
        }
        this.setState({
            selected: tempProduct
        })
    }

    selectProduct(id){
        let tempArray = this.state.dataSourceClean
        let count = 0
        for(var i in tempArray){
            if(tempArray[i].selected){
                count = count+1
            }
        }
        for(var i in tempArray){
            if(tempArray[i].id == id){
                if(count == 5){
                    if(tempArray[i].selected){
                        tempArray[i].selected = !tempArray[i].selected
                    }else{
                        
                    }
                }else{
                    tempArray[i].selected = !tempArray[i].selected
                }
            }
        }
        this.getSelected()
        this.setState({
            dataSourceClean: tempArray,
            dataSource: ds.cloneWithRows(tempArray),
        })
        this.props.navigation.state.params.screenProps.setProducts(tempArray)
    }

    _renderRow(value){
        return(
            <TouchableOpacity onPress={()=>this.selectProduct(value.id)} style={styles.productCellModal}>
                <View style={{flex: 0.5}}>
                    <Text>{value.name}</Text>
                </View>
                <View style={{flex: 0.5, alignItems: "flex-end"}}>
                {value.selected &&
                <Icon name="ios-checkmark-circle" size={20} color="#1CBCD4" />
                }
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        var Cells = this.state.cells.map((b,i)=>{
            let bgColor = "transparent"
            let productName = ""
            let dosage = ""
            if(this.state.selected[i]){
                bgColor = "white"
                for(var e in this.state.dataSourceClean){
                    if(this.state.dataSourceClean[e].id == this.state.selected[i]){
                        productName = this.state.dataSourceClean[e].name
                        dosage = this.state.dataSourceClean[e].dosage
                    }
                }
            }
            return(
                <TouchableOpacity onPress={()=>this.setState({visible: true})} key={i} style={[styles.productCell,{backgroundColor: bgColor}]}>
                    {this.state.selected[i] &&
                    <View style={styles.innerSelected}>
                        <Text style={{flex: 0.5}}>{productName}</Text>
                        <Text style={{color: "#1CBCD4"}}>{dosage} Card</Text>
                    </View>
                    }
                    {!this.state.selected[i] &&
                    <View style={styles.innerCell}>
                        <Text style={{color: "gray",fontWeight: "bold", marginRight: 10}}>Add Product</Text>
                        <Icon name="ios-add-circle" size={20} color="gray" />
                    </View>
                    }
                </TouchableOpacity>
            )
        })
        return(
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={[styles.navButton,{flex: 1/3}]}>
                        <Text style={styles.navBarText}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Product Goals</Text>
                    </View>
                    <View style={{flex: 1/3}}></View>
                </View>
                <View style={styles.mainContainer}>
                    <Text style={{color: "gray"}}>Product goals</Text>
                    <Text style={{color: "gray",fontSize: 12,marginBottom: 10}}>These products will show up everyday on your daily log page.</Text>
                    {Cells}
                </View>
                <Modal
                    animationType={"slide"}
                    visible={this.state.visible}
                    style={styles.modal}
                    onRequestClose={()=>this.setState({visible: false})}
                >
                    <View style={styles.modalContainer}>
                            {Platform.OS === "ios" &&
                            <View style={styles.statusBar}></View>
                            }
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={()=>this.setState({visible: false})} style={styles.back}>
                                <Text style={{color: "white"}}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.scrollView}>
                            <Text style={{color: "gray",fontWeight: "bold",marginTop: 10,fontSize: 12}}>ALL A-Z</Text>
                            <ListView
                                dataSource = {this.state.dataSource}
                                renderRow  = {this._renderRow.bind(this)}
                                enableEmptySections={true}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
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
        backgroundColor: "#F2F2F2"
    },
    statusBar:{
        height: 10,
        backgroundColor: "#1CBCD4"
    },
    innerSelected: {
        flexDirection: "row",
        paddingHorizontal: 20
    },
    productCellModal:{
        paddingVertical: 15,
        flexDirection: "row"
    },
    scrollView: {
        paddingHorizontal: 20
    },
    back: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: "center"
    },
    modalHeader:{
        backgroundColor: "#1CBCD4",
        height: 50,
        flexDirection: 'row'
    },
    modalContainer: {
        flex: 1,
    },
    innerCell: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    productCell: {
        height: 50,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: "#CCC",
        justifyContent: "center",
        backgroundColor: "#F2F2F2"
    },
    mainContainer: {
        paddingHorizontal: 20
    },
    titleContainer: {
        flex: 1/3,
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        color: "white",
        fontWeight: "bold"
    },
    navButton: {
        justifyContent: "center",
    },
    navBar: {
        height: (Platform.OS === 'ios') ? 60 : 50,
        backgroundColor: "#1CBCD4",
        paddingTop: (Platform.OS === 'ios') ? 10 : 0,
        marginBottom: 20,
        flexDirection: "row"
    },
    navBarText: {
        color: "white",
        marginLeft: 20
    },  
    header: {
        paddingHorizontal: 30,
        marginBottom: 20
    },
    headerText: {
        fontSize: 18
    },
    cellContainer: {
        width: window.width,
        height: 50,
        justifyContent: "center",
        paddingHorizontal: 30
    },
    cellText: {
        fontSize: 14
    }
})