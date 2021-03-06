import {IProgram} from '@/models/album';
import {RootState} from '@/models/index';
import React from 'react';
import {ListRenderItemInfo, StyleSheet, Animated} from 'react-native';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';
import {ITabProps} from '../Tab';
import Item from './Item';

const mapStateToProps = ({album}: RootState) => {
  return {
    list: album.list,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

type IProps = ModelState & ITabProps;

class List extends React.Component<IProps> {
  onPress = (data: IProgram, index: number) => {
    const {onItemPress} = this.props;
    onItemPress(data, index);
  };
  renderItem = ({item, index}: ListRenderItemInfo<IProgram>) => {
    return <Item data={item} index={index} onPress={this.onPress} />;
  };
  keyExtractor = (item: IProgram) => item.id;
  render() {
    const {list, panRef, tapRef, nativeRef, onScrollDrag} = this.props;
    return (
      <NativeViewGestureHandler
        simultaneousHandlers={panRef}
        waitFor={tapRef}
        ref={nativeRef}>
        <Animated.FlatList
          style={styles.container}
          data={list}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          bounces={false}
          onScrollBeginDrag={onScrollDrag}
          onScrollEndDrag={onScrollDrag}
        />
      </NativeViewGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

export default connector(List);
