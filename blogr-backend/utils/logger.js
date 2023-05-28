// Logs messages to console

// const info = (...params) => {
//   if (process.env.NODE_ENV !== 'test') {
//     console.log(...params)
//   }
// }

// const error = (...params) => {
//   if (process.env.NODE_ENV !== 'test') {
//     console.error(...params)
//   }
// }

const info = (...params) => console.log(...params)

const error = (...params) => console.error(...params)

module.exports = {
  info, error
}