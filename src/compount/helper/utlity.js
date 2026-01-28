const timeAgo = (dateString) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const diff = (new Date(dateString) - new Date()) / 1000;

  const divisions = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.345, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Infinity, name: "years" },
  ];

  let duration = diff;

  for (let division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
};

export { timeAgo };
