export const goToOrder = () => {
  const order = document.getElementById('order')

  if (order) {
    order.scrollIntoView({ block: "center", behavior: "smooth" })
  }
}