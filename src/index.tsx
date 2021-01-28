import React from 'react';
import {Text, View} from 'react-native';

import {test} from './pages/test/test';

test();

class App extends React.Component {
  render() {
    return (
      <View>
        <Text>app</Text>
      </View>
    );
  }
}

export default App;
