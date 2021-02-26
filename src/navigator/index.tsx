import React from 'react';
import {
  NavigationContainer,
  NavigationState,
  RouteProp,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import Detail from '@/pages/Detail';
import {Platform, StatusBar, StyleSheet, Animated} from 'react-native';
import Category from '../pages/Category/index';
import Album from '@/pages/Album';
import Icon from '@/assets/iconfont/index';
import PlayView from '@/pages/views/PlayView';
import {getActiveRouteName} from '../utils';

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
    opacity?: Animated.Value;
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
      opacity: route.params.opacity,
    },
    headerBackground: () => {
      return (
        <Animated.View
          style={[styles.headerBackgroud, {opacity: route.params.opacity}]}
        />
      );
    },
  };
}

const styles = StyleSheet.create({
  headerBackgroud: {
    flex: 1,
    backgroundColor: '#fff',
    opacity: 0,
  },
  headerBackImage: {
    marginHorizontal: Platform.OS === 'android' ? 0 : 8,
  },
});

function RootStackScreen() {
  return (
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
      <Stack.Screen name="Album" component={Album} options={getAlbumOptions} />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{headerTitle: '详情页'}}
      />
    </Stack.Navigator>
  );
}
export type ModalStackParamList = {
  Root: undefined;
  Detail: {id: string};
};

const ModalStack = createStackNavigator<ModalStackParamList>();

export type ModalStackNavigation = StackNavigationProp<ModalStackParamList>;

function ModalStackScreen() {
  return (
    <ModalStack.Navigator
      mode="modal"
      headerMode="screen"
      screenOptions={{
        headerTitleAlign: 'center',
        gestureEnabled: true,
        ...TransitionPresets.ModalSlideFromBottomIOS,
        headerBackTitleVisible: false,
      }}>
      <ModalStack.Screen
        name="Root"
        component={RootStackScreen}
        options={{headerShown: false}}
      />
      <ModalStack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerTintColor: '#fff',
          headerTitle: '',
          headerTransparent: true,
          cardStyle: {backgroundColor: '#807c66'},
          headerBackImage: ({tintColor}) => (
            <Icon
              name="icon-down"
              size={30}
              color={tintColor}
              style={styles.headerBackImage}
            />
          ),
        }}
      />
    </ModalStack.Navigator>
  );
}

class Navigator extends React.Component {
  state = {
    routeName: 'Root',
  };
  onStateChange = (state: NavigationState | undefined) => {
    if (typeof state !== 'undefined') {
      const routeName = getActiveRouteName(state);
      this.setState({
        routeName,
      });
    }
  };
  render() {
    const {routeName} = this.state;
    return (
      <NavigationContainer onStateChange={this.onStateChange}>
        <ModalStackScreen />
        <PlayView routeName={routeName} />
      </NavigationContainer>
    );
  }
}

export default Navigator;
