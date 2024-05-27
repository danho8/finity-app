export const randomCode = () => {
  const random1 = Math.round((Math.random() * 10));
  const random2 = Math.round((Math.random() * 10));
  const random3 = Math.round((Math.random() * 10));
  const random4 = Math.round((Math.random() * 10));
  const random5 = Math.round((Math.random() * 10));
  const random6 = Math.round((Math.random() * 10));

  return `${random1}${random2}${random3}${random4}${random5}${random6}`;
}
