import i18n from 'app/i18n';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useRef, useState } from 'react';
import {
  modalActionSelector,
  authActionSelector,
  authStateSelector,
} from 'app/store';
import {
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  Text,
  Platform,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import styles from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditBodyInformationScreen: React.FC = () => {
  const { colors }: any = useTheme();
  const heightRef = useRef();

  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [isWeightError, setIsWeightError] = useState(false);
  const [isHeightError, setIsHeightError] = useState(false);

  const { setIsEditBodyInformationVisible, setIsEditBodyInformationFirstVisible } =
    useStoreActions(modalActionSelector);
  const { setLoadingVisible } = useStoreActions(modalActionSelector);
  const { user, isBodyInformationConfirm } =
    useStoreState(authStateSelector);
  const {
    bodyInformationConfirm,
    getProfile,
    setIsBodyInformationConfirm,
    setIsTheFirstUpdateInformation,
  } = useStoreActions(authActionSelector);

  const route = useRoute();
  const navigation = useNavigation();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 17,
          backgroundColor: colors.white,
        },
        input: {
          paddingHorizontal: 11,
          paddingVertical: Platform.OS == 'ios' ? 11.5 : 6,
          fontStyle: 'normal',
          lineHeight: 17,
          borderColor: colors.border_input_gray,
          color: colors.gold_500,
        },
        button: {
          marginTop: 18,
        },
        labelButton: {
          textTransform: 'capitalize',
          color: colors.white,
          lineHeight: 19,
          marginVertical: 0,
          paddingVertical: Platform.OS == 'ios' ? 10.5 : 8,
          marginTop: Platform.OS == 'ios' ? 0 : 5,
        },
        information: {
          marginBottom: 10,
        },
        title: {
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center',
          fontSize: 18,
        },
        description: {
          fontSize: 14,
          textAlign: 'center',
          marginHorizontal: 35,
        },
        textError: {
          color: colors.red,
          marginTop: 10,
          fontWeight: '400',
        },
      }),
    [],
  );

  useEffect(() => {
    _getData();
  }, [user?.height, user?.weight]);

  useEffect(() => {
    if (route?.params?.isUpdateBodyInformation) {
      setIsTheFirstUpdateInformation(true);
    }
  }, [route?.params?.isUpdateBodyInformation]);

  useEffect(() => {
    setIsBodyInformationConfirm(false);
    if (isBodyInformationConfirm) {
      if (route?.params?.isUpdateBodyInformation) {
        navigation.setParams({
          isUpdateBodyInformation: false,
        });
        setTimeout(() => {
          setIsEditBodyInformationFirstVisible(true);
        }, 500);
      } else {
        setIsEditBodyInformationVisible(true);
      }
    }
  }, [isBodyInformationConfirm]);

  const _getData = async () => {
    setLoadingVisible(true);
    await _getInformation();
    user?.weight && setWeight(`${(user?.weight).toString()} kg`);
    user?.height && setHeight(`${(user?.height).toString()} cm`);
    setLoadingVisible(false);
  };

  const _getInformation = async () => {
    await getProfile();
  };

  const _submit = async () => {
    if (!weight) {
      setIsWeightError(true);
    }
    if (!height) {
      setIsHeightError(true);
    }
    if (weight && height) {
      if (weight.includes('kg') && !height.includes('cm')) {
        await bodyInformationConfirm({
          weight: Number(
            weight.slice(0, weight.indexOf('kg')).replace(',', '.'),
          ),
          height: Number(height.replace(',', '.')),
        });
      } else if (height.includes('cm') && !weight.includes('kg')) {
        await bodyInformationConfirm({
          weight: Number(weight.replace(',', '.')),
          height: Number(
            height.slice(0, height.indexOf('cm')).replace(',', '.'),
          ),
        });
      } else if (weight.includes('kg') && height.includes('cm')) {
        await bodyInformationConfirm({
          weight: Number(
            weight.slice(0, weight.indexOf('kg')).replace(',', '.'),
          ),
          height: Number(
            height.slice(0, height.indexOf('cm')).replace(',', '.'),
          ),
        });
      } else {
        await bodyInformationConfirm({
          weight: Number(weight.replace(',', '.')),
          height: Number(height.replace(',', '.')),
        });
      }
    }
  };

  const _handleOnchangeWeight = (value: string) => {
    setWeight(value);
  };

  const _handleOnchangeHeight = (value: string) => {
    setHeight(value);
  };

  return (
    <View style={[localStyles.container]}>
      <StatusBar
        barStyle={'dark-content'}
        animated={true}
        backgroundColor={colors.splash}
      />
      {route?.params ? (
        <View
          style={{
            alignItems: 'center',
            marginTop: 33,
            marginBottom: 28,
            alignSelf: 'center',
          }}>
          <Text
            style={[
              styles.title,
              { textAlign: 'center', marginBottom: 14, fontWeight: 'bold' },
            ]}>
            {i18n.t('edit_bodyInformation.body_information')}
          </Text>
          <View>
            <Text style={[styles.text14Regular, { textAlign: 'center' }]}>
              {i18n.t('edit_bodyInformation.content_body_information_one')}
            </Text>
            <Text style={[styles.text14Regular, { textAlign: 'center' }]}>
              {i18n.t('edit_bodyInformation.content_body_information_two')}
            </Text>
          </View>
        </View>
      ) : null}
      <View>
        <Text style={[styles.text14Regular, localStyles.information]}>
          {i18n.t('body_info.weight')}
        </Text>
        <TextInput
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t('body_info.input_weight')}
          placeholderTextColor={colors.hint}
          style={[
            styles.input,
            styles.text14Regular,
            localStyles.input,
            {
              textAlign: weight ? 'center' : 'left',
              fontWeight: weight ? 'bold' : '400',
            },
          ]}
          defaultValue={weight}
          keyboardType="numeric"
          onChangeText={(value: string) => {
            _handleOnchangeWeight(value);
            setIsWeightError(false);
          }}
          onSubmitEditing={() => heightRef.current?.focus()}
          secureTextEntry={false}
          autoCapitalize="none"
          autoFocus={false}
        />
        {isWeightError && (
          <Text style={[styles.text14Regular, localStyles.textError]}>
            {i18n.t('edit_bodyInformation.error_enter')}
          </Text>
        )}
      </View>
      <View style={{ marginTop: 18 }}>
        <Text style={[styles.text14Regular, localStyles.information]}>
          {i18n.t('body_info.height')}
        </Text>
        <TextInput
          ref={heightRef}
          numberOfLines={1}
          returnKeyType="next"
          placeholder={i18n.t('body_info.input_height')}
          placeholderTextColor={colors.hint}
          style={[
            styles.input,
            styles.text14Regular,
            localStyles.input,
            {
              textAlign: height ? 'center' : 'left',
              fontWeight: height ? 'bold' : '400',
            },
          ]}
          defaultValue={height}
          keyboardType="numeric"
          onChangeText={(value: string) => {
            _handleOnchangeHeight(value);
            setIsHeightError(false);
          }}
          secureTextEntry={false}
          autoCapitalize="none"
          autoFocus={false}
        />
        {isHeightError && (
          <Text style={[styles.text14Regular, localStyles.textError]}>
            {i18n.t('edit_bodyInformation.error_enter')}
          </Text>
        )}
      </View>
      <Button
        onPress={_submit}
        mode="contained"
        style={[
          styles.button,
          localStyles.button,
          {
            backgroundColor: route?.params?.isUpdateBodyInformation
              ? colors.gold_500
              : colors.btn_black,
          },
        ]}
        uppercase={true}
        labelStyle={[
          styles.labelButton,
          localStyles.labelButton,
          { color: colors.white },
        ]}>
        {i18n.t('body_info.confirm')}
      </Button>
    </View>
  );
};

export default EditBodyInformationScreen;
