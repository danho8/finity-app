import React from 'react';
import FastImage from 'react-native-fast-image';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from 'app/styles';

interface IProps {
  textContent: string;
  value: boolean;
  changeValue: any;
  space: number;
  isReverse?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CheckBoxCustomThree: React.FC<IProps> = ({
  textContent,
  value,
  changeValue,
  space,
  isReverse,
  style,
  labelStyle,
}: IProps) => {
  const { colors }: any = useTheme();

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        wrapperCheckBox: {
          flexDirection: isReverse ? 'row-reverse' : 'row',
          alignItems: 'center',
        },
        iconCheck: {
          width: 18,
          height: 18,
          marginRight: isReverse ? 0 : space,
          marginLeft: isReverse ? space : 0,
        },
      }),
    [],
  );

  return (
    <TouchableOpacity
      onPress={changeValue}
      style={[localStyles.wrapperCheckBox, style]}>
      {value ? (
        <FastImage
          source={require('../assets/images/icon-radio-check.png')}
          style={localStyles.iconCheck}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <FastImage
          source={require('../assets/images/icon-radio-uncheck.png')}
          style={localStyles.iconCheck}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      <Text
        style={[
          styles.text14Regular,
          { color: colors.text_content_black },
          labelStyle,
        ]}>
        {textContent}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBoxCustomThree;
