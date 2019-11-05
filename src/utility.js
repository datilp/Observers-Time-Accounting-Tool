export const updateObject = (oldObject, updatedValues) => {
    return {
        ...oldObject,
        ...updatedValues
    }
};

export const getDate = (date) => {
    //console.log("Date:", date);
    if (date instanceof Date) {
      //console.log("Date:[String]", date);

      return date;
    } else {
      //2019-10-28T17:30:13.368Z
      //const newDate = Date.parseDate(date, "YYYY-MM-DDTHH:MM:SS.sssZ");
      //const newDate = Date.parse(date);
      //const newDate = new Date();
      const newDate = new Date(date);

      //console.log("Date:[Date]", newDate.getTime());
      return newDate;
    }
  }; 