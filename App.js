/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import {RkButton, RkAvoidKeyboard, RkTextInput} from 'react-native-ui-kitten';
import { TextInput, Button } from 'react-native-paper';

import { withTheme, type Theme } from 'react-native-paper';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import Routes from './Routes';
import FlashMessage from "react-native-flash-message";



type Props = {
  theme: theme
};

export default class App extends Component<Props> {
 
  constructor(Props){
    super(Props);
    this.state={
      text:''
    };

    console.log('Props theme>>>>>>>>>'+ this.props.theme);
  }

  render() {
    return (
      <View style={{flex:1}}>
      <Routes/>
      <FlashMessage position="top" />
      </View>
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
