import i18n from "app/i18n";
import { modalActionSelector, modalStateSelector } from "app/store";
import styles from "app/styles";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Dialog, useTheme } from "react-native-paper";
import RenderHTML from "react-native-render-html";

const TermsModel: React.FC = () => {
  const { colors }: any = useTheme();
  const { setIsTermsVisible, setIsTypeTerms } = useStoreActions(modalActionSelector);
  const { isTermsVisible, isTypeTerms } = useStoreState(modalStateSelector);
  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingVertical: 34,
          backgroundColor: colors.background,
          height: 560,
          borderRadius: 12,
        },
        textContent: {
          lineHeight: 22,
        },
        title: {
          marginBottom: 15,
          alignSelf: 'center',
          fontWeight: 'bold'
        },
        wrapperIconClose: {
          position: 'absolute',
          top: 16,
          right: 12,
          zIndex: 1,
        },
        iconClose: {
          marginLeft: 5,
          marginTop: 0,
          width: 18,
          height: 18,
        },
        wrapperContent: {
          paddingHorizontal: 25,
        },
        textTitle: {
          color: colors.blue,
          marginVertical: 10
        },
      }),
    []
  );
  const titleOne = () => (
    <>
      <Text style={[styles.text16, localStyles.title]}>
        {
          isTypeTerms == 1
            ? i18n.t('terms_of_service.terms_of_service')
            : i18n.t('terms_of_service.terms_of_security')
        }
      </Text>
    </>
  )
  const titleTow = () => (
    <>
      <Text style={[styles.text16, localStyles.title]}>
        {
          isTypeTerms == 3
            ? i18n.t('profile.terms_of_use_payment_and_item')
            : i18n.t('terms_of_service.terms_of_security')
        }
      </Text>
    </>
  )
  const contentOne = () => (
    <RenderHTML
      source={{
        html: `
              ${isTypeTerms == 1
            ? i18n.t('terms_of_service.content_term_service')
            : i18n.t('terms_of_service.content_term_security')
          }`,
      }}
    />
  )

  const contentTow = () => (
    <RenderHTML
      source={{
        html: `
              ${isTypeTerms == 3
            ? i18n.t('profile.content_term_mobile')
            : i18n.t('terms_of_service.content_term_security')
          }`,
      }}
    />
  )
  return (
    <Dialog
      visible={isTermsVisible}
      onDismiss={() => {
        setIsTermsVisible(false);
        setIsTypeTerms(1);
      }}
      style={[localStyles.container]}
    >
      <View style={[localStyles.wrapperIconClose]}>
        <TouchableOpacity onPress={() => setIsTermsVisible(false)}>
          <Image
            source={require('../../../assets/images/icon-close-black-model.png')}
            style={localStyles.iconClose}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.text16, localStyles.title]}>
        {
          isTypeTerms == 1
            ? <>{titleOne()}</>
            : <>{titleTow()}</>
        }
      </Text>
      <ScrollView style={[localStyles.wrapperContent]}>
        <View>
          {
            isTypeTerms == 1
              ? <>{contentOne()}</>
              : <>{contentTow()}</>
          }
        </View>
      </ScrollView>
    </Dialog>
  );
}
export default TermsModel;
