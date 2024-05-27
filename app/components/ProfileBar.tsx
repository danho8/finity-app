import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

import i18n from "app/i18n";
import styles from "app/styles";
import NavigationService from "app/navigation/NavigationService";

const ProfileBar: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: colors.white,
          paddingTop: Platform.OS === "android" ? 12 : 50,
          paddingBottom: 12,
        },
        buttonIconBack: {
          width: 30,
          height: 30,
          justifyContent: 'center',
        },
        iconBack: {
          width: 8.43,
          height: 16,
        },
        iconSeting: {
          width: 18,
          height: 18,
          alignSelf: 'center'
        }
      }),
    []
  );

  const title = i18n.t(`navigation_header.${route.name}`);

  const _goBack = () => {
    NavigationService.goBack();
  }

  const _redirectSetting = () => {
    NavigationService.navigate('SettingScreen');
  }

  return (
    <View style={[localStyles.header, { alignItems: "center" }]}>
      <View style={[styles.row, { alignItems: "center", width: '100%', justifyContent: 'space-between' }]}>
        <TouchableOpacity
          onPress={_goBack}
          style={[localStyles.buttonIconBack, { paddingLeft: 16 }]}
        >
          <Image
            source={require('../assets/images/icon-back.png')}
            style={localStyles.iconBack}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text
          style={[styles.title, { fontSize: 16, fontWeight: 'normal', alignItems: "flex-start" }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <TouchableOpacity
          onPress={_redirectSetting}
          style={[localStyles.buttonIconBack, { paddingRight: 16 }]}
        >
          <Image
            source={require('../assets/images/icon-setting.png')}
            style={[localStyles.iconSeting]}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileBar;
