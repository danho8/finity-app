import React from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { useTheme } from "react-native-paper";

const WhiteBarSafeAreaView: React.FC = () => {
  const { colors }: any = useTheme();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "android" ? 27 : 35,
        },
      }),
    []
  );

  return (
    <View style={[localStyles.header, { alignItems: "center" }]}>
      <StatusBar
        barStyle="dark-content"
        animated={true}
      />
    </View>
  );
}

export default WhiteBarSafeAreaView;
