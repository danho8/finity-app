import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

import i18n from "app/i18n";
import styles from "app/styles";
import NavigationService from "app/navigation/NavigationService";

const CoinStatusBar: React.FC = () => {
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
        iconBack: {
          width: 8.43,
          height: 16,
        },
      }),
    []
  );

  const title = i18n.t(`navigation_header.${route.name}`);

  const _goBack = () => {
    NavigationService.goBack();
  }

  const _redirectSwap = () => {
    NavigationService.navigate('SwapScreen');
  }

  return (
    <View style={[localStyles.header, { alignItems: "center" }]}>
      <View style={[styles.row, { alignItems: "center", width: '100%', justifyContent: 'space-between' }]}>
        <TouchableOpacity
          onPress={_goBack}
          style={{ width: 70 }}
        >
          <Image
            source={require('../assets/images/icon-back.png')}
            style={localStyles.iconBack}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text
          style={[styles.title, { alignItems: "flex-start", width: Dimensions.get('screen').width - 172 }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <TouchableOpacity
          onPress={_redirectSwap}
          style={{
            width: 70,
            borderWidth: 1,
            borderColor: colors.backgroundContent,
            alignItems: 'center',
            borderRadius: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={[styles.text14SemiBold, { color: colors.blue, textAlign: 'right' }]}>
            {i18n.t('coin_situation.swap')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CoinStatusBar;
