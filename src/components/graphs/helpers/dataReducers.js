export function reduceDuplicateDates(data) {
  let prev = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].date == data[prev].date) {
      data[i].amount += data[prev].amount;
      data.splice(prev, 1);
      i -= 1;
      prev = i;
    } else {
      prev = i;
    }
  }
  return data;
}

export function reduceDuplicateMonths(data) {
  let prevMonth = 0;
  let prevIdx = 0;
  // for first element, extract month.
  for (let i = 0; i < data.length; i++) {
    let curMonth = data[i].date.match(/^\d+|\d+\b|\d+(?=\w)/g).slice(0, 3)[1];
    if (i == 0) {
      prevMonth = curMonth;
      continue;
    }
    // check if month is duplicate.
    if (curMonth == prevMonth) {
      data[i].amount += data[prevIdx].amount;
      data.splice(prevIdx, 1);
      i -= 1;
      prevIdx = i;
    } else {
      prevMonth = curMonth;
      prevIdx = i;
    }
  }
  return data;
}
