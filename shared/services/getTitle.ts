export const getTitle = (title?: string) => {
  if (title) {
    if (title?.includes('-')) return title?.replace(',-', '')
    if (title?.includes('из')) return title?.replace(',', ' в ')
    const cities = title.split(',')
    return `${cities[0]} - ${cities[1]}`
  } else {
    return ''
  }

}