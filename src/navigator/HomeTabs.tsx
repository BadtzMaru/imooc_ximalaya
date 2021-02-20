import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import Home from '@/pages/Home/index';
import TopTabBarWrapper from '@/pages/views/TopTabBarWrapper';

const Tab = createMaterialTopTabNavigator();

class HomeTabs extends React.Component {
  renderTabBar = (props: MaterialTopTabBarProps) => {
    return <TopTabBarWrapper {...props} />;
  };
  render() {
    return (
      <Tab.Navigator
        lazy
        tabBar={this.renderTabBar}
        tabBarOptions={{
          scrollEnabled: true,
          tabStyle: {
            width: 80,
          },
          indicatorStyle: {
            height: 4,
            width: 20,
            marginLeft: 30,
            borderRadius: 2,
            backgroundColor: '#f86442',
          },
          activeTintColor: '#f86442',
          inactiveTintColor: '#333',
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{tabBarLabel: '推荐'}}
        />
      </Tab.Navigator>
    );
  }
}

export default HomeTabs;
