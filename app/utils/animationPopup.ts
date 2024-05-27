import { Animated, Dimensions, Platform } from 'react-native';

const handleAnimation = (
  isShowAnimation: boolean,
  animated: Animated.Value,
  duration: number = 500,
) => {
  isShowAnimation
    ? Animated.sequence([
        Animated.timing(animated, {
          toValue:
            Platform.OS === 'ios'
              ? Dimensions.get('window').height / 1.5
              : Dimensions.get('window').height / 1.6,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start()
    : Animated.sequence([
        Animated.timing(animated, {
          toValue: Dimensions.get('window').height,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start();
};

export { handleAnimation };
