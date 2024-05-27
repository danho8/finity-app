export const getTypeImage = (linkImage: string) => {
  const listSplit = linkImage?.split('.');

  return listSplit[listSplit.length - 1];
}