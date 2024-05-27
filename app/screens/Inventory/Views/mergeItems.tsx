import i18n from "app/i18n";
import { modalActionSelector } from "app/store";
import styles from "app/styles";
import { useStoreActions } from "easy-peasy";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface IProps {
  setShowIsMergeItems: any,
  isMergeItems: boolean,
}

const MergeItems: React.FC<IProps> = ({ setShowIsMergeItems, isMergeItems }: IProps) => {
  const { colors }: any = useTheme();

  const { setMergeItemsVisible } = useStoreActions(modalActionSelector);

  const localStyles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#EDF7FF',
          paddingVertical: 19,
          paddingHorizontal: 16,
        },
        button: {
          borderRadius: 16,
          width: (Dimensions.get('screen').width - 45)/2,
        },
      }),
    []
  );

  return (
    <View style={[localStyles.container]}>
      <Button
        mode="contained"
        onPress={() => setShowIsMergeItems(false)}
        style={[styles.button, localStyles.button, { backgroundColor: colors.gray_500 }]}
        uppercase={true}
        labelStyle={[styles.labelButton, { textTransform: 'capitalize' }]}
        disabled={false}
        loading={false}
      >
        {i18n.t("inventory.cancel")}
      </Button>
      <Button
        mode="contained"
        onPress={() => setMergeItemsVisible(true)}
        style={[
          styles.button,
          localStyles.button,
          { backgroundColor: !isMergeItems ? colors.gray_500 : colors.accent },
        ]}
        uppercase={true}
        labelStyle={[styles.labelButton, { textTransform: 'capitalize' }]}
        disabled={!isMergeItems}
        loading={false}
      >
        {i18n.t("inventory.merge_items")}
      </Button>
    </View>
  );
}

export default MergeItems;
