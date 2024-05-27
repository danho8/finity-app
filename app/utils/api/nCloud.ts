import { BASE_URL_N_CLOUD } from 'app/config/api-config';
import { NCP_KEY, NCP_SECRET_KEY, SERVICE_ID } from 'app/config/constant-config';
import axios from 'axios';
import { storage } from '../../store/storage';
import CryptoJS from "crypto-js";

// https://github.com/brix/crypto-js/issues/303

const date = Date.now().toString();
const uri = SERVICE_ID; // Service id
const secretKey = NCP_SECRET_KEY;// Secret Key
const accessKey = NCP_KEY;// Access Key
const method = "POST";
const space = " ";
const newLine = "\n";
const url = `/sms/v2/services/${uri}/messages`;
const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
hmac.update(method);
hmac.update(space);
hmac.update(url);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);
const hash = hmac.finalize();
const signature = hash.toString(CryptoJS.enc.Base64);

const NCloud = axios.create({
  baseURL: `${BASE_URL_N_CLOUD}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-ncp-apigw-timestamp': date,
    'x-ncp-iam-access-key': accessKey,
    'x-ncp-apigw-signature-v2': signature,
  },
});

NCloud.interceptors.request.use(
  async config => {
    let token;
    try {
      token = await storage.getItem('token');
    } catch (e) {}
    if (token !== null) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// after send request
NCloud.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default NCloud;
