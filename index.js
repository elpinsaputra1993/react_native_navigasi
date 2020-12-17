/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AddProduct from './components/screens/AddProduct';

AppRegistry.registerComponent(appName, () => AddProduct);
