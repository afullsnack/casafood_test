interface ICallWhatsapp {
  phone?: string
  content?: string
}
export function callWhatsapp({ content, phone = '8168781841' }: ICallWhatsapp) {
  window.open(encodeURI(`https://wa.me/${phone}${content ? '?text=' + content : ''}`), '_blank')
}
