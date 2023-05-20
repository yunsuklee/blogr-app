const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Creates server with built-in http module in Node.js
// Handles requests made to server through app
const server = http.createServer(app)

// Starts the HTTP server above and notifies it
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})