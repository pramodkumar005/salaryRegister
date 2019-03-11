/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, RefreshControl, Text, View, Image, FlatList, NetInfo, Keyboard, Dimensions, AsyncStorage, TouchableOpacity} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import { withTheme, type Theme, Modal, Portal, Dialog, Paragraph} from 'react-native-paper';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-swipeable-row';
import {Actions} from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import { showMessage, hideMessage } from "react-native-flash-message";




type Props = {
  theme: theme
};

const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 50,
  colors: {
    ...DefaultTheme.colors,
    primary: '#06A2C3',
    accent: 'green',
    borderColor: '#ffffff'
  }
};

const deviceW = Dimensions.get('window').width
const basePx = 375
function px2dp(px) {
  return px *  deviceW / basePx
}


const rightButtons = [
  <TouchableOpacity style={{justifyContent:'center', backgroundColor:'white', height:'90%'}}>
    <View style={{paddingLeft:15}}>
    <Icon name="edit" size={px2dp(25)} color="#06A2C3" style={{paddingLeft:20}}/>
    </View>
  </TouchableOpacity>,
  <TouchableOpacity style={{justifyContent:'center', backgroundColor:'white', height:'90%'}}>
    <View style={{paddingLeft:15, borderWidthLeft:1}}>
    <Icon name="trash" size={px2dp(25)} color="#06A2C3" style={{paddingLeft:20}}/>
    </View>
  </TouchableOpacity>
];

export default class Employees extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
      empData:[],
      visible: false,
      lineItem:'',
      refreshing: false,
      saveChanges: this.props.saved,
      doj: '',
      empid: '',
      empname: '',
      mobileno: '',
      salary: '',
      edit: true
    };
    console.log('saved call back>>>>>>>'+this.state.saveChanges);
    this.employeeList = this.employeeList.bind(this)
  }

  componentWillMount() {
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{console.log('Network Status>>>'+this.state.connected)})
    });

  
    AsyncStorage.getItem('@MyEmployee:key', (err, result) => {
       if (result==null) {
        console.log('No employee Data>>>> '+result);
        this.employeeList();
      }else{
        console.log('Employee data present>>>> '+result);
        this.setState({
          empData: JSON.parse(result)
        })
      }
    })

     if (this.state.saveChanges==true) {
        console.log('Reciewved True>>>>>>');
    }else{
        console.log('Reciewved Nothing>>>>>>');
    }
}


checkNetwork(){
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{this.saveData()})
    });
}

saveData(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.saveEmployee, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            empname: this.state.empname,
            mobileno: this.state.mobileno,
            salary: this.state.salary,
            doj: this.state.doj,
            empid: this.state.empid
            }),
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('employee data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));

           if(responseJson.status=='success'){
              errorMsg= 'Data Saved Successfully';
              AsyncStorage.removeItem('@MyEmployee:key');
              this.showAlert();
              this.setState({
                visible: false,
                edit: true,
                empname: '',
                mobileno: '',
                salary: '',
                doj: '',
                empid: ''
              })
              this.employeeList();

           }else{
            errorMsg= 'Unable to save data';
            this.showAlert();
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

// _showModal = (item) => {
//   this.setState({ visible: true, lineItem: item }, ()=>{console.log('passed data>>>>'+this.state.lineItem.empname)});
// };
// _hideModal = () => this.setState({ visible: false });

_hideDialog(){
  this.setState({ visible: false, edit:true })  
}

_showDialog(item){
  this.setState({ visible: true, 
            empname: item.empname,
            mobileno: item.mobileno,
            salary: item.salary,
            doj: item.doj,
            empid: item.empid})
} 


  employeeList(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.employees, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('employee data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));

           if(responseJson.status=='success'){
              AsyncStorage.setItem('@MyEmployee:key', JSON.stringify(responseJson.tablesDetails));
              this.setState({
                empData:responseJson.tablesDetails,
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
    
  } else {
    errorMsg= 'No Network';
            this.showAlert();
  }
}

editEmployee(item){
  console.log('To be edited>>>>>>'+JSON.stringify(item));
  Actions.employeeEdit({item:item});
}

componentWillReceiveProps(){
  console.log('Refrshing recieved>>>>>>>>>>>>>>>on employee');

}

  _keyExtractor = (item, index) => item.empid;

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.employeeList();
  }

  _newAdvance(){
  const defaultItem = {"empname": "", "mobileno": "", "salary": "", "doj": "", "empid": ""}; 
  this.setState({
    edit:false
  },()=>{this._showDialog(defaultItem)})
}


checkNetwork2(){
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{this.deleteData()})
    });
}


deleteData(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.employeeDelete+this.state.empid, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('employee data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));

           if(responseJson.status=='success'){
              errorMsg= 'User Deleted Successfully';
              this.showAlert();
              this.setState({
                visible: false
              })
              this.employeeList();
           }else{
            errorMsg= 'Unable to delete user';
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

checkBlank(){
  if(this.state.empname==''){
      errorMsg= 'Please select name';
      this.showAlert();
  }else if(this.state.mobileno==''){
      errorMsg= 'Please enter mobile number';
      this.showAlert();
  }else if(this.state.mobileno.length<=10){
      errorMsg= 'Enter correct mobile number';
      this.showAlert();
  }else if(this.state.doj==''){
      errorMsg= 'Please enter joining date';
      this.showAlert();
  }else if(this.state.salary==''){
      errorMsg= 'Please enter salary';
      this.showAlert();
  }else {
      this.checkNetwork();
  }

}

  render() {
    return (
       <PaperProvider theme={theme}>
        <View style={styles.container}>
          <View style={{width:'100%', flexDirection:'row', height:40, backgroundColor:'#06A2C3', justifyContent:'space-between', alignItems:'center', paddingRight:'5%', paddingLeft:'5%'}}>
            <View>
              <Text style={{color:'white'}}>EMPLOYEE</Text>
            </View>
            <View>
              <Text></Text>
            </View>
            <TouchableOpacity onPress={()=>{this._newAdvance()}} style={{width:70, borderWidth:1, justifyContent:'center', alignItems:'center', borderColor:'white', height:30, borderRadius:50}}>
              <Text style={{color:'white'}}>+ New</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.empData}
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
              <TouchableOpacity style={{flex:1}} onPress={()=>{this._showDialog(item)}}>
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
                      <View style={{marginTop:5, flexDirection:'row', justifyContent:'space-between'}}>
                        <View>
                          <Text>Salary: </Text>
                          <Text>{item.salary}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{justifyContent:'center'}}>
                      <View style={{flexDirection:'row', justifyContent:'flex-end'}} >
                         
                      </View>
                    </View>
                  </View>
                <View style={{width:'100%', height:1, backgroundColor:'#D5D3D3', marginTop:5, marginBottom:5}}/>
              </TouchableOpacity>
            )}
          />
        </View>
        <Portal>
              <Dialog
                 visible={this.state.visible}
                 onDismiss={()=>{this._hideDialog()}} raised theme={{ roundness: 3 }}>
                <Dialog.Title>EMPLOYEE</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Please add employee details.</Paragraph>
                  <TextInput raised theme={{ roundness: 50 }}
                    label='NAME'
                    style={{width:'80%', marginTop:10}}
                    value={this.state.empname}
                    mode={'outlined'}
                    onChangeText={text => this.setState({empname: text })} />
                    <TextInput raised theme={{ roundness: 50 }}
                    label='MOBILE'
                    style={{width:'80%', marginTop:10}}
                    value={this.state.mobileno}
                    mode={'outlined'}
                    keyboardType={'numeric'}
                    onChangeText={text => this.setState({mobileno: text })} />
                    <TextInput raised theme={{ roundness: 50 }}
                    label='SALARY'
                    style={{width:'80%', marginTop:10}}
                    value={this.state.salary}
                    mode={'outlined'}
                    keyboardType={'numeric'}
                    onChangeText={text => this.setState({salary: text })} />
                    <DatePicker
                      style={{width: '80%', marginTop:30}}
                      date={this.state.doj}
                      mode="date"
                      placeholder="Joining Date"
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
                      onDateChange={(date) => {this.setState({doj: date})}}
                    />
                </Dialog.Content>
                  {this.state.edit== false?
                  <Dialog.Actions>
                  <Button onPress={()=>{this._hideDialog()}}>Cancel</Button>
                  <Button onPress={()=>{this.checkBlank()}}>Save</Button>
                  </Dialog.Actions>
                  :  
                  <Dialog.Actions>
                  <Button onPress={()=>{this._hideDialog()}}>Cancel</Button>
                  <Button onPress={()=>{this.checkNetwork2()}}>DELETE</Button>
                  <Button onPress={()=>{this.checkBlank()}}>UPDATE</Button>
                  </Dialog.Actions>
                  }
              </Dialog>
            </Portal>
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
