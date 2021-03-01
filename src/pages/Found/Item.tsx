import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {IFound} from '.';
import VideoControls from 'react-native-video-custom-controls';

interface IProps {
  data: IFound;
  setCurrentId: (id: string) => void;
  paused: boolean;
}

class Item extends React.Component<IProps> {
  onPlay = () => {
    const {data, setCurrentId} = this.props;
    setCurrentId(data.id);
  };
  onPause = () => {
    const {setCurrentId} = this.props;
    setCurrentId('');
  };
  render() {
    const {data, paused} = this.props;
    return (
      <View>
        <Text>{data.id}</Text>
        <VideoControls
          paused={paused}
          source={{uri: data.videoUrl}}
          style={styles.video}
          onPlay={this.onPlay}
          onPause={this.onPause}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  video: {height: 220},
});

export default Item;
