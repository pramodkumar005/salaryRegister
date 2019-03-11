/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity, Text, View, Image, FlatList, NetInfo, Keyboard, Dimensions, AsyncStorage, RefreshControl} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import { withTheme, type Theme, Modal, Portal, Dialog, Paragraph} from 'react-native-paper';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import { showMessage, hideMessage } from "react-native-flash-message";
import { Dropdown } from 'react-native-material-dropdown';



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

const deviceW = Dimensions.get('window').width
const basePx = 375
function px2dp(px) {
  return px *  deviceW / basePx
}

var errorMsg = '';

export default class Leave extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
      leaveData:[],
      visible: false,
      refreshing: false,
      empid: '',
      empname: '',
      leavefrom: '',
      leaveid: '',
      leaveto: '',
      noofdays: '',
      edit:true
    };
    
  }

  componentWillMount() {
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{console.log('Network Status>>>'+this.state.connected)})
    });

  
    AsyncStorage.getItem('@MyLeave:key', (err, result) => {
       if (result==null) {
        console.log('No employee Data>>>> '+result);
        this.leaveList();
      }else{
        console.log('Employee data present>>>> '+result);
        this.setState({
          leaveData: JSON.parse(result)
        })
      }
    })


     AsyncStorage.getItem('@MyEmployeeList:key', (err, result) => {
       if (result==null) {
        console.log('No employee Data>>>> '+result);
      }else{
        console.log('Employee data present>>>> '+result);
        this.setState({
          employeeList: JSON.parse(result)
        },()=>{console.log(this.state.employeeList)})
      }
    })

}

_showModal = () => this.setState({ visible: true});
  _hideModal = () => this.setState({ visible: false });


  leaveList(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.leave, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('employee data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));
           var tempArray= [];
           if(responseJson.status=='success'){
             
              AsyncStorage.setItem('@MyLeave:key', JSON.stringify(responseJson.tablesDetails));
              this.setState({
                leaveData:responseJson.tablesDetails,
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

          console.log('>>>>>>>>>>>>>>>>>>>>>>>......'+ JSON.stringify (responseJson));

        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
    
  }
}

  _keyExtractor = (item, index) => item.leaveid;

   _onRefresh = () => {
    this.setState({refreshing: true});
    this.leaveList();
  }

  _showDialog(item){
    var days =  Math.floor(( Date.parse(item.leaveto) - Date.parse(item.leavefrom) ) / 86400000)+1;
    console.log('>>>>'+days);

  this.setState({ visible: true, leavefrom:item.leavefrom,  leaveto: item.leaveto, leaveid: item.leaveid, empname:item.empname, empid: item.empid, noofdays:item.noofdays});
} 


_hideDialog(){
  this.setState({ visible: false, edit:true })  
}

checkBlank(){
  if(this.state.empname==''){
      errorMsg= 'Please select name';
      this.showAlert();
  }else if(this.state.leavefrom==''){
      errorMsg= 'Please select from date';
      this.showAlert();
  }else if(this.state.leaveto==''){
      errorMsg= 'Please select to date';
      this.showAlert();
  }else {
      this.updatedLeave();
  }

}


updatedLeave(){

  var days =  Math.floor(( Date.parse(this.state.leaveto) - Date.parse(this.state.leavefrom) ) / 86400000)+1;
  this.setState({
    noofdays:days
  },()=>{

  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.leaveUpdate, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            empid: this.state.empid,
            empname: this.state.empname,
            leavefrom: this.state.leavefrom,
            leaveid: this.state.leaveid,
            leaveto: this.state.leaveto,
            noofdays: this.state.noofdays,
            }),
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('Salary updated data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));

           if(responseJson.status=='success'){
             errorMsg= 'Leave saved successfully';
             this.showAlert();
              this.setState({
                visible: false,
                edit:true,
                empid: '',
                empname: '',
                leavefrom: '',
                leaveid: '',
                leaveto: '',
                noofdays: ''
             })

            this.leaveList();
           }else{
             errorMsg= 'Unable to save leave';
             this.showAlert();
             this.setState({
                visible: false,
                edit:true
              })
           }
        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
    
  } else {
    errorMsg= 'No Network';
            this.showAlert();
    }
  })
}


deleteLeave(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.deleteLeave+this.state.leaveid, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
        .then((responseJson) => {
           if(responseJson.status=='success'){
             errorMsg= 'Leave deleted successfully';
             this.showAlert();
              this.setState({
                visible: false,
                edit:true,
                empid: '',
                empname: '',
                leavefrom: '',
                leaveid: '',
                leaveto: '',
                noofdays: ''
             })

            this.leaveList();
           }else{
             errorMsg= 'Unable to delete leave';
             this.showAlert();
             this.setState({
                visible: false,
                edit:true
              })
           }
        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
  } else {
    errorMsg= 'No Network';
            this.showAlert();
  }
}


showAlert(){
     showMessage({
              message: errorMsg,
              type: "info",
            });
}

_newLeave(){
  const defaultItem = {empid: "",
                      empname: "",
                      leavefrom: "",
                      leaveid: "",
                      leaveto: "",
                      noofdays:""}; 
  this.setState({
    edit:false
  },()=>{this._showDialog(defaultItem)})
}

  render() {
    return (
       <PaperProvider theme={theme}>
        <View style={styles.container}>
          <View style={{width:'100%', flexDirection:'row', height:40, backgroundColor:'#06A2C3', justifyContent:'space-between', alignItems:'center', paddingRight:'5%', paddingLeft:'5%'}}>
            <View>
              <Text style={{color:'white'}}>LEAVE</Text>
            </View>
            <View>
              <Text></Text>
            </View>
            <TouchableOpacity onPress={()=>{this._newLeave()}} style={{width:70, borderWidth:1, justifyContent:'center', alignItems:'center', borderColor:'white', height:30, borderRadius:50}}>
              <Text style={{color:'white'}}>+ New</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.leaveData}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            style={{width:'90%', marginLeft:'5%', marginTop:10}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            renderItem={({item}) => (
              <View style={{flex:1}}>
                <TouchableOpacity style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}} onPress={()=>{this._showDialog(item)}}>
                  <View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                       <Icon name="user" size={px2dp(20)} color="#06A2C3"/>
                      <Text style={{fontSize:20, paddingLeft: 5, color:'#06A2C3'}}>{item.empname}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Leave from: </Text>
                      <Text>{item.leavefrom}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>Leave to: </Text>
                      <Text>{item.leaveto}</Text>
                    </View>
                  </View>
                  <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#06A2C3', fontSize:24}}>{item.noofdays}</Text>
                    <Text style={{color:'#06A2C3'}}>Days Leave</Text>
                  </View>
                </TouchableOpacity>
                <View style={{width:'100%', height:1, backgroundColor:'#D5D3D3', marginTop:5, marginBottom:5}}/>

              </View>
            )}
          />
        <Portal>
              <Dialog
                 visible={this.state.visible}
                 onDismiss={()=>{this._hideDialog()}} raised theme={{ roundness: 3 }}>
                <Dialog.Title>LEAVE</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Please add the leave details.</Paragraph>
                  
                  {this.state.edit==false? 
                  <Dropdown
                    label='Select Employee'
                    data={this.state.employeeList}
                    onChangeText={(value, index, data)=>{
                      this.setState({
                          empid: JSON.stringify(data[index].data),
                          empname: JSON.stringify(data[index].value)
                      });
                      console.log(value+':::'+JSON.stringify(data[index].value)+':::'+index)
                    }}
                  />
                  :null
                  }
                   <DatePicker
                      style={{width: '80%', marginTop:30}}
                      date={this.state.leavefrom}
                      mode="date"
                      placeholder="Leave from"
                      format="YYYY-MM-DD"
                      minDate="2019-01-01"
                      maxDate="2099-06-01"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          right: 5,
                          top: 4,
                          marginRight: 0
                        },
                        dateInput: {
                          borderRadius: 30,
                          borderColor:'grey',
                          height:60
                        }
                      }}
                      onDateChange={(date) => {this.setState({leavefrom: date})}}
                    />
                    <DatePicker
                      style={{width: '80%', marginTop:30}}
                      date={this.state.leaveto}
                      mode="date"
                      placeholder="Leave to"
                      format="YYYY-MM-DD"
                      minDate="2019-01-01"
                      maxDate="2099-06-01"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          right: 5,
                          top: 4,
                          marginRight: 0
                        },
                        dateInput: {
                          borderRadius: 30,
                          borderColor:'grey',
                          height:60
                        }
                      }}
                      onDateChange={(date) => {this.setState({leaveto: date})}}
                    />
                </Dialog.Content>

                { this.state.edit == false? 

                  <Dialog.Actions>
                  <Button onPress={()=>{this._hideDialog()}}>Cancel</Button>
                  <Button onPress={()=>{this.checkBlank()}}>Save</Button>
                </Dialog.Actions>
                :
                <Dialog.Actions>
                  <Button onPress={()=>{this._hideDialog()}}>Cancel</Button>
                  <Button onPress={()=>{this.deleteLeave()}}>Delete Leave</Button>
                  <Button onPress={()=>{this.checkBlank()}}>Save</Button>
                </Dialog.Actions>
              }


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
    alignItems: 'flex-start',
    backgroundColor: 'white'
  }
});
