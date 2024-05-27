import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, Text, TouchableOpacity } from "react-native";
import { Button, useTheme } from "react-native-paper";
import styles from "../../styles";
import i18n from "app/i18n";
import { modalActionSelector } from "app/store";
import { useStoreActions } from "easy-peasy";
import NavigationService from "app/navigation/NavigationService";
import { useNavigation } from "@react-navigation/native";
import CheckBoxCustomTwo from "app/components/CheckboxCustomTwo";

const TermsOfServiceScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [isAllTerm, setIsAllTerm] = useState(false);
  const [isTermService, setIsTermService] = useState(false);
  const [isTermSecurity, setIsTermSecurity] = useState(false);
  const { setIsTermsVisible, setIsTypeTerms } = useStoreActions(modalActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'column',
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 5,
          backgroundColor: colors.background,
        },
        wrapperAgreeAll_: {
          borderBottomColor: colors.backgroundContent,
          borderBottomWidth: 1,
        },

        wrapperAgreeAll: {
          paddingTop: "9%",
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 14,
          paddingHorizontal: 16,
          backgroundColor: 'white'
        },
        checkbox: {
          position: "absolute",
          right: 1,
          paddingBottom: 6,
        },
        rowCheckbox: {
          flexDirection: "row",
          marginTop: 20
        },
        labelBox: {
          fontSize: 14,
          color: colors.text_content
        },
        labelBoxTerms: {
          fontSize: 14,
          fontWeight: '400',
          color: colors.text_content
        },
        button: {
          backgroundColor: colors.primary,
          marginTop: 60,
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
    if (isTermSecurity && isTermService) {
      setIsAllTerm(true);
    } else {
      setIsAllTerm(false);
    }
  }, [isTermSecurity, isTermService])

  const _handleChooseAll = () => {
    if (isAllTerm) {
      setIsAllTerm(false);
      setIsTermSecurity(false);
      setIsTermService(false);
    } else {
      setIsAllTerm(true);
      setIsTermSecurity(true);
      setIsTermService(true);
    }
  }

  const _next = () => {
    if (isAllTerm) {
      NavigationService.navigate('RegisterScreen');
    }
  }

  const _handleChooseTermService = (value: number) => {
    setIsTermsVisible(true);
    setIsTypeTerms(value);
  }

  const _handleIsTermService = () => {
    if (isTermService) {
      setIsTermService(false);
    } else {
      setIsTermService(true);
    }
  }
  const _handleChooseTermSecurity = (value: number) => {
    setIsTermsVisible(true);
    setIsTypeTerms(value);
  }

  const _handleIsTermSecurity = () => {
    if (isTermSecurity) {
      setIsTermSecurity(false);
    } else {
      setIsTermSecurity(true);
    }
  }

  return (
    <>
      <View style={[localStyles.wrapperAgreeAll]}>
        <Text style={[localStyles.labelBox]}>
          {i18n.t('terms_of_service.agree_to_terms')}
        </Text>
        <CheckBoxCustomTwo
          textContent={i18n.t('terms_of_service.agree_all')}
          value={isAllTerm}
          changeValue={_handleChooseAll}
          space={10}
          isReverse={true}
          labelStyle={[localStyles.labelBox]}
        />
      </View>
      <View style={[localStyles.wrapperAgreeAll_]} />
      <View style={[styles.container, localStyles.container]}>
        <StatusBar
          barStyle="dark-content"
          animated={true}
        />
        <View style={localStyles.rowCheckbox}>
          <TouchableOpacity onPress={() => _handleChooseTermService(1)} >
            <Text>
              {i18n.t('terms_of_service.term_service')}
            </Text>
          </TouchableOpacity>
          <CheckBoxCustomTwo
            value={isTermService}
            changeValue={_handleIsTermService}
            space={10}
            isReverse={true}
            style={[localStyles.checkbox]}
            labelStyle={[localStyles.labelBoxTerms]}
          />
        </View>
        <View style={localStyles.rowCheckbox}>
          <TouchableOpacity onPress={() => _handleChooseTermSecurity(2)} >
            <Text>
              {i18n.t('terms_of_service.term_security')}
            </Text>
          </TouchableOpacity>
          <CheckBoxCustomTwo
            value={isTermSecurity}
            changeValue={_handleIsTermSecurity}
            space={10}
            isReverse={true}
            style={[localStyles.checkbox]}
            labelStyle={[localStyles.labelBoxTerms]}
          />
        </View>
        <Button
          mode="contained"
          onPress={_next}
          style={[styles.button, localStyles.button]}
          uppercase={true}
          labelStyle={[styles.labelButton, localStyles.labelButton]}
          disabled={isLoading}
          loading={isLoading}
        >
          {i18n.t("terms_of_service.next")}
        </Button>
      </View>
    </>
  );
}

export default TermsOfServiceScreen;
