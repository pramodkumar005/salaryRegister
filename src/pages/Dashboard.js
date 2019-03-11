/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, AsyncStorage} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { withTheme, type Theme } from 'react-native-paper';

import { DefaultTheme, BottomNavigation, Provider as PaperProvider, Dialog, Paragraph, Portal } from 'react-native-paper';
import Home from './Home';
import Employees from './Employees';
import Salary from './Salary';
import Leave from './Leave';
import Advance from './Advance';
import {Actions} from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';



type Props = {
  theme: theme
};

const HomeRoute = () => <Home/>;

const EmployeeRoute = () => <Employees/>;

const SalaryRoute = () => <Salary/>;

const LeaveRoute = () => <Leave/>;

const AdvanceRoute = () => <Advance/>;

export default class Dashboard extends Component<Props> {

componentWillReceiveProps(data){
  console.log('Refrshing recieved>>>>>>>>>>>>>>>on Dashboard'+JSON.stringify(data.refresh));
  this.setState({
    index: 1
  })
}
  
 
  constructor(Props){
    super(Props);
    this.state={
      Apptheme:  this.props.theme,
      index: 0,
      routes: [
        { key: 'home', title: 'Home', icon: 'home' },
        { key: 'employees', title: 'Employee', icon: 'people' },
        { key: 'salary', title: 'Salary', icon: 'payment' },
        { key: 'leave', title: 'Leave', icon: 'input' },
        { key: 'advance', title: 'Advance', icon: 'label' },
      ],
      visible: false
    };
    console.log('selected tab code >>>>>>>>>..'+this.props.selectedIndex)
  }

  componentWillMount() {
    AsyncStorage.getItem('@MyLogin:key', (err, result) => {
       if (result==null) {
        console.log('User is not logged in>>>> '+result);
        Actions.login();
      }else{
        console.log('User is logged in>>>> '+result);
      }
    })

    if (this.props.selectedIndex==null){
      console.log('Selected index is null');
      this.setState({
        index: 0
      })
    } else {
      this.setState({
        index: this.props.selectedIndex
      })
    }

    
  }

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    employees: EmployeeRoute,
    salary: SalaryRoute,
    leave: LeaveRoute,
    advance: AdvanceRoute
  });


   _hideDialog(){
  this.setState({ visible: false })  
}

_showDialog(item){
  console.log(item);
  this.setState({ visible: true});

} 




  render() {   
    return (
       <PaperProvider theme={this.state.Apptheme}>
         <BottomNavigation
            navigationState={this.state}
            onIndexChange={this._handleIndexChange}
            renderScene={this._renderScene}
          />
          
        <Portal>
              <Dialog
                 visible={this.state.visible}
                 onDismiss={()=>{this._hideDialog()}} raised theme={{ roundness: 3 }}>
                <Dialog.Title>LEAVE</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Please add the advance amount.</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={()=>{this._hideDialog()}}>Cancel</Button>
                  <Button onPress={()=>{this.updatedLeave()}}>Save</Button>
                </Dialog.Actions>
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
    alignItems: 'center',
    backgroundColor: 'white',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  }
});
