import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {ModalStackNavigation, ModalStackParamList} from '../../navigator';
import Icon from '@/assets/iconfont/index';
import PlaySlider from './PlaySlider';
import {viewportWidth} from '@/utils/index';
import LinearGradient from 'react-native-linear-gradient';
import Barrage from '@/components/Barrage';

const data: string[] = ['弹幕1', '弹幕2', '弹幕3', '弹幕4', '弹幕5'];

function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function getText() {
  return data[randomIndex(data.length)];
}

const IMAGE_WIDTH = 180;

const PADDING_TOP = (viewportWidth - IMAGE_WIDTH) / 2;

const SCALE = viewportWidth / IMAGE_WIDTH;

const mapStateToProps = ({player}: RootState) => {
  return {
    soundUrl: player.soundUrl,
    playState: player.playState,
    title: player.title,
    previousId: player.previousId,
    nextId: player.nextId,
    thumbnailUrl: player.thumbnailUrl,
    id: player.id,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  route: RouteProp<ModalStackParamList, 'Detail'>;
  navigation: ModalStackNavigation;
}

interface Message {
  id: number;
  title: string;
}

interface IState {
  barrage: boolean;
  barrageData: Message[];
}

class Detail extends React.Component<IProps, IState> {
  state = {
    barrage: false,
    barrageData: [],
  };
  anim = new Animated.Value(1);
  componentDidMount() {
    const {dispatch, route, navigation, title, id} = this.props;
    if (route.params && route.params.id !== id) {
      dispatch({
        type: 'player/fetchShow',
        payload: {
          id: route.params.id,
        },
      });
    } else {
      dispatch({
        type: 'player/play',
      });
    }
    navigation.setOptions({
      headerTitle: title,
    });
    this.addBarrage();
  }
  componentDidUpdate(prevProps: IProps) {
    if (this.props.title !== prevProps.title) {
      this.props.navigation.setOptions({
        headerTitle: this.props.title,
      });
    }
  }
  toggle = () => {
    const {dispatch, playState} = this.props;
    dispatch({
      type: playState === 'playing' ? 'player/pause' : 'player/play',
    });
  };
  previous = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'player/previous',
    });
  };
  next = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'player/next',
    });
  };
  barrage = () => {
    this.setState({
      barrage: !this.state.barrage,
    });
    Animated.timing(this.anim, {
      toValue: this.state.barrage ? 1 : SCALE,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };
  addBarrage = () => {
    setInterval(() => {
      const {barrage} = this.state;
      if (barrage) {
        const id = Date.now();
        const title = getText();
        this.setState({
          barrageData: [{id, title}],
        });
      }
    }, 100);
  };
  render() {
    const {barrage, barrageData} = this.state;
    const {playState, previousId, nextId, thumbnailUrl} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.imageView}>
          <Animated.Image
            source={{uri: thumbnailUrl}}
            style={[
              styles.image,
              {borderRadius: barrage ? 0 : 8, transform: [{scale: this.anim}]},
            ]}
          />
        </View>
        {barrage && (
          <>
            <LinearGradient
              colors={['rgba(128,104,102,0.5)', '#807c66']}
              style={styles.linear}
            />
            <Barrage data={barrageData} maxTrack={5} />
          </>
        )}
        <Touchable style={styles.barrageBtn} onPress={this.barrage}>
          <Text style={styles.barrageText}>弹幕</Text>
        </Touchable>
        <PlaySlider />
        <View style={styles.control}>
          <Touchable
            disabled={!previousId}
            onPress={this.previous}
            style={styles.button}>
            <Icon name="icon-shangyishou" size={30} color="#fff" />
          </Touchable>
          <Touchable onPress={this.toggle} style={styles.button}>
            <Icon
              name={playState === 'playing' ? 'icon-paste' : 'icon-bofang'}
              size={40}
              color="#fff"
            />
          </Touchable>
          <Touchable
            disabled={!nextId}
            onPress={this.next}
            style={styles.button}>
            <Icon name="icon-xiayishou" size={30} color="#fff" />
          </Touchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: PADDING_TOP,
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 90,
  },
  button: {
    marginHorizontal: 10,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    backgroundColor: '#ccc',
  },
  imageView: {
    alignItems: 'center',
    height: IMAGE_WIDTH,
  },
  barrageBtn: {
    height: 20,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    marginLeft: 10,
  },
  barrageText: {
    color: '#fff',
  },
  linear: {
    position: 'absolute',
    top: 0,
    height: viewportWidth,
    width: viewportWidth,
  },
});

export default connector(Detail);
