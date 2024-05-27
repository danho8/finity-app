//Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const replaceAll = (str: string, match: string, replacement: string) => {
   return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=> replacement);
}