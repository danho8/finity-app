import { useNavigation } from "@react-navigation/native";
import i18n from "app/i18n";
import NavigationService from "app/navigation/NavigationService";
import { authActionSelector, authStateSelector, modalActionSelector } from "app/store";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, TextInput, Text } from "react-native";
import { Button, useTheme } from "react-native-paper";

import styles from "../../styles";

const ExitMemberScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { setIsPasswordErrorVisible } = useStoreActions(modalActionSelector);
  const { leaveGroup, setIsLeaveGroup, setIsLeaveGroupError } = useStoreActions(authActionSelector);
  const { isLeaveGroup, isLeaveGroupError } = useStoreState(authStateSelector);
  const [errorPass, setErrorPass] = useState(false);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
          backgroundColor: colors.background,

        },
        wallText: {
          textAlign: 'center',
          fontSize: 20,
          lineHeight: 24,
        },
        button: {
          backgroundColor: colors.primary,
          marginTop: 30,
          marginBottom: 21,
        },
        labelButton: {
          textTransform: 'capitalize',
        },
      }),
    []
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      })
    });
  }, [navigation]);

  useEffect(() => {
    if (isLeaveGroup) {
      setIsLeaveGroup(false)
      NavigationService.navigate('ExitMemberSuccess');
    }

  }, [isLeaveGroup])

  useEffect(() => {
    if (isLeaveGroupError) {
      setIsLeaveGroupError(false)
      setIsPasswordErrorVisible(true);
    }
  }, [isLeaveGroupError])

  const _exitGroup = async () => {
    setIsLoading(true)
    if (password) {
      await leaveGroup({
        password
      })
    } else {
      if (!password) {
        setErrorPass(true);
      }
    }
    setIsLoading(false)
  }

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      <View style={{ paddingTop: "50%" }}>
        <Text style={[styles.text14Regular, localStyles.wallText]}>
          {i18n.t('exit_member.content_text')}
        </Text>
        <Text style={[styles.text14Regular, localStyles.wallText]}>
          {i18n.t('exit_member.content_texttow')}
        </Text>
      </View>
      <View style={{ marginTop: 26 }}>
        <TextInput
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t('exit_member.place_holder_password')}
          placeholderTextColor={colors.shadow}
          style={[
            styles.inputRegister,
            styles.text14Regular,
            { borderColor: errorPass ? colors.red : colors.border_gray },
          ]}
          keyboardType="default"
          onChangeText={(text: string) => {
            setPassword(text);
            setErrorPass(false);
          }}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
          autoFocus={false}
        />
        {errorPass && (
          <Text
            style={[
              styles.text14Regular,
              { color: colors.red, marginTop: 10 },
            ]}
          >
            {i18n.t('register.error_enter')}
          </Text>
        )}
      </View>
      <Button
        mode="contained"
        onPress={_exitGroup}
        style={[styles.button, localStyles.button, { backgroundColor: colors.primary }]}
        uppercase={true}
        labelStyle={[styles.labelButton, localStyles.labelButton, { color: colors.white }]}
        disabled={isLoading}
        loading={isLoading}
      >
        {i18n.t("exit_member.exit_member")}
      </Button>
    </View>
  );
}

export default ExitMemberScreen;
