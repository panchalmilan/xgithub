const chai = require('chai')
const expect = chai.expect
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('../../models/User')
require('dotenv').config({ path: './config/test.env' })

/**
 * User Model method
 * user.createAndSendJWT
 */
describe('user.createAndSendJWT', () => {
  after(() => console.log('------------------------------------------'.blue))
  it('should return a valid JWT', () => {
    const user_data = {
      _id: new mongoose.Types.ObjectId(),
      name: 'John Wick',
      username: 'johnwick',
      email: 'jw@gmail.com',
      password: 'pass1234',
      bio: 'hello world',
    }
    const user = new User(user_data)
    const token = user.createAndSendJWT()
    const decoded_user = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
    expect(decoded_user.id).to.equal(user_data._id.toHexString())
    expect(decoded_user).to.have.property('iat')
  })
})

describe('logging test', () => {
  it('should return nothing', () => {
    console.log(process.env.JWT_TOKEN_SECRET)
    expect(true).to.be.true
  })
})
