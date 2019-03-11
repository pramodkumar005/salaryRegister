/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, FlatList, NetInfo, Keyboard, Dimensions, AsyncStorage, RefreshControl, TouchableOpacity} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import { withTheme, type Theme, Modal, Portal, Dialog, Paragraph} from 'react-native-paper';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { showMessage, hideMessage } from "react-native-flash-message";




const deviceW = Dimensions.get('window').width
const basePx = 375
function px2dp(px) {
  return px *  deviceW / basePx
}

const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 50,
  colors: {
    ...DefaultTheme.colors,
    primary: '#06A2C3',
    accent: 'green',
    borderColor: '#06A2C3'
  }
};

var errorMsg = '';

export default class Salary extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
      salaryDataUnpaid:[],
      salaryDataPaid:[],
      visible: false,
      refreshing: false,
      selectedIndex: 0,
      payment:''
    };  
  }

  componentWillMount() {
    var date = new Date();
    var month = date.getMonth()+1
    var year = date.getFullYear();

    var days = new Date(year, month, 0).getDate();
    console.log('days>>>>>>>>>>'+days);

    this.setState({
      currentMonth:month,
      currentYear: year
    })

  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{console.log('Network status>>>>>'+this.state.connected)})
    });

  
    AsyncStorage.getItem('@MySalaryUnpaid', (err, result) => {
       if (result==null) {
        console.log('No employee Data>>>> '+result);
        this.salaryList();
      }else{
        console.log('Employee data present>>>> '+result);
        this.setState({
          salaryDataUnpaid: JSON.parse(result)
        })
      }
    });

    AsyncStorage.getItem('@MySalaryPaid', (err, result) => {
       if (result==null) {
        console.log('No employee Data>>>> '+result);
        this.salaryList();
      }else{
        console.log('Employee data present>>>> '+result);
        this.setState({
          salaryDataPaid: JSON.parse(result)
        })
      }
    })

}

_showDialog(item){
  this.setState({ visible: true, lineitem: item, payment: item.salary},()=>{console.log('>>>'+this.state.lineitem.empid)});

} 


_hideDialog(){
  this.setState({ visible: false })  
}

checkNetwork(){
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{this.payNow()})
    });
}

payNow(){
  console.log('payment>>>>>>>>>>'+this.state.payment)
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.markPaid, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            advancetaken: this.state.lineitem.advancetaken,
            doj: this.state.lineitem.doj,
            empid: this.state.lineitem.empid,
            empname: this.state.lineitem.empname,
            leavestaken: this.state.lineitem.leavestaken,
            mobileno: this.state.lineitem.mobileno,
            noofdaysworked: this.state.lineitem.noofdaysworked,
            salary: this.state.lineitem.salary,
            salaryforthemonth: this.state.lineitem.salaryforthemonth,
            salarypaid: this.state.payment,
            salarypaiddate: this.state.lineitem.salarypaiddate,
            salid: ""
            }),
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('Salary updated data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));

           if(responseJson.status=='success'){
             errorMsg= 'Payment updated successfully';
             this.showAlert();
              this.setState({
                visible: false
             })

            this.salaryList();
           }else{
             errorMsg= 'Unable to update payment';
             this.showAlert();
             this.setState({
                visible: false
              })
           }
        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
    
  }
}


showAlert(){
     showMessage({
              message: errorMsg,
              type: "info",
            });
}


  salaryList(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.salary+'month='+this.state.currentMonth+'&year='+this.state.currentYear, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('Salary data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));

           if(responseJson.status=='success'){
              AsyncStorage.setItem('@MySalaryUnpaid:key', JSON.stringify(responseJson.unPaidSalaryArray));
              AsyncStorage.setItem('@MySalaryPaid:key', JSON.stringify(responseJson.paidSalaryArray));
              this.setState({
                salaryDataUnpaid:responseJson.unPaidSalaryArray,
                salaryDataPaid:responseJson.paidSalaryArray,
                refreshing: false
             })
           }else{
            errorMsg= responseJson.message;
             this.showAlert();
             this.setState({
                disabled:"false",
                refreshing: false
              })
           }
        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
    
  }
}

  _keyExtractor = (item, index) => item.empid;

   _onRefresh = () => {
    this.setState({refreshing: true});
    this.salaryList();
  }

  handleIndexChange = index => {
    this.setState({
      selectedIndex: index
    },()=>{console.log('Selected Index>>>>>>>>>>>>>'+this.state.selectedIndex)});
  };

  render() {
    return (
       <PaperProvider theme={theme}>

        <View style={styles.container}>
          <SegmentedControlTab
            values={["Unpaid", "Paid"]}
            tabsContainerStyle={{width:'90%', alignItems:'center', marginTop:10}}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            activeTabStyle={{backgroundColor:'#06A2C3'}}
            tabStyle={{borderColor:'#06A2C3'}}
            tabTextStyle={{color:'#06A2C3'}}
          />

          {(this.state.selectedIndex==0)? 

            <FlatList
            data={this.state.salaryDataUnpaid}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            style={{width:'90%', marginLeft:'5%', marginTop:10, marginRight:'5%', marginTop:10}}
            showsVerticalScrollIndicator={false}
             refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            renderItem={({item}) => (
              <View style={{flex:1}}>
                
                <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                  <View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                       <Icon name="user" size={px2dp(20)} color="#06A2C3"/>
                      <Text style={{fontSize:20, paddingLeft: 5, color:'#06A2C3'}}>{item.empname}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Joining Date: </Text>
                      <Text>{item.doj}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Contact: </Text>
                      <Text>{item.mobileno}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Salary: </Text>
                      <Text>{item.salary}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Leave: </Text>
                      <Text>{(item.leavestaken=='0')? 'No leave' : item.leavestaken}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Advance: </Text>
                      <Text>{(item.advancetaken=='0')? 'No Advance' : 'Rs '+item.advancetaken}</Text>
                    </View>
                  </View>

                  <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#06A2C3', fontSize:24}}>{item.noofdaysworked}</Text>
                    <Text style={{color:'#06A2C3'}}>Working Days</Text>
                    <TouchableOpacity style={{marginTop:5, flexDirection:'row', width:100, height:30, justifyContent:'center', alignItems:'center', borderRadius:2, backgroundColor:'#06A2C3'}} onPress={()=>{this._showDialog(item)}}>
                       <Icon name="money" size={px2dp(18)} color="white"/>
                       <Text style={{marginLeft:5, color:'white'}}>Pay Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{width:'100%', height:1, backgroundColor:'#D5D3D3', marginTop:5, marginBottom:5}}/>

              </View>
            )}
          />
          :
            <FlatList
            data={this.state.salaryDataPaid}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            style={{width:'90%', marginLeft:'5%', marginTop:10, marginRight:'5%'}}
            showsVerticalScrollIndicator={false}
             refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            renderItem={({item}) => (
              <View style={{flex:1}}>
                
                <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                  <View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                       <Icon name="user" size={px2dp(20)} color="#06A2C3"/>
                      <Text style={{fontSize:20, paddingLeft: 5, color:'#06A2C3'}}>{item.empname}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Joining Date: </Text>
                      <Text>{item.doj}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Contact: </Text>
                      <Text>{item.mobileno}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Salary: </Text>
                      <Text>{item.salary}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Leave: </Text>
                      <Text>{item.leavestaken}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Advance: </Text>
                      <Text>Rs: {item.advancetaken}</Text>
                    </View>
                  </View>
                  <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#06A2C3', fontSize:24}}>{item.noofdaysworked}</Text>
                    <Text style={{color:'#06A2C3'}}>Working Days</Text>
                  </View>
                </View>
                <View style={{width:'100%', height:1, backgroundColor:'#D5D3D3', marginTop:5, marginBottom:5}}/>

              </View>
            )}
          />
        }
        <Portal>
              <Dialog
                 visible={this.state.visible}
                 onDismiss={()=>{this._hideDialog()}} raised theme={{ roundness: 3 }}>
                <Dialog.Title>PAYMENT</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Please add the salary amount to be paid.</Paragraph>
                  <TextInput raised theme={{ roundness: 50 }}
                    label='Salary'
                    style={{width:'80%', marginTop:10}}
                    value={this.state.payment}
                    mode={'outlined'}
                    keyboardType={'numeric'}
                    onChangeText={text => this.setState({payment: text })} />
                </Dialog.Content>

                <Dialog.Actions>
                  <Button onPress={()=>{this._hideDialog()}}>Cancel</Button>
                  <Button onPress={()=>{this.checkNetwork()}}>Ok</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
        </View>
         </PaperProvider >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});
