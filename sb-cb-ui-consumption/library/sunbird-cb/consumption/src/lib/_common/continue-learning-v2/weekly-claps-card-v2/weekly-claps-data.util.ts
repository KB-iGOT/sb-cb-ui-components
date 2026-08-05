export function buildWeeklyClapsData(weeklyClaps: any): any {
  const weekLabels = ['W1', 'W2', 'W3', 'W4']
  const weekKeys = weekLabels.map((_label, i) => {
    const shortKey = `w${i + 1}`
    const longKey = `week${i + 1}`
    return weeklyClaps && weeklyClaps[longKey] !== undefined && weeklyClaps[shortKey] === undefined
      ? longKey
      : shortKey
  })
  const now = new Date()
  const startDate = weeklyClaps && weeklyClaps.startDate ? new Date(weeklyClaps.startDate) : null
  const endDate = weeklyClaps && weeklyClaps.endDate ? new Date(weeklyClaps.endDate) : null
  const periodMs = (startDate && endDate) ? (endDate.getTime() - startDate.getTime()) / 4 : 0

  const weekList = weekKeys.map((key, i) => {
    let activeWeek = false
    if (startDate && periodMs) {
      const wStart = new Date(startDate.getTime() + i * periodMs)
      const wEnd = new Date(startDate.getTime() + (i + 1) * periodMs)
      activeWeek = now >= wStart && now < wEnd
    }
    return { label: weekLabels[i], key, activeWeek }
  })
  return { enableCard: true, weekList }
}
