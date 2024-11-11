const chatDate = (date: Date) => {
  const hour = new Date(date).getHours();
  const minute = new Date(date).getMinutes();

  return hour > 12
    ? Number(hour - 12) + ":" + minute + " PM"
    : hour + ":" + minute + " AM";
};

export default chatDate;
