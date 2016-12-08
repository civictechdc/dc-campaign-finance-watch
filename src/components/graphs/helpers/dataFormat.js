import d3 from 'd3';

export function formatDatesByDay(data) {
  let formatDate = d3.time.format('%Y-%m-%d')

  for (let k of data) {
    let digits = k.date.match(/^\d+|\d+\b|\d+(?=\w)/g).slice(0,3);
    k.date = digits[0]+'-'+digits[1]+'-'+digits[2]
    k.date = formatDate.parse(k.date);
    k.amount = +k.amount;
  }
  return data
}

export function formatDatesByMonth(data) {
  let formatDate = d3.time.format('%Y-%m-%d')

  for (let k of data) {
    let digits = k.date.match(/^\d+|\d+\b|\d+(?=\w)/g).slice(0,3);
    k.date = digits[0]+'-'+digits[1]+'-01'
    k.date = formatDate.parse(k.date);
    k.amount = +k.amount;
  }
  return data
}
