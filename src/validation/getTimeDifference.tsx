// get time different as second
export const getTimeDifference = (firstDate: Date, secondDate: Date) => {
  const firstDateTime = new Date(firstDate);
  const secondDateTime = new Date(secondDate);

  return Math.round((Number(secondDateTime) - Number(firstDateTime)) / 1000);
};

export const getFestivalTimeDifference = (beginDate: Date, endDate: Date) => {
  const beginDateTime = new Date(beginDate);
  const endDateTime = new Date(endDate);
  const currentDateTime = new Date();

  if (Number(currentDateTime) > Number(endDateTime)) {
    return "schedule-status-view-end";
  } else if (
    Number(currentDateTime) < Number(endDateTime) &&
    Number(currentDateTime) > Number(beginDateTime)
  ) {
    return "schedule-status-view-progressing";
  } else if (Number(currentDateTime) < Number(beginDateTime)) {
    return "schedule-status-view-upcoming";
  } else {
    return "schedule-status-view-upcoming";
  }
};

export const getFestivalTimeStatus = (beginDate: Date, endDate: Date) => {
  const beginDateTime = new Date(beginDate);
  const endDateTime = new Date(endDate);
  const currentDateTime = new Date();

  if (Number(currentDateTime) > Number(endDateTime)) {
    return "Ended";
  } else if (
    Number(currentDateTime) < Number(endDateTime) &&
    Number(currentDateTime) > Number(beginDateTime)
  ) {
    return "Started";
  } else if (Number(currentDateTime) < Number(beginDateTime)) {
    return "Upcoming";
  } else {
    return "Upcoming";
  }
};

export const getFestivalMonth = (bDate: Date, eDate: Date) => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const beginDate = new Date(bDate);
  const endDate = new Date(eDate);

  if (beginDate.getFullYear() === endDate.getFullYear()) {
    if (beginDate.getMonth() === endDate.getMonth()) {
      if (beginDate.getDate() === endDate.getDate()) {
        return (
          weekday[beginDate.getDay()] +
          ", " +
          month[beginDate.getMonth()] +
          " " +
          beginDate.getDate() +
          ", " +
          beginDate.getFullYear()
        );
      } else {
        return (
          beginDate.getDate() +
          " - " +
          endDate.getDate() +
          ", " +
          month[beginDate.getMonth()] +
          ", " +
          beginDate.getFullYear()
        );
      }
    }
  }
};

export const getFestivalTime = (bDate: Date, eDate: Date) => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const beginDate = new Date(bDate);
  const endDate = new Date(eDate);

  if (beginDate.getFullYear() === endDate.getFullYear()) {
    if (beginDate.getMonth() === endDate.getMonth()) {
      if (beginDate.getDate() === endDate.getDate()) {
        return (
          (beginDate.getHours() > 12
            ? (Number(beginDate.getHours() - 12) > 10
                ? Number(beginDate.getHours() - 12)
                : "0" + Number(beginDate.getHours() - 12)) +
              ":" +
              (beginDate.getMinutes() > 10
                ? beginDate.getMinutes()
                : "0" + beginDate.getMinutes()) +
              " PM"
            : (beginDate.getHours() > 10
                ? beginDate.getHours()
                : "0" + beginDate.getHours()) +
              ":" +
              (beginDate.getMinutes() > 10
                ? beginDate.getMinutes()
                : "0" + beginDate.getMinutes()) +
              " AM") +
          " - " +
          (endDate.getHours() > 12
            ? (Number(endDate.getHours() - 12) > 10
                ? Number(endDate.getHours() - 12)
                : "0" + Number(endDate.getHours() - 12)) +
              ":" +
              (endDate.getMinutes() > 10
                ? endDate.getMinutes()
                : "0" + endDate.getMinutes()) +
              " PM"
            : (endDate.getHours() > 10
                ? endDate.getHours()
                : "0" + endDate.getHours()) +
              ":" +
              (endDate.getMinutes() > 10
                ? endDate.getMinutes()
                : "0" + endDate.getMinutes()) +
              " AM")
        );
      } else {
        return (
          weekday[beginDate.getDay()] +
          " " +
          (beginDate.getHours() > 12
            ? (Number(beginDate.getHours() - 12) > 10
                ? Number(beginDate.getHours() - 12)
                : "0" + Number(beginDate.getHours() - 12)) +
              ":" +
              (beginDate.getMinutes() > 10
                ? beginDate.getMinutes()
                : "0" + beginDate.getMinutes()) +
              " PM"
            : (beginDate.getHours() > 10
                ? beginDate.getHours()
                : "0" + beginDate.getHours()) +
              ":" +
              (beginDate.getMinutes() > 10
                ? beginDate.getMinutes()
                : "0" + beginDate.getMinutes()) +
              " AM") +
          " - " +
          weekday[endDate.getDay()] +
          " " +
          (endDate.getHours() > 12
            ? (Number(endDate.getHours() - 12) > 10
                ? Number(endDate.getHours() - 12)
                : "0" + Number(endDate.getHours() - 12)) +
              ":" +
              (endDate.getMinutes() > 10
                ? endDate.getMinutes()
                : "0" + endDate.getMinutes()) +
              " PM"
            : (endDate.getHours() > 10
                ? endDate.getHours()
                : "0" + endDate.getHours()) +
              ":" +
              (endDate.getMinutes() > 10
                ? endDate.getMinutes()
                : "0" + endDate.getMinutes()) +
              " AM")
        );
      }
    }
  }
};
