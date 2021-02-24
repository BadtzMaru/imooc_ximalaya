import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '@/models/index';
import Carousel, {sideHeight} from './Carousel';
import Guess from './Guess';
import ChannelItem from './ChannelItem';
import {IChannel, IGuess} from '@/models/home';
import {RouteProp} from '@react-navigation/native';
import {HomeParamList} from '@/navigator/HomeTabs';

const mapStateToProps = (
  state: RootState,
  {route}: {route: RouteProp<HomeParamList, string>},
) => {
  const {namespace} = route.params;
  const modelState = state[namespace];
  return {
    namespace,
    carousels: modelState.carousels,
    channels: modelState.channels,
    hasMore: modelState.pagination.hasMore,
    loading: state.loading.effects[namespace + '/fetchChannels'],
    gradientVisible: modelState.gradientVisible,
  };
};

const connector = connect(mapStateToProps);

type MadelState = ConnectedProps<typeof connector>;

interface IProps extends MadelState {
  navigation: RootStackNavigation;
}

interface IState {
  refreshing: boolean;
}

class Home extends React.Component<IProps, IState> {
  state = {
    refreshing: false,
  };
  componentDidMount() {
    const {dispatch, namespace} = this.props;
    dispatch({
      type: namespace + '/fetchCarousels',
    });
    dispatch({
      type: namespace + '/fetchChannels',
    });
  }
  goAlbum = (data: IChannel | IGuess) => {
    console.log(data);
    const {navigation} = this.props;
    navigation.navigate('Album', {item: data});
  };
  renderItem = ({item}: ListRenderItemInfo<IChannel>) => {
    return <ChannelItem data={item} onPress={this.goAlbum} />;
  };
  get header() {
    const {namespace} = this.props;
    return (
      <View>
        <Carousel />
        <View style={styles.background}>
          <Guess namespace={namespace} goAlbum={this.goAlbum} />
        </View>
      </View>
    );
  }
  keyExtractor = (item: IChannel) => {
    return item.id;
  };
  // 刷新
  onRefresh = () => {
    const {dispatch, namespace} = this.props;
    this.setState({
      refreshing: true,
    });
    dispatch({
      type: namespace + '/fetchChannels',
      callback: () => {
        this.setState({
          refreshing: false,
        });
      },
    });
  };
  // 加载更多
  onEndReached = () => {
    const {dispatch, loading, hasMore, namespace} = this.props;
    if (loading || !hasMore) {
      return;
    }
    dispatch({
      type: namespace + '/fetchChannels',
      payload: {
        loadMore: true,
      },
    });
  };
  get footer() {
    const {hasMore, loading, channels} = this.props;
    if (!hasMore) {
      return (
        <View style={styles.end}>
          <Text>--我是有底线的--</Text>
        </View>
      );
    }
    if (loading && hasMore && channels.length > 0) {
      return (
        <View style={styles.loading}>
          <Text>正在加载中...</Text>
        </View>
      );
    }
  }
  get empty() {
    const {loading} = this.props;
    if (loading) {
      return;
    }
    return (
      <View style={styles.empty}>
        <Text>暂无数据</Text>
      </View>
    );
  }
  onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y;
    let newGradientVisible = offsetY < sideHeight;
    const {dispatch, gradientVisible, namespace} = this.props;
    if (gradientVisible !== newGradientVisible) {
      dispatch({
        type: namespace + '/setState',
        payload: {
          gradientVisible: newGradientVisible,
        },
      });
    }
  };
  render() {
    const {refreshing} = this.state;
    const {channels} = this.props;
    return (
      <FlatList
        ListHeaderComponent={this.header}
        ListFooterComponent={this.footer}
        ListEmptyComponent={this.empty}
        data={channels}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onRefresh={this.onRefresh}
        refreshing={refreshing}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.2}
        onScroll={this.onScroll}
      />
    );
  }
}

const styles = StyleSheet.create({
  end: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 100,
  },
  background: {
    backgroundColor: '#fff',
  },
});

export default connector(Home);
