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
import DatePicker from 'react-native-datepicker';
import { showMessage, hideMessage } from "react-native-flash-message";
import { Dropdown } from 'react-native-material-dropdown';




type Props = {
  theme: theme
};

var errorMsg = '';

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

export default class Advance extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
      leaveData:[],
      visible: false,
      refreshing: false,
      advdate: '',
      advid: '',
      amount: '',
      descr: '',
      empid: '',
      empname: '',
      edit: true
    };
    
  }

  componentWillMount() {
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{console.log('Network Status>>>'+this.state.connected)})
    });

  
    AsyncStorage.getItem('@MyAdvance:key', (err, result) => {
       if (result==null) {
        console.log('No employee Data>>>> '+result);
        this.advanceList();
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

_showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });


  advanceList(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.advance, {
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
              AsyncStorage.setItem('@MyAdvance:key', JSON.stringify(responseJson.tablesDetails));
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

  _keyExtractor = (item, index) => item.advid;

   _onRefresh = () => {
    this.setState({refreshing: true});
    this.advanceList();
  }


  _hideDialog(){
  this.setState({ visible: false, edit:true })  
}

_newAdvance(){
  const defaultItem = {"advid":"","empid":"","advdate":"","amount":"","descr":"","empname":""}; 
  this.setState({
    edit:false
  },()=>{this._showDialog(defaultItem)})
}

_showDialog(item){
  this.setState({ visible: true,
                  advdate: item.advdate,
                  advid: item.advid,
                  amount: item.amount,
                  descr: item.descr,
                  empid: item.empid,
                  empname: item.empname},()=>{console.log('>>>'+ JSON.stringify(item))});

} 


checkNetwork(){
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{this.editAdvance()})
    });
}



editAdvance(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.editAdvance, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            advdate: this.state.advdate,
            advid: this.state.advid,
            amount: this.state.amount,
            descr: this.state.descr,
            empid: this.state.empid,
            empname: this.state.empname
            }),
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('employee data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));
           if(responseJson.status=='success'){
            errorMsg= 'Advance saved successfully';
             
              this.setState({
                refreshing: false,
                visible: false,
                edit: true,
                advdate: '',
                advid: '',
                amount: '',
                descr: '',
                empid: '',
                empname: ''
             },()=>{this.showAlert()})
              this.advanceList();
           }else{
            errorMsg= 'Unable to save advance';
             this.showAlert();
             this.setState({
                disabled:"false",
                refreshing: false,
                visible: false,
                edit: true
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

checkNetwork2(){
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{this.deleteAdvance()})
    });
}

deleteAdvance(){
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.deleteAdvance+this.state.advid, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
        .then((responseJson) => {
           if(responseJson.status=='success'){
             errorMsg= 'Advance deleted successfully';
             this.showAlert();
              this.setState({
                visible: false,
                edit:true,
                advdate: '',
                advid: '',
                amount: '',
                descr: '',
                empid: '',
                empname: ''
             })

            this.advanceList();
           }else{
             errorMsg= 'Unable to delete advance';
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
  }else if(this.state.amount==''){
      errorMsg= 'Please enter amount';
      this.showAlert();
  }else if(this.state.advdate==''){
      errorMsg= 'Please select date';
      this.showAlert();
  }else {
      this.checkNetwork();
  }

}

  render() {
     let data = [{
      value: 'Banana',
    }, {
      value: 'Mango',
    }, {
      value: 'Pear',
    }];
    return (
       <PaperProvider theme={theme}>
        <View style={styles.container}>
          <View style={{width:'100%', flexDirection:'row', height:40, backgroundColor:'#06A2C3', justifyContent:'space-between', alignItems:'center', paddingRight:'5%', paddingLeft:'5%'}}>
            <View>
              <Text style={{color:'white'}}>ADVANCE</Text>
            </View>
            <View>
              <Text></Text>
            </View>
            <TouchableOpacity onPress={()=>{this._newAdvance()}} style={{width:70, borderWidth:1, justifyContent:'center', alignItems:'center', borderColor:'white', height:30, borderRadius:50}}>
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
              <View style={{flex:1, alignItems:'center'}}>
                
                <TouchableOpacity style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}} onPress={()=>{this._showDialog(item)}}>
                  <View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                       <Icon name="user" size={px2dp(20)} color="#06A2C3"/>
                      <Text style={{fontSize:20, paddingLeft: 5, color:'#06A2C3'}}>{item.empname}</Text>
                    </View>
                    <View style={{marginTop:5, flexDirection:'row'}}>
                      <Text>On: </Text>
                      <Text>{item.advdate}</Text>
                    </View>
                  </View>
                  <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'#06A2C3', fontSize:20}}>Rs: {item.amount}</Text>
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
                <Dialog.Title>ADVANCE</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Please add the advance amount.</Paragraph>

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
                  : null
                 }

                  <TextInput  raised theme={{ roundness: 50 }}
                    label='AMOUNT'
                    style={{width:'80%', marginTop:10}}
                    value={this.state.amount}
                    mode={'outlined'}
                    keyboardType={'numeric'}
                    onChangeText={text => this.setState({amount: text })} />
                    <DatePicker
                      style={{width: '80%', marginTop:30}}
                      date={this.state.advdate}
                      mode="date"
                      placeholder="Advance Date"
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
                      onDateChange={(date) => {this.setState({advdate: date})}}
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
                  <Button onPress={()=>{this.checkNetwork2()}}>Delete Advance</Button>
                  <Button onPress={()=>{this.checkBlank()}}>Update</Button>
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
