import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Platform } from "react-native";
import { Title, useTheme } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

import i18n from "app/i18n";
import styles from "app/styles";
import NavigationService from "app/navigation/NavigationService";

const CloseBar: React.FC = () => {
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
        headerTitle: {
          fontSize: 16,
          textAlign: "center",
          paddingHorizontal: 32,
        },
        wrapperIcon: {
          width: 30,
          height: 30,
          justifyContent: 'center',
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
      <View style={[styles.row, { alignItems: "center", width: '100%', justifyContent: 'space-between' }]}>
        <TouchableOpacity
          style={localStyles.wrapperIcon}
          onPress={() => NavigationService.goBack()}
        >
          <Image
            source={require('../assets/images/icon-close-black.png')}
            style={localStyles.iconBack}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Title
          style={[localStyles.headerTitle, { alignItems: "flex-start" }]}
          numberOfLines={1}
        >
          {title}
        </Title>
        <View
          style={{ opacity: 0 }}
        >
          <Image
            source={require('../assets/images/icon-close-black.png')}
            style={localStyles.iconBack}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
}

export default CloseBar;
