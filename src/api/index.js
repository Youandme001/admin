import api from './client'

const data = (res) => res.data.data

export const authApi = {
  login: (email, password) => api.post('/admin/login', { email, password }).then((r) => r.data),
  me: () => api.get('/admin/me').then(data),
}

export const productsApi = {
  list: () => api.get('/produit').then(data),
  get: (id) => api.get(`/produit/${id}`).then(data),
  create: (formData) => api.post('/produit/create', formData).then(data),
  update: (id, formData) => api.put(`/produit/update/${id}`, formData).then(data),
  remove: (id) => api.delete(`/produit/delete/${id}`),
}

export const categoriesApi = {
  list: () => api.get('/categories').then(data),
  create: (body) => api.post('/categories/create', body).then(data),
  update: (id, body) => api.put(`/categories/${id}`, body).then(data),
  remove: (id) => api.delete(`/categories/${id}`),
}

export const ordersApi = {
  list: () => api.get('/commande').then(data),
  get: (id) => api.get(`/commande/${id}`).then(data),
  stats: () => api.get('/commande/stats').then((r) => r.data),
  setState: (id, state) => api.put(`/commande/update/${id}`, { state }),
  remove: (id) => api.delete(`/commande/delete/${id}`),
}

export const customersApi = {
  list: () => api.get('/user').then(data),
  remove: (id) => api.delete(`/user/delete/${id}`),
}
