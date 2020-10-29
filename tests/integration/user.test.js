const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')

let server = require('../../server')
const connectDB = require('../../config/db')
const User = require('../../models/User')

chai.use(chaiHttp)

describe(' User '.bgCyan.black, () => {
  before(async () => {
    await connectDB()
  })
  beforeEach(async () => {
    await User.deleteMany({})
  })
  afterEach(() => {})

  describe('GET /user_one', () => {
    before(async () => {
      const user1 = {
        name: 'user one',
        username: 'user_one',
        email: 'userone123@gmail.com',
        password: 'pass@123',
      }
    })
    it('should return true', () => {})
  })
})

// describe('GET /', () => {
//   beforeEach(() => {})
//   afterEach(() => {})
//   it('should return Hello World', async () => {
//     try {
//       const res = await chai.request(server).get('/').send()
//       expect(res.status).to.be.equal(200)
//       expect(res.text).to.be.a('string')
//       expect(res.text.toLowerCase()).to.contain('hello')
//       expect(res.text.toLowerCase()).to.contain('world')
//     } catch (error) {}
//   })
// })
