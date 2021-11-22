const changeTimeSpan = (state = {}, action) => {
  switch (action.type) {
    case "CHANGE_START_TIME":
      return {
        time: action.time,
      };
    case "CHANGE_END_TIME":
      return {
        time: action.time,
      };

    default:
      return state;
  }
};

export { changeTimeSpan };
