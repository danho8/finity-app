import { useNavigation, useRoute } from "@react-navigation/native";
import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, Text, Platform } from "react-native";
import { Button, useTheme } from "react-native-paper";

import styles from "../../styles";
import { shopStateSelector } from "app/store/index";
import { useStoreState } from "easy-peasy";

const BuyItemSuccessScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { isStatusFunctions } = useStoreState(shopStateSelector);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      })
    });
  }, [navigation]);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 10,
          backgroundColor: colors.background
        },
        labelButton: {
          textTransform: 'capitalize'
        },
        button: {
          backgroundColor: colors.black,
          marginVertical: 5
        },
        iconPlay: {
          width: 24,
          height: 24
        },
        text14: {
          textAlign: 'center',
          lineHeight: 28,
          marginTop: 10
        },
      }),
    []
  );

  const _redirectShop = () => {
    NavigationService.navigate('ShopScreen');
  }

  const _redirectInventory = () => {
    NavigationService.navigate(i18n.t('ShopScreen'));
    NavigationService.navigate(i18n.t('tab_navigator.inventory'));
  }

  const _redirectGoride = () => {
    NavigationService.navigate(i18n.t('ShopScreen'));
    NavigationService.navigate(i18n.t('tab_navigator.go-rice'));
  }

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <Text style={[styles.text18Bold]}>
        {i18n.t('buy_item_success.buy_success')}
      </Text>
      <Text style={[styles.text14Regular, localStyles.text14, { marginBottom: 5 }]}>
        {i18n.t('buy_item_success.buy_content')}
      </Text>
      <Text style={[styles.text14Regular, { textAlign: 'center', marginBottom: 42 }]}>
        {(Platform?.OS != 'ios' || isStatusFunctions) ?
          i18n.t('buy_item_success.buy_description')
          : i18n.t('Call_the_user_and_ship_the_bike_to')}
      </Text>
      <View>
        {route?.params?.isWatchVideo ? (
          <View>
            <Button
              mode="contained"
              onPress={_redirectGoride}
              style={[styles.button, localStyles.button]}
              uppercase={true}
              labelStyle={[styles.labelButton, localStyles.labelButton]}
              disabled={isLoading}
              loading={isLoading}>
              {i18n.t("buy_item_success.go_Ride")}
            </Button>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={_redirectShop}
            style={[styles.button, localStyles.button]}
            uppercase={true}
            labelStyle={[styles.labelButton, localStyles.labelButton]}
            disabled={isLoading}
            loading={isLoading}
          >
            {i18n.t("buy_item_success.shop")}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={_redirectInventory}
          style={[styles.button, localStyles.button, { backgroundColor: colors.primary }]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={isLoading}
        >
          {i18n.t("buy_item_success.inventory")}
        </Button>
      </View>
    </View >
  );
}

export default BuyItemSuccessScreen;
