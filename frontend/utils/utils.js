export const formatBigIntToDate = (bigIntValue) => {
  const milliseconds = Number(bigIntValue / BigInt(1000000))
  const date = new Date(milliseconds)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const dayOfWeek = daysOfWeek[date.getDay()]
  const day = date.getDate().toString().padStart(2, "0")
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const timeFormatted = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  return `${dayOfWeek}, ${day} ${month} ${year} | ${timeFormatted}`
}
