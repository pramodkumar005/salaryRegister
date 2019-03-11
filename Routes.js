import React, { Component} from 'react';
import {AsyncStorage} from 'react-native';
import {Actions,Router,Stack,Scene} from 'react-native-router-flux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import EmployeeEdit from './src/pages/EmployeeEdit';

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

export default class Routes extends Component<{}> {

	render(){
		console.log('I am here>>>>>>>>>>>>>>');
		return(
		  <Router>
		    <Stack key="root" hideNavBar={true}>
		      <Scene key="login" component={Login}  title="Login" theme={theme}/>
		      <Scene key="dashboard" component={Dashboard} title="Dashboard"   initial="true"  theme={theme}/>
		      <Scene key="employeeEdit" component={EmployeeEdit} title="EmployeeEdit" theme={theme}/>
		    </Stack>
		  </Router>
		)
	}

}