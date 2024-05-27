import {IRegion} from 'app/service/interface/map.interface';
import {Region} from 'react-native-maps';

var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

export const formatMoney = (price: any) => {
  return price ? Intl.NumberFormat('en-US', {maximumFractionDigits: 10}).format(price) : 0;
};

export const formatMoneyTow = (price: any) => {
  return price ? Intl.NumberFormat('en-US').format(price.toFixed(3)) : 0;
};

export const formatMoneyUSD = (price: any) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 20,
  }).format(price);
};

export const _getLanguage = (language: string): string => {
  return language == 'kr' ? 'ko' : language;
};

export const _checkColorWhenConfirmTargetLocation = (
  targetLocation: IRegion | any,
  btn_black: string,
  primary: string,
): string => {
  return !targetLocation ? btn_black : primary;
};

export const _region = (
  targetLocation: IRegion | any,
  region: IRegion | any,
): Region => {
  console.log('targetLocation', targetLocation, region);
  return {
    latitude: targetLocation?.latitude || region.latitude,
    longitude: targetLocation?.longitude || region.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };
};

export const _disableCheckTargetLocation = (
  isLoading: boolean,
  targetLocation: any,
): boolean => {
  return isLoading || !targetLocation;
};

export const _abbreviateNumber = (number: number) => {
  if (!number) {
    return 0;
  }
  // what tier? (determines SI symbol)
  var tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) {
    return Math.floor(number * 1000) / 1000;
  }
  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);
  // scale the number
  var scaled = number / scale;
  // format number and add suffix

  return Math.floor(scaled * 1000) / 1000 + suffix;
};
