import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Title, useTheme } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

import i18n from "app/i18n";
import styles from "app/styles";

const TitleBar: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: colors.white,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "android" ? 12 : 50,
          paddingBottom: 12,
        },
        titleStyle: {
          fontSize: 16,
          marginTop: 5,
          marginLeft: -10,
          fontFamily: 'Pretendard-Regular',
        },
        headerTitle: {
          fontSize: 16,
          textAlign: "center",
          paddingHorizontal: 32,
          fontFamily: 'Pretendard-Regular',
        },
        iconBack: {
          width: 20,
          height: 20,
        },
      }),
    []
  );

  const title = i18n.t(`navigation_header.${route.name}`);

  return (
    <View style={[localStyles.header, { alignItems: "center" }]}>
      <View style={[styles.row, { alignItems: "center", width: '100%', justifyContent: 'center' }]}>
        <Title
          style={[localStyles.headerTitle, { alignItems: "flex-start" }]}
          numberOfLines={1}
        >
          {title}
        </Title>
      </View>
    </View>
  );
}

export default TitleBar;
