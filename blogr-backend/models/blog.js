const mongoose = require('mongoose')

// Blog DB schema
const blogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  likes: Number,
  creationDate: {
    type: Date,
    default: Date.now,
    requires: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

// Specifies how the document should be transformed when converted to JSON
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog