export const formatPhoneHidden = (phone: string) => {
  const firstPhone = phone?.split('')?.splice(0, 3)?.join('');

  const lastPhone = phone?.split('')?.splice(phone?.split('')?.length - 4, phone?.split('')?.length)?.join('');

  return `(${firstPhone}-****-${lastPhone})`;
}