import React from 'react';
import {NavigationContainer, RouteProp} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import Detail from '@/pages/Detail';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import Category from '../pages/Category/index';
import Album from '@/pages/Album';
import Animated from 'react-native-reanimated';

export type RootStackParamList = {
  BottomTabs: {
    screen?: string;
  };
  Album: {
    item: {
      id: string;
      title: string;
      image: string;
    };
  };
  Detail: {
    id: number;
  };
  Category: undefined;
};

export type RootStackNavigation = StackNavigationProp<RootStackParamList>;

let Stack = createStackNavigator<RootStackParamList>();

function getAlbumOptions({
  route,
}: {
  route: RouteProp<RootStackParamList, 'Album'>;
}) {
  return {
    headerTitle: route.params.item.title,
    headerTransparent: true,
    headerTitleStyle: {
      opacity: 0,
    },
    headerBackground: () => {
      return <Animated.View style={styles.headerBackgroud} />;
    },
  };
}

const styles = StyleSheet.create({
  headerBackgroud: {
    flex: 1,
    backgroundColor: '#fff',
    opacity: 0,
  },
});

class Navigator extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            ...Platform.select({
              android: {
                headerStatusBarHeight: StatusBar.currentHeight,
              },
            }),
            headerBackTitleVisible: false,
            headerTintColor: '#333',
            headerStyle: {
              ...Platform.select({
                android: {
                  elevation: 0,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              }),
            },
          }}
          headerMode="float">
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabs}
            options={{headerTitle: '首页'}}
          />
          <Stack.Screen
            name="Category"
            component={Category}
            options={{headerTitle: '分类'}}
          />
          <Stack.Screen
            name="Album"
            component={Album}
            options={getAlbumOptions}
          />
          <Stack.Screen
            name="Detail"
            component={Detail}
            options={{headerTitle: '详情页'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigator;
