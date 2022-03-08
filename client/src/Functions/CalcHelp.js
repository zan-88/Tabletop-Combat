export function getDecimalCount(n) {
  let temp = String(n);
  let count = 0;
  try {
    count = temp.split(".")[1].length;
  } catch (err) {}

  return count;
}

export function round(n, round) {
  return Number.parseFloat(n.toFixed(round));
}

export function removeRepeat(n) {
  const re = /(\d+?)\1+$/;
  let temp = String(n);

  if (temp.length > 10) {
    temp = temp.slice(0, temp.length - 1);
  }

  let rounder = temp.split(".");

  let ind = -1;

  if (rounder.length > 1) {
    ind = rounder[1].search(re);
  }

  let val = Number.parseFloat(temp);

  if (ind > 0) val = round(val, ind - 1);

  return val;
}
