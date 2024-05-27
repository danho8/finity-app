import i18n from "app/i18n";
import { modalActionSelector, modalStateSelector } from "app/store";
import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Dialog, useTheme } from "react-native-paper";
import RenderHTML from "react-native-render-html";

const QuerymartModel: React.FC = () => {
    const { colors }: any = useTheme();
    const { setIsQueryMartVisible } = useStoreActions(modalActionSelector);
    const { isQueryMartVisible } = useStoreState(modalStateSelector);
    const localStyles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    paddingTop: 34,
                    paddingBottom: 10,
                    backgroundColor: colors.background,
                    height: 560,
                    borderRadius: 12,
                    padding: 5
                },
                wrapperIconClose: {
                    position: 'absolute',
                    top: 16,
                    right: 12,
                    zIndex: 1,
                },
                iconClose: {
                    width: 18,
                    height: 18,
                    marginRight: 2
                },
                wrapperContent: {
                    marginHorizontal: 10,
                    alignSelf: 'center',
                    marginTop: 10
                },

            }),
        []
    );
    const _confirm = () => {
        setIsQueryMartVisible(false);
    }

    return (
        <Dialog
            visible={isQueryMartVisible}
            onDismiss={_confirm}
            dismissable={true}
            style={[localStyles.container]}>
            <View style={[localStyles.wrapperIconClose]}>
                <TouchableOpacity onPress={_confirm}>
                    <Image
                        source={require('../../../assets/images/icon-close.png')}
                        style={localStyles.iconClose}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>
            <ScrollView style={[localStyles.wrapperContent]}>
                <RenderHTML
                    source={{
                        html: ` ${i18n.t('polygon_coin.message_requesting_withdrawalTow')} `,
                    }}
                />
            </ScrollView>
        </Dialog>
    );
}

export default QuerymartModel;