import React from "react";
import { StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import styles from "app/styles";
import FastImage from "react-native-fast-image";

interface IProps {
  textContent?: string;
  value: boolean;
  changeValue: any;
  space?: number;
  isReverse?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CheckBoxCustomTwo: React.FC<IProps> = ({
  textContent,
  value,
  changeValue,
  space = 0,
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
        },
        iconCheck: {
          width: 17,
          height: 17,
          marginRight: isReverse ? 0 : space,
          marginLeft: isReverse ? space : 0,
        },
      }),
    []
  );

  return (
    <TouchableOpacity
      onPress={changeValue}
      style={[localStyles.wrapperCheckBox, style]}>
      <FastImage
        source={value ? (
          require('../assets/images/icon-checkbox-uncheck.png')
        ) : (
          require('../assets/images/icon-checkbox-check.png')
        )}
        style={localStyles.iconCheck}
        resizeMode={Platform.OS == 'ios' ? FastImage.resizeMode.cover : FastImage.resizeMode.contain}
      />
      <Text style={[styles.text14Regular, { color: colors.text_content }, labelStyle]}>
        {textContent}
      </Text>
    </TouchableOpacity>
  );
}

export default CheckBoxCustomTwo;
