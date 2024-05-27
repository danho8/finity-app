import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async getItem(key: string) {
    return JSON.parse((await AsyncStorage.getItem(key)) as any);
  },
  setItem(key: string, data: any) {
    AsyncStorage.setItem(key, JSON.stringify(data));
  },
  removeItem(key: string) {
    AsyncStorage.removeItem(key);
  },
};
