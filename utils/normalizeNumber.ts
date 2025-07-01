export default function (num: number) {
  if (num > 1000) {
    return '+' + num.toString().slice(0, -3) + 'k'
  }
  if (num > 1000_000) {
    return '+' + num.toString().slice(0, -6) + 'M'
  }
  return num
}
