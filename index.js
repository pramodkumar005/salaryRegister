/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import './src/pages/Helper.js';

// const theme = {
//   ...DefaultTheme,
//   dark: false,
//   roundness: 2,
//   colors: {
//   	...DefaultTheme.colors,
//     primary: 'red',
//     accent: 'green',
//     borderColor: 'yellow',
//     background : 'red'
//   }
// };

export default function Main() {
  return (
    
      <App />
 
  );
}

AppRegistry.registerComponent(appName, () => App);
