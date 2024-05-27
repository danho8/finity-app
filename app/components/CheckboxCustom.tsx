import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from 'app/styles';
import FastImage from 'react-native-fast-image';

interface IProps {
  textContent: string;
  value: boolean;
  changeValue: any;
  space: number;
  isReverse?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CheckBoxCustom: React.FC<IProps> = ({
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
          textAlign: 'center',
          marginRight: isReverse ? 0 : space,
          marginLeft: isReverse ? space : 0,
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
      <FastImage
        source={value ? (
          require('../assets/images/icon-radio-check.png')
        ) : (
          require('../assets/images/icon-radio-uncheck.png')
        )}
        style={localStyles.iconCheck}
        resizeMode={Platform.OS == 'ios' ? FastImage.resizeMode.cover : FastImage.resizeMode.contain}
      />
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

export default CheckBoxCustom;
