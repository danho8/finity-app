import React from "react";
import { StyleSheet, ImageBackground, View, StatusBar } from "react-native";
import { useTheme } from "react-native-paper";

import styles from "../../styles";

const SplashScreen: React.FC = () => {
  const { colors }: any = useTheme();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
        },
        imageBackground: {
          flex: 1,
          justifyContent: 'space-between',
        },
      }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={'light-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <ImageBackground
        source={require('../../assets/images/splash.png')}
        style={localStyles.imageBackground}
        resizeMode="cover"
      />
    </View>
  );
}

export default SplashScreen;
