import { useNavigation } from '@react-navigation/native';
import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import { storage } from 'app/store/storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import styles from '../../styles';

const InstructionsScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 23,
          backgroundColor: colors.background,
        },
        labelButton: {
          textTransform: 'capitalize',
          textAlign: 'center',
          alignItems: 'center',
        },
        button: {
          backgroundColor: colors.btn_black,
          width: '100%',
        },
        content: {
          lineHeight: 19,
          marginBottom: 12,
        },
        title_app: {
          color: colors.black,
          alignSelf: 'center',
          fontSize: 26,
          marginBottom: 31,
          height: 34,
          fontWeight: 'bold',
          textTransform: 'capitalize',
        },
        content_description: {
          marginBottom: 42,
          alignSelf: 'center',
          fontSize: 18,
          width: 266,
          lineHeight: 22,
          height: 109,
          textAlign: 'center',
        },
        warp_title: {
          marginBottom: 41,
        },
        content_location: {
          marginBottom: 21,
          fontWeight: 'bold',
          marginLeft: 15,
          lineHeight: 19,
        },
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        storage.setItem('isInstructions', true);
      });
    });
  }, [navigation]);

  const _login = () => {
    NavigationService.navigate('LoginScreen');
  };

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <Text style={[localStyles.title_app]}>
        {i18n.t('instructions.title')}
      </Text>
      <Text style={[styles.text14Regular, localStyles.content_description]}>
        {i18n.t('instructions.description_1')}
      </Text>
      <View style={[localStyles.warp_title]}>
        <Text style={[styles.text18Regular, localStyles.content]}>
          {i18n.t('instructions.required_access')}
        </Text>
        <Text style={[styles.text16Regular, localStyles.content]}>
          {i18n.t('instructions.location')}
        </Text>
        <Text style={[styles.text16Regular, localStyles.content_location]}>
          {i18n.t('instructions.stream_local_ads_based_on_location')}
        </Text>
        <Text style={[styles.text18Regular, localStyles.content]}>
          {i18n.t('instructions.optional_access_rights')}
        </Text>
        <Text style={[styles.text16Regular, localStyles.content]}>
          {i18n.t('instructions.photo_and_camera')}
        </Text>
        <Text style={[styles.text18Regular, localStyles.content_location]}>
          {i18n.t('instructions.profile_pictures_and_screenshots')}
        </Text>
        <Text style={[styles.text14Regular, localStyles.content]}>
          {i18n.t('instructions.optional_access')}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_login}
        style={[
          styles.button,
          localStyles.button,
          { backgroundColor: colors.btn_black },
        ]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton]}
        disabled={isLoading}
        loading={isLoading}>
        {i18n.t('instructions.login')}
      </Button>
    </View>
  );
};

export default InstructionsScreen;
