import momentTz, {Duration} from 'moment-timezone';
import RNLocalize from 'react-native-localize';

var s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};
export const generateID = () => {
  return (
    'idElement' +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4()
  );
};

export const formatRemainingTime = (duration: Duration) => {
  const parseHours = parseInt(duration.asHours());
  const asHours = String(parseHours);

  const parseMinutes = parseInt(duration.asMinutes()) % 60;
  const asMinutes = String(parseMinutes);

  const parseSeconds = parseInt(duration.asSeconds()) % 60;
  const asSeconds = String(parseSeconds);

  if (
    asHours.length === 1 &&
    asMinutes.length === 1 &&
    asSeconds.length === 1
  ) {
    return `0${parseHours}:0${parseMinutes}:0${parseSeconds}`;
  } else if (
    asHours.length === 1 &&
    asMinutes.length === 1 &&
    asSeconds.length === 2
  ) {
    return `0${parseHours}:0${parseMinutes}:${parseSeconds}`;
  } else if (
    asHours.length === 1 &&
    asMinutes.length === 2 &&
    asSeconds.length === 2
  ) {
    return `0${parseHours}:${parseMinutes}:${parseSeconds}`;
  }
  return `${parseHours}:${parseMinutes}:${parseSeconds}`;
};

export const getCaloriesBySpeed = (speed: number) => {
  switch (true) {
    case speed <= 12.9:
      return 0.065;
    case speed > 12.9 && speed <= 16.1:
      return 0.0783;
    case speed > 16.1 && speed <= 19.3:
      return 0.0939;
    case speed > 19.3 && speed <= 22.5:
      return 0.1129;
    case speed > 22.5 && speed <= 24.1:
      return 0.1237;
    case speed > 24.1 && speed <= 25.7:
      return 0.1356;
    case speed > 25.7 && speed <= 27.4:
      return 0.1488;
    case speed > 27.4 && speed <= 29:
      return 0.1631;
    case speed > 29 && speed <= 30.6:
      return 0.1788;
    case speed > 30.6 && speed <= 32.2:
      return 0.1964;
    case speed > 32.2 && speed <= 33.8:
      return 0.215;
    case speed > 33.8 && speed <= 37:
      return 0.2586;
    case speed >= 37 && speed < 40.2:
      return 0.2586;
    case speed >= 40.2:
      return 0.3111;
    default:
      return 0.3111;
  }
};

export const getMiningByCalories = (calories: number) => {
  const kCal = calories;
  switch (true) {
    case kCal > 0 && kCal <= 10:
      return 1;
    case kCal > 10 && kCal <= 100:
      return 2;
    case kCal > 100 && kCal <= 101:
      return 3;
    case kCal > 101 && kCal <= 251:
      return 4;
    case kCal > 251 && kCal <= 501:
      return 5;
    case kCal > 501 && kCal <= 751:
      return 6;
    case kCal > 751 && kCal <= 1001:
      return 7;
    case kCal > 1001 && kCal <= 1201:
      return 8;
    case kCal > 1201 && kCal <= 1401:
      return 9;
    default:
      return 10;
  }
};

export const currentTime = momentTz
  .tz(new Date(), RNLocalize.getTimeZone())
  .clone()
  .tz('Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const pad = (num: number) => {
  return ('0' + num).slice(-2);
};

export const hhmmss = (secs: number) => {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
};
