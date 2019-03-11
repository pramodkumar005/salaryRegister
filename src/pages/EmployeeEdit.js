/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, FlatList, NetInfo, Keyboard, Dimensions, AsyncStorage, TouchableOpacity} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import { withTheme, type Theme, Modal, Portal, Dialog, Paragraph} from 'react-native-paper';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-swipeable-row';
import DatePicker from 'react-native-datepicker';
import { showMessage, hideMessage } from "react-native-flash-message";
import {Actions} from 'react-native-router-flux';

var errorMsg = '';


type Props = {
  theme: theme
};

const deviceW = Dimensions.get('window').width
const basePx = 375
function px2dp(px) {
  return px *  deviceW / basePx
}


export default class EmployeeEdit extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
      lineItem: this.props.item,
      name: this.props.item.empname,
      mobileNo: this.props.item.mobileno,
      salary: this.props.item.salary,
      doj: this.props.item.doj,
      empid: this.props.item.empid,
      visible: false
    };
    console.log('Item Status>>>'+this.props.item);
    console.log('props theme>>>'+this.props.theme);
    this.backScreen = this.backScreen.bind(this);
  }

  componentWillMount() {
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{console.log('Network Status>>>'+this.state.connected)})
    });
}

componentWillUnmount(){
  console.log('Refrshing>>>>>>>>>>>>>>>');

}

backScreen(){
  Actions.pop({refresh: {refresh: 'true'}, timeout: 1})
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
            empname: this.state.name,
            mobileno: this.state.mobileNo,
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
              this.backScreen();
           }else{
            errorMsg= 'Unable to save data';
            this.showAlert();
           }
        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
    
  }
}

_showDialog = () => this.setState({ visible: true });

_hideDialog = () => this.setState({ visible: false });

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
              this.backScreen();
           }else{
            errorMsg= 'Unable to delete user';
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


  render() {
    return (
       <PaperProvider theme={this.state.Apptheme}>
        <View style={styles.container}>
          <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#06A2C3'}}>
            <TouchableOpacity style={{padding:10}} onPress={()=>{this.backScreen()}}>
                <Icon name="chevron-left" size={px2dp(25)} color="white" style={{paddingLeft:20}}/>
            </TouchableOpacity>
            <View style={{height:40, justifyContent:'center'}}>
              <Text style={{color:'white'}}>Employee Details</Text>
            </View>

            <TouchableOpacity style={{padding:10}} onPress={()=>{this._showDialog()}}>
                <Icon name="trash" size={px2dp(25)} color="white" style={{paddingLeft:20}}/>
            </TouchableOpacity>
          </View>

         <View style={{width:'100%', height:'100%', alignItems:'center', marginTop:20}}> 
           <TextInput 
              label='Name'
              style={{width:'80%'}}
              value={this.state.name}
              mode={'outlined'}
              onChangeText={text => this.setState({ name: text })} />
            <TextInput 
              label='Salary'
              style={{width:'80%', marginTop:10}}
              value={this.state.salary}
              keyboardType={'numeric'}
              mode={'outlined'}
              onChangeText={text => this.setState({ salary: text })} />
            <TextInput 
              label='Mobile Number'
              style={{width:'80%', marginTop:10}}
              value={this.state.mobileNo}
              mode={'outlined'}
              keyboardType={'numeric'}
              onChangeText={text => this.setState({ mobileNo: text })} />
            <DatePicker
              style={{width: '80%', marginTop:30}}
              date={this.state.doj}
              mode="date"
              placeholder="select date"
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
            <Button disabled={false} mode="contained" onPress={()=>{this.saveData()}} style={{marginTop:30,  width:'80%', height:60, justifyContent:'center'}}>
                SAVE
              </Button>
          </View>

          <Portal>
              <Dialog
                 visible={this.state.visible}
                 onDismiss={this._hideDialog} raised theme={{ roundness: 3 }}>
                <Dialog.Title>DELETE</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Are you sure want to delete this employee ?</Paragraph>
                </Dialog.Content>

                <Dialog.Actions>
                  <Button onPress={()=>{this._hideDialog()}}>Cancel</Button>
                  <Button onPress={()=>{this.deleteData()}}>Ok</Button>
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
    alignItems: 'center',
    backgroundColor: 'white'
  }
});
