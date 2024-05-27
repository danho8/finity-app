import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { authActionSelector, authStateSelector, modalActionSelector } from "app/store";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect } from "react";
import { launchImageLibrary } from 'react-native-image-picker';
import { StyleSheet, View, StatusBar, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Button, useTheme } from "react-native-paper";
import styles from "../../styles";
import { generateID } from "app/utils/generator";
import { getTypeImage } from "app/utils/formatImage";
import { useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
const ProfileScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const isFocused = useIsFocused();
  const { setIsLogoutVisible, setIsTermsVisible, setIsTypeTerms } = useStoreActions(modalActionSelector);
  const { uploadImage, getProfile, setIsCheckMyPage } = useStoreActions(authActionSelector);
  const { user } = useStoreState(authStateSelector);
  const plastformOs = Platform.OS == 'ios';
  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          backgroundColor: colors.background,
        },
        wrapperAll: {
          borderBottomColor: colors.backgroundContent,
          width: "100%",
          borderBottomWidth: 1,
          marginBottom: 20,
        },
        wrapperPadding: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 22,
          paddingHorizontal: 16
        },
        wrapperAvatar: {
          width: 140,
          height: 140,
          overflow: 'hidden',
          borderRadius: 100,
          alignSelf: 'center',
        },
        wrapperIcon: {
          width: 140,
          height: 140,
          borderRadius: 100,
          position: 'relative',
          alignSelf: 'center',
        },
        iconAvatar: {
          width: 140,
          height: 140,
          position: 'absolute',
        },
        wrapperEdit: {
          position: 'absolute',
          zIndex: 10,
          elevation: 10,
          bottom: 0,
          width: 110,
          alignSelf: 'center',
          backgroundColor: colors.rgb_black_light,
        },
        textEdit: {
          alignSelf: 'center',
          color: colors.white,
          paddingVertical: 5,
        },
        textName: {
          color: colors.primary,
          textAlign: 'center',
          marginTop: 14,
          marginBottom: 39,
        },
        textUser: {
          color: colors.blue,
          textAlign: 'right'
        },
        wrapperTextTitle: {
          marginVertical: 25
        },
        textCart: {
          color: colors.black,
          marginBottom: 13,
          paddingHorizontal: 16
        },
        labelButton: {
          textTransform: 'none',
        },
        button: {
          marginBottom: plastformOs ? 6 : 8
        },
        buttonLogout: {
          backgroundColor: colors.primary,
          marginBottom: 43

        }
      }),
    []
  );
  useEffect(() => {
    setIsCheckMyPage(isFocused);
  }, [isFocused])
  const _changePassword = () => {
    NavigationService.navigate('ResetPasswordScreen',
      { isChangePassword: true });
  }
  const _detailService = () => {
    setIsTermsVisible(true);
    setIsTypeTerms(1);
  }
  const _privacyPolicy = () => {
    setIsTermsVisible(true);
    setIsTypeTerms(2);
  }
  const _privacyServicePolicy = () => {
    setIsTermsVisible(true);
    setIsTypeTerms(3);
  }
  const _editAccount = () => NavigationService.navigate("EditProfileScreen");
  const _editBodyInformation = () => NavigationService.navigate('EditBodyInformationScreen');
  const _notification = () => NavigationService.navigate('NotificationScreen');
  const _QAndA = () => NavigationService.navigate('QAndAScreen');
  const _ridingHistory = () => NavigationService.navigate('RidingHistoryScreen');
  const _logout = () => setIsLogoutVisible(true);
  const _handleUploadImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      selectionLimit: 1,
      videoQuality: 'low',
    });
    const data = new FormData();
    data.append(
      'avatar',
      {
        name: `${generateID()}.${getTypeImage(result?.assets[0]?.uri)}`,
        type: `image/${getTypeImage(result?.assets[0]?.uri)}`,
        uri: Platform.OS === 'ios'
          ? result?.assets[0]?.uri.replace('file://', '')
          : result?.assets[0]?.uri,
      }
    );
    await uploadImage(data);
    await getProfile();
  }
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={[localStyles.container]}
    >
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <View style={[localStyles.wrapperAvatar]}>
        <View style={[localStyles.wrapperIcon]}>
          <FastImage
            style={localStyles.iconAvatar}
            source={{
              uri: user?.avatar || user?.uri,
              headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity onPress={_handleUploadImage} style={[localStyles.wrapperEdit]}>
            <Text style={[styles.text12Regular, localStyles.textEdit]}>
              {i18n.t('profile.edit')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.text16, localStyles.textName]}>
        {user?.full_name}
      </Text>
      <View style={[localStyles.wrapperAll, localStyles.wrapperTextTitle, { marginTop: 0 }]}>
        <Text style={[styles.text16Bold, localStyles.textCart]}>
          {i18n.t('profile.info_account')}
        </Text>
      </View>
      <View style={[localStyles.wrapperPadding]}>
        <View style={{ marginRight: 10 }}>
          <Text style={[styles.text16, { color: colors.black }]}>
            {i18n.t('profile.id_email_label')}
          </Text>
        </View>
        <View style={{ flex: 10 }}>
          <Text numberOfLines={1} style={[styles.text16, localStyles.textUser]}>
            {user?.email}
          </Text>
        </View>
      </View>
      <View style={[localStyles.wrapperPadding, { marginBottom: 25 }]}>
        <View style={{ marginRight: 10 }}>
          <Text style={[styles.text16, { color: colors.black }]}>
            {i18n.t('profile.name')}
          </Text>
        </View>
        <View style={{ flex: 10 }}>
          <Text numberOfLines={1} style={[styles.text16, localStyles.textUser]}>
            {user?.full_name}
          </Text>
        </View>
      </View>
      <Button
        mode="contained"
        onPress={_editAccount}
        style={[styles.buttonBorder10, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.edit_account"))}`}
      />
      <Button
        mode="contained"
        onPress={_editBodyInformation}
        style={[styles.buttonBorder10, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.edit_body"))}`}
      />
      <Button
        mode="contained"
        onPress={_ridingHistory}
        style={[styles.buttonBorder10, { marginBottom: 0, }]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.cycling_history"))}`}
      />
      <View style={[localStyles.wrapperAll, localStyles.wrapperTextTitle]}>
        <Text style={[styles.text16Bold, localStyles.textCart]}>
          {i18n.t("profile.change_password")}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_changePassword}
        style={[styles.buttonBorder10, { marginBottom: 0, }]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.change_password"))}`}
      />
      <View style={[localStyles.wrapperAll, localStyles.wrapperTextTitle]}>
        <Text style={[styles.text16Bold, localStyles.textCart]}>
          {i18n.t('profile.terms')}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_detailService}
        style={[styles.buttonBorder10, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.detail_service"))}`}
      />
      <Button
        mode="contained"
        onPress={_privacyPolicy}
        style={[styles.buttonBorder10, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.privacy_policy"))}`}
      />
      <Button
        mode="contained"
        onPress={_privacyServicePolicy}
        style={[styles.buttonBorder10]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.terms_of_use_payment_and_item"))}`}
      />
      <View style={[localStyles.wrapperAll, localStyles.wrapperTextTitle]}>
        <Text style={[styles.text16Bold, localStyles.textCart]}>
          {i18n.t('profile.service_center')}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={_notification}
        style={[styles.buttonBorder10, localStyles.button]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.notification"))}`}
      />
      <Button
        mode="contained"
        onPress={_QAndA}
        style={[styles.buttonBorder10, { marginBottom: 0 }]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton]}
        children={`${i18n.t(i18n.t("profile.FAQ"))}`}
      />
      <View style={[localStyles.wrapperAll, { marginTop: 20 }]} />
      <Button
        mode="contained"
        onPress={_logout}
        style={[styles.buttonBorder10, localStyles.buttonLogout]}
        uppercase={true}
        labelStyle={[styles.labelButton10, localStyles.labelButton, { color: colors.white, fontWeight: 'bold' }]}
        children={`${i18n.t(i18n.t("profile.logout"))}`}
      />
    </ScrollView >
  );
}
export default ProfileScreen;
