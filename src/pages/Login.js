/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, NetInfo, Keyboard, AsyncStorage} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';
import {Actions} from 'react-native-router-flux';

import { withTheme, type Theme } from 'react-native-paper';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { showMessage, hideMessage } from "react-native-flash-message";


type Props = {
  theme: theme
};

var errorMsg = '';

export default class Login extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
      username:'',
      password:'',
      disabled: "false"
    };
    console.log('>>>>>>>>>>>>>>'+global.login);
  }

  componentWillMount() {
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{console.log('Network status>>>>>>>>>>'+this.state.connected)})
    });
}

checkNetwork(){
  NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        connected: isConnected
      },()=>{this.Login()})
    });
}

  Login(){
  if(this.state.connected==true){
    if(this.state.username==''| this.state.password==''){
            errorMsg = 'Username or Password cannot be blank';
             this.showAlert();
    }else{
      this.setState({
        disabled:"true"
      })
    Keyboard.dismiss();
    console.log(this.state.username);
    console.log(this.state.password);

      fetch(global.login, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user:{
            email:this.state.username,
            password: this.state.password,
            }}),
    })
    .then((response) => response.json())
        .then((responseJson) => {
           console.log('login data >>>>>>>>>>>>>>>>>>>>'+JSON.stringify(responseJson));
           // console.log(responseJson.status);
           // console.log('>>>>>>'+JSON.stringify(responseJson.tablesDetails[0].companyid));

          console.log('>>>>>>>>>>>>>>>>>>>>>>>......'+ JSON.stringify (responseJson));

           if(responseJson.status=='success'){
              AsyncStorage.setItem('@MyLogin:key', 'true');
              Actions.dashboard();
           }else{
            errorMsg= responseJson.message;
             this.showAlert();
             this.setState({
                disabled:"false"
              })
           }
        })
       .catch((error) => {
          errorMsg= 'No Network';
            this.showAlert();
        });
    }
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

  render() {
    return (
       <PaperProvider theme={this.state.Apptheme}>
        <View style={styles.container}>
          <View style={{width:'100%', height:'40%', justifyContent:'center', alignItems:'center'}}>
            <Image  source={require('../assets/login2.png')} resizeMode={'center'}/>
          </View>
          <View style={{width:'100%', height:'50%', backgroundColor:'white', alignItems:'center', marginTop:'16%', justifyContent:'center'}}>
            <TextInput 
            label='Email'
            style={{width:'80%'}}
            value={this.state.username}
            mode={'outlined'}
            onChangeText={text => this.setState({ username: text })} />
             <TextInput 
            label='Password'
            style={{width:'80%', marginTop:15}}
            value={this.state.password}
            mode={'outlined'}
            onChangeText={text => this.setState({ password: text })} />
              { 
              (this.state.disabled )== "false" ?
                <Button disabled={false} mode="contained" onPress={() => this.checkNetwork()} style={{marginTop:20,  width:'80%', height:60, justifyContent:'center'}}>
                SIGN IN
              </Button>
            :
            <Button disabled={true} mode="contained" onPress={() => this.checkNetwork()} style={{marginTop:20,  width:'80%', height:60, justifyContent:'center'}}>
              SIGNING IN ...
            </Button>

              }
             
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
