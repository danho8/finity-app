import i18n from 'app/i18n';
import {
  homeActionSelector,
  modalActionSelector,
  modalStateSelector,
} from 'app/store';
import styles from 'app/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dialog, useTheme } from 'react-native-paper';

const StopMiningModel: React.FC = () => {
  const { colors }: any = useTheme();
  const { isStopMiningVisible } = useStoreState(modalStateSelector);
  const { setIsStopMiningVisible } = useStoreActions(modalActionSelector);
  const { setIsCheckReachedLocationTarget } =
    useStoreActions(homeActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 19,
          paddingHorizontal: 32.5,
          backgroundColor: colors.background,
          elevation: 4,
          shadowOffset: { width: 0, height: 4 },
          shadowColor: colors.shadow_color,
        },
        textContent: {
          width: 200,
          lineHeight: 22,
          textAlign: 'center',
        },
        title: {
          marginTop: 5,
          marginBottom: 23,
          lineHeight: 19,
          alignSelf: 'center',
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 19,
          right: 17.01,
          zIndex: 1,
        },
        iconClose: {
          width: 17.99,
          height: 18,
        },
        wrapperContent: {
          paddingHorizontal: 26,
          alignSelf: 'center',
        },
        button: {
          marginHorizontal: 56.5,
          marginTop: 36,
          backgroundColor: colors.btn_black,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: 8,
          marginTop: 5,
        },
      }),
    [],
  );

  useEffect(() => {
    setIsCheckReachedLocationTarget(false);
  }, []);

  const _confirm = () => {
    setIsStopMiningVisible(false);
  };

  return (
    <Dialog
      visible={isStopMiningVisible}
      onDismiss={_confirm}
      dismissable={false}
      style={localStyles.container}>
      <Text
        style={[
          styles.text16Bold,
          localStyles.title,
          { fontWeight: '400', alignSelf: 'center' },
        ]}>
        {i18n.t('map.stop_mining')}
      </Text>
      <View style={[localStyles.wrapperContent]}>
        <Text style={[styles.text14Regular, localStyles.textContent]}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: colors.gold_500,
            }}>
            40
          </Text>
          {i18n.t('map.warning')}
        </Text>
      </View>
    </Dialog>
  );
};

export default StopMiningModel;
