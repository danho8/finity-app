import firestore from '@react-native-firebase/firestore';

export const cycleHistory = firestore().collection('cycle_history');
