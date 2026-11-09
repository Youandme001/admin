const money = new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatPrice = (value) => money.format(Number(value) || 0)

export const formatDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime && { hour: '2-digit', minute: '2-digit' }),
      })
    : '—'

export const formatMonth = (key) => {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('fr-FR', { month: 'short' })
}

export const fullName = (user) => (user ? `${user.firstName} ${user.lastName}` : 'Client supprimé')

export const ORDER_STATES = {
  pending: { label: 'En attente', color: 'warning' },
  Confirmed: { label: 'Confirmée', color: 'info' },
  Delivered: { label: 'Livrée', color: 'success' },
  Rejected: { label: 'Rejetée', color: 'danger' },
}

// Next actions offered for each state
export const NEXT_STATES = {
  pending: ['Confirmed', 'Rejected'],
  Confirmed: ['Delivered', 'Rejected'],
  Delivered: [],
  Rejected: ['pending'],
}

export const itemsCount = (order) => order.products.reduce((n, p) => n + p.quantity, 0)
