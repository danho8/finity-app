import i18n from "app/i18n";
import { authActionSelector, homeActionSelector, modalActionSelector, modalStateSelector, shopActionSelector } from "app/store";
import styles from "app/styles";
import { _abbreviateNumber, formatMoney } from "app/utils/formatString";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";

const PaymentCoin: React.FC = () => {
    const { colors }: any = useTheme();

    const [coinAmount, setCoinAmount] = useState(0);
    const { setIsPaymentVisible } = useStoreActions(modalActionSelector);
    const { isPaymentVisible } = useStoreState(modalStateSelector);
    const { setCoin } = useStoreActions(shopActionSelector);
    const { reward, confirmReward } = useStoreActions(homeActionSelector);
    const { getWallets } = useStoreActions(authActionSelector);

    const localStyles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    paddingVertical: 34,
                    paddingHorizontal: 16,
                    backgroundColor: colors.background,
                },
                title: {
                    marginBottom: 23,
                    alignSelf: 'center',
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
                },
                button: {
                    width: (Dimensions.get('screen').width - 140) / 2,
                    borderRadius: 10,
                    marginTop: 38,
                },
                labelButton: {
                    textTransform: 'capitalize',
                },
                wrapperInfo: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 21,
                },
                wrapperIconBitcoin: {
                    width: 73,
                    height: 73,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.backgroundContent,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                item: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    alignSelf: 'center',
                    width: Dimensions.get('window').width - 40,
                },
                iconBitcoin: {
                    width: 73,
                    height: 73,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.backgroundContent,
                },
                iconCoin: {
                    width: 20,
                    height: 20,
                    marginRight: 10,
                },
                checkbox: {
                    marginTop: 19,
                },
                wrapperActions: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 21,
                },
                wrapperAction: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 21,
                },
                tinyLogo: {
                    width: 32.5,
                    height: 32.5,
                },
                coinPayment: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                },
                coinPolygon: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                },
                coinTitle: {
                    fontSize: 16,
                    fontWeight: '700',
                    marginLeft: 15,

                }
            }),
        []
    );

    useEffect(() => {
        getSumReward();
    }, [])

    const getSumReward = async () => {
        const resSumReward = await reward();
        setCoinAmount(resSumReward?.data?.total_mining);
    }

    const _cancel = async () => {
        setIsPaymentVisible(false);
        setCoin(false);
    }

    const _submit = async () => {
        await confirmReward({
            receive: 1,
        });
        await getWallets();
        _cancel();
    }

    return (
        <Dialog
            visible={isPaymentVisible}
            onDismiss={_cancel}
            dismissable={true}
            style={[localStyles.container]}
        >
            <View style={[localStyles.wrapperIconClose]}>
                <TouchableOpacity onPress={_cancel}>
                    <Image
                        source={require('../../../assets/images/icon-close.png')}
                        style={localStyles.iconClose}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>
            <Text style={[styles.title, localStyles.title]}>
                {i18n.t("coin.coin_Payment")}
            </Text>
            <View style={[localStyles.item]}>
                <View style={[localStyles.wrapperInfo]}>
                    <Text style={[styles.text14Regular, { textAlign: 'center', marginBottom: 21, color: colors.primary }]}>
                        {i18n.t('coin.coin_PaymentTitle')}
                    </Text>
                </View>
            </View>
            <View style={localStyles.coinPayment}>
                <View style={localStyles.coinPolygon} >
                    <Image
                        source={require('../../../assets/images/icon-coin30.png')}
                        style={localStyles.tinyLogo} />
                    <Text style={[localStyles.coinTitle, { color: colors.text_content }]} >
                        {i18n.t('CFT')}
                    </Text>
                </View>
                <View>
                    <Text style={localStyles.coinTitle}>
                        <Text style={{ color: colors.primary }}>
                            {Number(coinAmount) < 1000
                                ? formatMoney(coinAmount)
                                : _abbreviateNumber(Number(coinAmount))}
                        </Text> {i18n.t('CFT')}
                    </Text>
                </View>
            </View>
            <View style={[localStyles.wrapperAction]}>
                <Button
                    mode="contained"
                    onPress={_cancel}
                    style={[styles.button, localStyles.button, { backgroundColor: colors.primary }]}
                    uppercase={true}
                    labelStyle={[styles.labelButton, localStyles.labelButton]}
                    disabled={false}
                    loading={false}
                    children={`${i18n.t('coin.coin_Cancellation')}`}
                />
                <Button
                    mode="contained"
                    onPress={_submit}
                    style={[styles.button, localStyles.button, { backgroundColor: colors.btn_black }]}
                    uppercase={true}
                    labelStyle={[styles.labelButton, localStyles.labelButton]}
                    disabled={false}
                    loading={false}
                    children={`${i18n.t('coin.coin_Confirm')}`}
                />
            </View>
        </Dialog>
    );
}


export default PaymentCoin;
