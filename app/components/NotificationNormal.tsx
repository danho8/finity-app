import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Keyboard, BackHandler } from "react-native";
import { useTheme } from "react-native-paper";
import { modalActionSelector, modalStateSelector } from "../store";

const NotificationNormal: React.FC = () => {
  const { colors }: any = useTheme();

  const { setIsNotificationVisible, setTextNotification } = useStoreActions(modalActionSelector);
  const { textNotification } = useStoreState(modalStateSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          bottom: 100,
          left: 16,
          backgroundColor: colors.black,
          width: Dimensions.get('window').width - 32,
          borderRadius: 8,
        },
        button: {
          padding: 16,
        },
        text: {
          color: colors.white,
          fontFamily: 'Pretendard-Regular',
          fontSize: 14,
        },
      }),
    []
  );

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsNotificationVisible(false);
      setTextNotification('');
    }, 3000);
  }, [])

  const _handleChooseNotification = () => {
    setIsNotificationVisible(false);
    
    switch(textNotification) {
      case i18n.t('notification.exit_app'): {
        BackHandler.exitApp();
        break;
      }
      case i18n.t('notification.add_to_list_favorite'):
      case i18n.t('notification.remove_from_list_favorite'): {
        NavigationService.navigate('MyFavoritesScreen');
        break;
      }
    }
  }

  return (
    <View style={localStyles.container}>
      <TouchableOpacity
        onPress={_handleChooseNotification}
        style={localStyles.button}
        disabled={
          (textNotification === i18n.t('notification.exit_app') ||
          textNotification === i18n.t('notification.add_to_list_favorite') ||
          textNotification === i18n.t('notification.remove_from_list_favorite')) ? false : true
        }
      >
        <Text style={localStyles.text}>{textNotification}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default NotificationNormal;
