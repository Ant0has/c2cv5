export const scrollToBlockById = (id: string='order') => {
  const block = document.getElementById(id)

  if (block) {
    block.scrollIntoView({ block: "center", behavior: "smooth" })
  }
}