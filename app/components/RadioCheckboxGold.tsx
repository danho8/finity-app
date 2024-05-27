import React from 'react';
import {
  StyleSheet,
  Image,
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

const RadioCheckboxGold: React.FC<IProps> = ({
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
        <Image
          source={require('../assets/images/icon-checkbox-gold.png')}
          style={localStyles.iconCheck}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={require('../assets/images/icon-radio-uncheck.png')}
          style={localStyles.iconCheck}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.text14Regular, { color: colors.black }, labelStyle]}>
        {textContent}
      </Text>
    </TouchableOpacity>
  );
};

export default RadioCheckboxGold;
