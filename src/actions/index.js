export const changeStartTime = (time) => {
  return {
    type: "CHANGE_STARTTIME",
    time,
  };
};
export const changeEndTime = (time) => {
  return {
    type: "CHANGE_ENDTIME",
    time,
  };
};
