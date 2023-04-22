module.exports.getDate =  function () {
    const today = new Date();
    //var currentDay = today.getDay();

    const options = {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
    const day = today.toLocaleDateString("en-US", options);

    return day;

  };


  module.exports.sampleDate = function () {
      const today = new Date();
      //var currentDay = today.getDay();

      const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
      const day = today.toLocaleDateString("en-US", options);

      return day;

    };
