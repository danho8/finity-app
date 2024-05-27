import i18n from 'app/i18n';
import NavigationService from 'app/navigation/NavigationService';
import {
  authActionSelector,
  authStateSelector,
  modalActionSelector,
} from 'app/store';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import moment from 'moment-timezone';

import styles from '../../styles';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';

const EditProfileScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();
  const nickNameRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [idEmail, setIdEmail] = useState('');
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<any>(new Date());
  const { setIsEditAccountSuccessVisible } =
    useStoreActions(modalActionSelector);
  const [open, setOpen] = useState(false);
  const { user, isUpdatedUser } = useStoreState(authStateSelector);
  const { updatedUser, setIsUpdatedUser, getProfile } =
    useStoreActions(authActionSelector);
  const [errorFullName, setErrorFullName] = useState(false);
  const [errorNickName, setErrorNickName] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,
        },
        input: {
          paddingHorizontal: 11,
          fontStyle: 'normal',
          lineHeight: 17,
        },
        button: {
          backgroundColor: colors.primary,
          marginTop: 30,
          marginBottom: 21,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
        rightText: {
          textAlign: 'right',
          marginBottom: 20,
          color: colors.blue50,
        },
      }),
    [],
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      });
    });
  }, [navigation]);

  useEffect(() => {
    setIdEmail(user?.email);
    setName(user?.full_name);
    setNickName(user?.nick_name);
    user?.birthday && setDateOfBirth(new Date(user?.birthday));
  }, [user]);

  useEffect(() => {
    if (isUpdatedUser) {
      _editAccountSuccess();
    }
  }, [isUpdatedUser]);

  const _editAccount = async () => {
    setIsLoading(true);
    if (nickName && name) {
      await updatedUser({
        nick_name: nickName,
        full_name: name,
        birthday: dateOfBirth ? moment(dateOfBirth).format('YYYY/MM/DD') : '',
      });
    } else {
      if (!nickName) {
        setErrorNickName(true);
      }
      if (!name) {
        setErrorFullName(true);
      }
    }
    setIsLoading(false);
  };

  const _editAccountSuccess = async () => {
    setIsUpdatedUser(false);
    setIsEditAccountSuccessVisible(true);
    await getProfile();
  };

  const _exitMember = () => {
    NavigationService.navigate('ExitMemberScreen');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={[localStyles.container]}
        keyboardShouldPersistTaps='handled'
      >
        <StatusBar
          barStyle={'dark-content'}
          animated={true}
          backgroundColor={colors.splash}
        />
        <View pointerEvents="none" style={{ marginTop: 26 }}>
          <Text style={[styles.text14, { marginBottom: 10 }]}>
            {i18n.t('edit_profile.id_email')}
          </Text>
          <TextInput
            numberOfLines={1}
            returnKeyType="next"
            placeholder={i18n.t('register.place_holder_name')}
            placeholderTextColor={colors.shadow}
            style={[
              styles.inputRegister,
              localStyles.input,
              { backgroundColor: colors.white90 },
            ]}
            keyboardType="default"
            onChangeText={(text: string) => setIdEmail(text)}
            value={idEmail}
            secureTextEntry={false}
            autoCapitalize="none"
            autoFocus={false}
          />
        </View>
        <View style={{ marginTop: 26 }}>
          <Text style={[styles.text14, { marginBottom: 10 }]}>
            {i18n.t('edit_profile.name')}
          </Text>
          <TextInput
            numberOfLines={1}
            returnKeyType="next"
            placeholder={i18n.t('register.place_holder_nickname_tow')}
            placeholderTextColor={colors.shadow}
            style={[
              styles.inputRegister,
              styles.text14Regular,
              { borderColor: errorFullName ? colors.red : colors.border_gray },
            ]}
            onSubmitEditing={() => nickNameRef.current?.focus()}
            keyboardType="default"
            onChangeText={(text: string) => {
              setName(text);
              setErrorFullName(false);
            }}
            value={name}
            secureTextEntry={false}
            autoCapitalize="none"
            autoFocus={false}
          />
          {errorFullName && (
            <Text
              style={[
                styles.text14Regular,
                { color: colors.red, marginTop: 10 },
              ]}>
              {i18n.t('register.error_enter')}
            </Text>
          )}
        </View>
        <View style={{ marginTop: 26 }}>
          <Text style={[styles.text14, { marginBottom: 10 }]}>
            {i18n.t('edit_profile.nickname')}
          </Text>
          <TextInput
            ref={nickNameRef}
            numberOfLines={1}
            returnKeyType="next"
            placeholder={i18n.t('register.place_holder_nickname')}
            placeholderTextColor={colors.shadow}
            style={[
              styles.inputRegister,
              styles.text14Regular,
              { borderColor: errorNickName ? colors.red : colors.border_gray },
            ]}
            keyboardType="default"
            onChangeText={(text: string) => {
              setNickName(text);
              setErrorNickName(false);
            }}
            onSubmitEditing={() => setOpen(true)}
            value={nickName}
            secureTextEntry={false}
            autoCapitalize="none"
            autoFocus={false}
          />
          {errorNickName && (
            <Text
              style={[
                styles.text14Regular,
                { color: colors.red, marginTop: 10 },
              ]}>
              {i18n.t('register.error_enter')}
            </Text>
          )}
        </View>
        <View style={{ marginTop: 26 }}>
          <Text style={[styles.text14, { marginBottom: 10 }]}>
            {i18n.t('edit_profile.date_of_birth')}
          </Text>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={[[styles.inputRegister]]}>
            <Text style={[styles.text14Regular]}>
              {moment(dateOfBirth).format('YYYY/MM/DD') ||
                i18n.t('register.place_holder_date_of_birth')}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={open}
            date={dateOfBirth}
            mode={'date'}
            confirmText={i18n.t('register.confirm')}
            cancelText={i18n.t('register.cancel')}
            title={i18n.t('register.select_date')}
            minimumDate={new Date(1929, 12, 1)}
            maximumDate={new Date(moment().subtract(14, 'years'))}
            onConfirm={date => {
              setOpen(false);
              setDateOfBirth(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        <Button
          mode="contained"
          onPress={_editAccount}
          style={[styles.button, localStyles.button]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={false}>
          {i18n.t('setting.save')}
        </Button>
        <TouchableOpacity>
          <Text
            onPress={_exitMember}
            style={[styles.text16, localStyles.rightText]}>
            {i18n.t('edit_profile.exit_member')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default EditProfileScreen;
