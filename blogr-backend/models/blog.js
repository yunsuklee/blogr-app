const mongoose = require('mongoose')

// Blog DB schema
const blogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 1
  },
  likes: Number,
  creationDate: {
    type: Date,
    default: function () {
      return new Date()
    }
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