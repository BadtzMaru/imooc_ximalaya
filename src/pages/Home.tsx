import React from 'react';
import {Button, Text, View} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';

interface IProps {
  navigation: RootStackNavigation;
}

class Home extends React.Component<IProps> {
  onPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Detail', {id: 100});
  };
  render() {
    return (
      <View>
        <Text>Home</Text>
        <Button title="跳转到详情页" onPress={this.onPress} />
      </View>
    );
  }
}

export default Home;
