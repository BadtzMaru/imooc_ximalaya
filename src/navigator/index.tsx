import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '@/pages/Home';
import Detail from '@/pages/Detail';

type RoootStackParamList = {
  Home: undefined;
  Detail: undefined;
};

let Stack = createStackNavigator<RoootStackParamList>();

class Navigator extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
          <Stack.Screen
            options={{headerTitle: '首页'}}
            name="Home"
            component={Home}
          />
          <Stack.Screen
            options={{headerTitle: '详情页'}}
            name="Detail"
            component={Detail}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigator;
