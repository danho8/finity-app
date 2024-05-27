import {logger, sentryTransport, consoleTransport} from 'react-native-logs';
import * as Sentry from '@sentry/react-native';

/*
 * Configure sentry
 */

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: 'debug',
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  async: true,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  enabled: true,
};

const config = {
  severity: 'debug',
  transport: sentryTransport,
  transportOptions: {
    SENTRY: Sentry,
  },
};
var log = logger.createLogger(__DEV__ ? defaultConfig : config);
export default log;
