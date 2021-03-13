//jshint esversion:6

function get_date() {
  let today = new Date();
  let day = today.getDay();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let cur = today.toLocaleDateString("en-US", options);
  return cur;
}

module.exports = get_date;
