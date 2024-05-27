import React from 'react';
import { StyleSheet, Text, StyleProp, TextStyle, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from 'app/styles';

interface IProps {
    textError: string
    error?: any
    style?: StyleProp<TextStyle>;
}

const TextErrorCustom: React.FC<IProps> = ({ ...props }: IProps) => {
    const { colors }: any = useTheme();

    const localStyles = React.useMemo(
        () =>
            StyleSheet.create({
                txtError: {
                    color: colors.red
                }
            }),
        [],
    );

    return (
        <View>
            {props?.error && (
                <Text
                    style={[
                        styles.text14Regular, localStyles.txtError, props?.style
                    ]}>
                    {props?.textError}
                </Text>
            )}
        </View>
    );
};

export default TextErrorCustom;
