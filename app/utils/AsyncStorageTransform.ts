import { createTransform } from "easy-peasy";
import { isEmpty } from "lodash";
export const AsyncStorageTransform = createTransform(
  (inboundState) => {
    return isEmpty(inboundState) ? "" : JSON.stringify(inboundState);
  },
  (outboundState) => {
    return isEmpty(outboundState) ? {} : JSON.parse(outboundState);
  }
);
