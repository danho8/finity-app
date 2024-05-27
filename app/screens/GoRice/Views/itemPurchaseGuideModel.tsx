import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import { modalActionSelector, modalStateSelector } from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Button, Dialog, useTheme } from 'react-native-paper';

const ItemPurchaseGuideModel: React.FC = () => {
  const { colors }: any = useTheme();

  const { isItemPurchaseGuideModel } = useStoreState(modalStateSelector);
  const { setIsItemPurchaseGuideModel } = useStoreActions(modalActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 32.5,
          backgroundColor: colors.background,
        },
        title: {
          marginBottom: 23,
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 16,
          right: 12,
          zIndex: 1,
        },
        iconClose: {
          width: 18,
          height: 18,
        },
        button: {
          width: (Dimensions.get('screen').width - 150) / 2,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
        wrapperInfo: {
          marginBottom: 21,
        },
        item: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
        },
        wrapperAction: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      }),
    [],
  );

  const _cancel = () => {
    setIsItemPurchaseGuideModel(false);
  };
  const _submit = () => {
    _cancel();
    NavigationService.navigate(i18n.t('tab_navigator.shop'));
  };

  return (
    <Dialog
      visible={isItemPurchaseGuideModel}
      onDismiss={_cancel}
      dismissable={true}
      style={[localStyles.container]}>
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={_cancel}>
          <Image
            source={require('../../../assets/images/icon-close.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, localStyles.title]}>
        {i18n.t('go_rice.item_purchase_guide')}
      </Text>
      <View style={[localStyles.item]}>
        <View style={[localStyles.wrapperInfo]}>
          <Text style={[styles.text14Regular, { textAlign: 'center' }]}>
            {i18n.t('go_rice.not_item')}
          </Text>
          <Text style={[styles.text14Regular, { textAlign: 'center' }]}>
            {i18n.t('go_rice.riding_is_possible_after_purchasing_the_item')}
          </Text>
          <Text style={[styles.text14Regular, { textAlign: 'center' }]}>
            {i18n.t('go_rice.would_you_like_to_go_to_the_store_page')}
          </Text>
        </View>
      </View>
      <View style={[localStyles.wrapperAction]}>
        <Button
          mode="contained"
          onPress={_cancel}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.btn_black },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('go_rice.cancel')}
        </Button>
        <Button
          mode="contained"
          onPress={_submit}
          style={[
            styles.button,
            localStyles.button,
            { backgroundColor: colors.btn_black },
          ]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={false}
          loading={false}>
          {i18n.t('go_rice.go_shop')}
        </Button>
      </View>
    </Dialog>
  );
};

export default ItemPurchaseGuideModel;
