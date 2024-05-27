export const validatePassword = (password: string) => {
  const re =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$/;
  return re.test(password);
};

export const lengthInUtf8Bytes = (str: string) => {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  let result = 0;

  str.split('').forEach((item: string) => {
    const m = encodeURIComponent(item).match(/%[89ABab]/g);

    result = m ? result + m.length : result + 1;
  })

  return result;
}

export const validatePasswordTwo = (password: string) => {
  const re =
    /(?=.*[@$!%*?&0-9])[A-Za-z\d@$!%*?&0-9]/;
  return re.test(password);
};

export const validatePasswordThree = (password: string) => {
  for (let i = 0; i <= password.length - 3; i++) {
    const s1 = password[i];
    const s2 = password[i + 1];
    const s3 = password[i + 2];
    const s4 = password.charCodeAt(i);
    const s5 = password.charCodeAt(i + 1);
    const s6 = password.charCodeAt(i + 2);
    if (Math.abs(s4 - s5) === 1 && s4 - s5 === s5 - s6) {
      return false;
    }
    if (s1 == s2 && s1 == s3) {
      return false;
    }
  }

  return true;
}

export const validateName = (name: string) => {
  const re =
    /^.{8,16}$/
  return re.test(name);
};

