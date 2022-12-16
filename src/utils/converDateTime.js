export const getFullDate = (dateTime) => {
  const date = new Date(dateTime);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let dateText;
  let monthText;

  if (day < 10) {
    dateText = '0' + day.toString();
  } else {
    dateText = day.toString();
  }
  if (month < 10) {
    monthText = '0' + month.toString();
  } else {
    monthText = month.toString();
  }

  return dateText + '/' + monthText + '/' + year.toString();
};

export const getFullTime = (dateTime) => {
  const date = new Date(dateTime);

  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  let secondsText;
  let minutesText;
  let hoursText;

  if (seconds < 10) {
    secondsText = '0' + seconds.toString();
  } else {
    secondsText = seconds.toString();
  }

  if (minutes < 10) {
    minutesText = '0' + minutes.toString();
  } else {
    minutesText = minutes.toString();
  }

  if (hours < 10) {
    hoursText = '0' + hours.toString();
  } else {
    hoursText = hours.toString();
  }
  return hoursText + ':' + minutesText + ':' + secondsText;
};

export const getFullDateAndTime = (dateTime) => {
    const date = getFullDate(dateTime);
    const time = getFullTime(dateTime);

    return time + ' ' + date
}