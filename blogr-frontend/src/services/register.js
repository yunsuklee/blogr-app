import axios from 'axios'

const baseUrl = '/api/users'

const create = async newUser => {
  const response = await axios.post(baseUrl, newUser)
  return response.data
}

const remove = async id => {
  await axios.post(`${baseUrl}/${id}`)
}

const registerService = {
  create,
  remove,
}

export default registerService