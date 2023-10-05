export const parseDate = (date: string): Date => {
  const [hours, minutes] = date.split(':').map(Number)
  const newDate = new Date()
  newDate.setHours(hours)
  newDate.setMinutes(minutes)

  return newDate
}
