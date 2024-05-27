import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { useTheme } from "react-native-paper";

const WhiteBar: React.FC = () => {
  const { colors }: any = useTheme();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "android" ? 27 : 65,
          paddingBottom: 12,
        },
      }),
    []
  );

  return (
    <View style={[localStyles.header, { alignItems: "center" }]} />
  );
}

export default WhiteBar;
