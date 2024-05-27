/**
 * @format
 */

import 'react-native-gesture-handler';
import 'regenerator-runtime/runtime';
import {AppRegistry} from 'react-native';
import App from './app/Entrypoint';
import {name as appName} from './app.json';
import {enableScreens} from 'react-native-screens';
enableScreens(false);

AppRegistry.registerComponent(appName, () => App);
