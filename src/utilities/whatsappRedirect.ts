interface ICallWhatsapp {
  phone?: string
  content?: string
}
export function callWhatsapp({ content, phone = '9081146028' }: ICallWhatsapp) {
  window.open(encodeURI(`https://wa.me/${phone}${content ? '?text=' + content : ''}`), '_blank')
}
