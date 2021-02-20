import Touchable from '@/components/Touchable';
import {
  MaterialTopTabBarProps,
  MaterialTopTabBar,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

interface IProps extends MaterialTopTabBarProps {}

class TopTabBarWrapper extends React.Component<IProps> {
  render() {
    const {props} = this;
    return (
      <View style={styles.container}>
        <View style={styles.topTabBarView}>
          <MaterialTopTabBar {...props} style={styles.tabbar} />
          <Touchable style={styles.categoryBtn}>
            <Text>分类</Text>
          </Touchable>
        </View>
        <View style={styles.bottom}>
          <Touchable style={styles.searchBtn}>
            <Text>搜索按钮</Text>
          </Touchable>
          <Touchable style={styles.historyBtn}>
            <Text>历史记录</Text>
          </Touchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
    backgroundColor: '#fff',
  },
  tabbar: {
    elevation: 0,
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  topTabBarView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBtn: {
    paddingHorizontal: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#ccc',
  },
  searchBtn: {
    flex: 1,
    paddingLeft: 12,
    height: 30,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  bottom: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  historyBtn: {
    marginLeft: 24,
  },
});

export default TopTabBarWrapper;
