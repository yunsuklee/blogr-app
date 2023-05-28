import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token }
  }

  await axios.post(`${baseUrl}/${id}`, config)
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOne = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const increaseLikes = async (updatedBlog, id) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const decreaseLikes = async (updatedBlog, id) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const blogService = {
  setToken,
  create,
  remove,
  getAll,
  getOne,
  increaseLikes,
  decreaseLikes,
}

export default blogService