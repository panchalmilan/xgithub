const mongoose = require('mongoose')

const RepositorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [30, 'Name cannot be more than 30 chars'],
    trim: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toString().split(' ').splice(0, 5).join(' '),
  },
  lastModifiedAt: {
    type: String,
    default: new Date().toString().split(' ').splice(0, 5).join(' '),
  },
  accessBy: {
    type: String,
    default: 'public',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  contributors: {
    type: [String],
  },
  visits: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  stars: {
    type: Number,
    default: 0,
  },
})

RepositorySchema.statics.checkRepoUniqueness = async function (repo, uname) {
  try {
    const repositories = await this.find({ name: repo })
    if (repositories.length === 0) return true
    for (let i = 0; i < repositories.length; i++) {
      if (repositories[i].username === uname) return false
    }
    return true
  } catch (err) {
    console.log('error')
  }
}

module.exports = mongoose.model('Repository', RepositorySchema)
