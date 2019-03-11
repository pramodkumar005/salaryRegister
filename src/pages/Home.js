/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, NetInfo, Keyboard, AsyncStorage, Dimensions, TouchableOpacity} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import { withTheme, type Theme } from 'react-native-paper';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';




type Props = {
  theme: theme
};

const deviceW = Dimensions.get('window').width
const basePx = 375
function px2dp(px) {
  return px *  deviceW / basePx
}


export default class Home extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
       leaveCount: '',
        advanceCount: '',
        unpaidCount: '',
        paidCount: '',
        totalUnpaid: '',
        totalPaid: '',
        currentMonth:'',
        currentYear:''
    };
    
  }

componentWillMount() {

  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{ this.dashboard(); this.employeeList();})
    });

    var date = new Date();
    var month = date.getMonth()+1;

    var m_names = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];

    this.setState({
      currentMonth: m_names[date.getMonth()],
      currentYear: date.getFullYear()
    })
}


dashboard(){
  console.log('Component will mount>>>>>>>>>>>>>>>>>');
  if(this.state.connected==true){
       
    Keyboard.dismiss();
      fetch(global.dashboard, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
        .then((responseJson) => {
           //console.log('Leave total >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));
           // this.setState({
           //  empData:responseJson.tablesDetails
           // })
           // console.log(responseJson.status);
           //console.log('Advance User Count>>>>>>'+JSON.stringify(responseJson.empAdavance)+'Leave User Count>>>>>>'+JSON.stringify(responseJson.empLeave)+'Total Advance Taken >>>>>'+ JSON.stringify(responseJson.empAdavanceTaken)+'Unpaid User count>>>>>>>'+ JSON.stringify(responseJson.empUnSalary)+'Paid User Count>>>>>>>>'+JSON.stringify(responseJson.empSalary));

           this.setState({
            leaveCount: responseJson.empLeave,
            advanceCount: responseJson.empAdavance,
            unpaidCount: responseJson.empUnSalary,
            paidCount: responseJson.empSalary,
            totalUnpaid: responseJson.empUnSalaryPaid,
            totalPaid: responseJson.empSalaryPaid
           })


          //console.log('>>>>>>>>>>>>>>>>>>>>>>>......'+ JSON.stringify (responseJson));

        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
    
  }
}



employeeList(){
  console.log('Getting employee list>>>>>>>>>>');
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
           if(responseJson.status=='success'){
            var tempArray=[];
            for (var i = 0; i < responseJson.tablesDetails.length; i++) {
                tempArray.push({data:responseJson.tablesDetails[i].empid, value:responseJson.tablesDetails[i].empname})
              }
                console.log('>>>>>>>>'+ JSON.stringify(tempArray));

              AsyncStorage.setItem('@MyEmployeeList:key', JSON.stringify(tempArray));
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

        })
       .catch((error) => {
          console.error('error>>>>>.'+error);
        });
    
  }else {
    errorMsg= 'No Network';
            this.showAlert();
  }
}

signout(){
   AsyncStorage.removeItem('@MyLogin:key');
   Actions.login();
}


  render() {
    return (
       <PaperProvider theme={this.state.Apptheme}>
       <TouchableOpacity style={{width:100, height:50, position:'absolute', zIndex: 1, top:10, right:15, justifyContent:'flex-end', flexDirection:'row'}} onPress={()=>{this.signout()}}>
            <Icon name="power-off" size={px2dp(15)} color="white"/>
            <Text style={{paddingLeft:5, color:'white', fontSize:12}}>Logout</Text>
       </TouchableOpacity>
        <View style={styles.container}>
          <View style={{width:'100%', height:'40%', justifyContent:'center', alignItems:'center'}}>
            <Image  source={require('../assets/login2.png')} resizeMode={'center'}/>
          </View>
          
          <View style={{height:'10%'}}>
            <Text></Text>
          </View>
          
          <View style={{width:'100%', height:'50%', justifyContent:'center', alignItems:'center'}}>
            <View style={{width:'70%', marginBottom:20, flexDirection:'row', alignItems:'flex-end'}}>
              <Text style={{color:'#06A2C3'}}>{this.state.currentMonth} {this.state.currentYear} </Text>
              <View style={{borderBottomWidth:1, width:'65%', borderBottomColor:'#06A2C3'}}/>
            </View>
            <View style={{width:'80%', backgroundColor:'white', alignItems:'center', justifyContent:'space-around', flexDirection: 'row'}}>
              <TouchableOpacity  style={{alignItems:'center',padding:10, borderRadius:10, borderWidth:1, borderColor:'#06A2C3', width:'40%'}} onPress={()=>{Actions.dashboard({selectedIndex:3})}}>
                <Text style={{color:'#06A2C3', fontSize:22}}>{this.state.leaveCount}</Text>
                <Text style={{color:'#06A2C3', fontSize:11}}>On Leave</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={{alignItems:'center',padding:10, borderRadius:10, borderWidth:1, borderColor:'#06A2C3', width:'40%'}} onPress={()=>{Actions.dashboard({selectedIndex:4})}}>
                <Text style={{color:'#06A2C3', fontSize:22}}>{this.state.advanceCount}</Text>
                <Text style={{color:'#06A2C3', fontSize:11}}>Advance Taken</Text>
              </TouchableOpacity>
            </View>

            <View style={{width:'80%', backgroundColor:'white', alignItems:'center', justifyContent:'space-around', flexDirection: 'row', marginTop:'8%'}}>
              <TouchableOpacity  style={{alignItems:'center',padding:10, borderRadius:10, borderWidth:1, borderColor:'#06A2C3', width:'40%'}} onPress={()=>{Actions.dashboard({selectedIndex:2})}}>
                <Text style={{color:'#06A2C3', fontSize:22}}>{this.state.unpaidCount}</Text>
                <Text style={{color:'#06A2C3', fontSize:11}}>Unpaid Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={{alignItems:'center',padding:10, borderRadius:10, borderWidth:1, borderColor:'#06A2C3', width:'40%'}} onPress={()=>{Actions.dashboard({selectedIndex:2})}}>
                <Text style={{color:'#06A2C3', fontSize:22}}>{this.state.paidCount}</Text>
                <Text style={{color:'#06A2C3', fontSize:11}}>Paid Employee</Text>
              </TouchableOpacity>
            </View>
            
          </View>

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
    backgroundColor: 'white',
  }
});
