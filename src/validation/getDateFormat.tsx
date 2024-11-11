// get date as special format
const getDateFormat = (date: Date) => {
  const dateTime = new Date(date);

  return (
    dateTime.getMonth() +
    1 +
    "/" +
    dateTime.getDate() +
    "/" +
    dateTime.getFullYear() +
    " " +
    dateTime.getHours() +
    ":" +
    dateTime.getMinutes()
  );
};

export default getDateFormat;
