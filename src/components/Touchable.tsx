import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

const Touchable: React.FC<TouchableOpacityProps> = React.memo((props) => (
  <TouchableOpacity {...props} activeOpacity={0.8} />
));

export default Touchable;
