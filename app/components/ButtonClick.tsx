import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Platform } from "react-native";

import styles from "app/styles";
import { useStoreActions } from 'easy-peasy';
import { modalActionSelector } from 'app/store';
import i18n from "app/i18n";

const ButtonClick: React.FC = () => {
    const { setIsSettingVisible, setIsPaymentVisible } = useStoreActions(modalActionSelector);
    const localStyles = React.useMemo(
        () =>
            StyleSheet.create({
                header: {
                    flex: 0,
                    marginBottom: 14,
                    marginLeft: 40,
                    marginTop: 15,
                },
                button: {
                    backgroundColor:'#FFF5F7',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: "center",
                    flexDirection: 'row',
                },
                btSetting: {
                    marginLeft: 10,
                },
                textButton: {
                    fontSize: 12,
                    fontWeight: '700'
                },
                iconBack: {
                    position: 'absolute',
                    width: 30,
                    height: 30,
                    top: '10%',
                    left: '25%'

                },
                iconUncheck: {
                    position: 'relative',
                    width: 40,
                    height: 40,
                    backgroundColor: "#FE7A91",
                    borderColor: '#000',
                    borderRadius: 20,
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 2,
                    borderBottomWidth: 3,
                    paddingHorizontal: 10,
                },
                centeredView: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22
                },
                modalView: {
                    width: 343,
                    backgroundColor: "white",
                    height: 287.29,
                    borderRadius: 20,
                    borderTopWidth: 2,
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderBottomWidth: 2,
                    padding: 35,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                },
                buttons: {
                    width: "94%",
                    height: 37,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                buttonOpen: {
                    backgroundColor: "#FE7A91",
                    borderColor: '#000',
                    borderRadius: 20,
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 2,
                    borderBottomWidth: 3,
                },
                buttonClose: {
                    backgroundColor: "#2196F3",
                },
                textStyle: {
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center"
                },
                modalText: {
                    marginBottom: 15,
                    textAlign: "center"
                }

            }),
        []
    );

    return (
        <View style={[localStyles.header, { alignItems: "center" }]}>
            <View style={[styles.row, { alignItems: "center", width: '100%', justifyContent: 'space-between' }]}>
                <View style={localStyles.buttons}>
                    <View style={localStyles.button}>
                        <TouchableOpacity
                            style={[localStyles.buttons, localStyles.buttonOpen]}
                            disabled={Platform?.OS == 'ios' ? true : false}
                            onPress={() => setIsPaymentVisible(true)}
                        >
                            <Text style={localStyles.textButton}>
                                {Platform?.OS == 'ios' ? 'EYEBER' : i18n.t('coin.button_click')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={localStyles.btSetting} onPress={() => setIsSettingVisible(true)}
                        >
                            <View style={[localStyles.iconUncheck]}>
                                <Image
                                    source={require('../assets/images/icon-setting.png')}
                                    style={[localStyles.iconBack]}
                                    resizeMode="cover"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ButtonClick;
