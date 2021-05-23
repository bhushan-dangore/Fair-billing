const getTimeInSeconds = (_time) => {
  const baseTime = _time.split(":");
  const date = new Date(0);
  date.setSeconds(Number(baseTime[2]));
  date.setMinutes(date.getMinutes() + Number(baseTime[1]));
  date.setHours(date.getHours() + Number(baseTime[0]));
  return Number(date.getTime() / 1000);
};

const getTimeDifference = (_end, _start) => {
  const start = _start.split(":");
  const end = _end.split(":");

  const date1 = new Date(0, 0, 0, start[0], start[1], start[2]);
  const date2 = new Date(0, 0, 0, end[0], end[1], end[2]);

  return new Date(date1 - date2).toISOString().split("T")[1].split(".")[0];
};

const addTime = (_baseTime, _addTime) => {
  const baseTime = _baseTime.split(":");
  const addTime = _addTime.split(":");

  const date = new Date(0);
  date.setSeconds(Number(baseTime[2]) + Number(addTime[2]));
  date.setMinutes(date.getMinutes() + Number(baseTime[1]) + Number(addTime[1]));
  date.setHours(date.getHours() + Number(baseTime[0]) + Number(addTime[0]));

  return date.toISOString().split("T")[1].split(".")[0];
};

module.exports = {
  addTime,
  getTimeDifference,
  getTimeInSeconds,
};
