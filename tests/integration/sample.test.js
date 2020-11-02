const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

let server = require('../../server')
const connectDB = require('../../config/db')
const User = require('../../models/User')

chai.use(chaiHttp)

describe('GET /', () => {
  after(() => console.log('------------------------------------------'.blue))
  it('should return hello world', async () => {
    try {
      const res = await chai.request(server).get('/').send()
      expect(res.status).to.be.equal(200)
      expect(res.text).to.be.a('string')
      expect(res.text.toLowerCase()).to.contain('hello')
      expect(res.text.toLowerCase()).to.contain('world')
    } catch (error) {}
  })
})

const user_data = {
  _id: '5f9d85efb17362c9f04b9879',
  name: 'John Wick',
  username: 'johnwick',
  email: 'jw@gmail.com',
  password: 'pass1234',
  bio: 'hello world',
}

describe(' User '.bgCyan.black, () => {
  beforeEach(async () => await connectDB())
  afterEach(async () => {
    await User.deleteMany({})
    console.log('------------------------------------------'.blue)
  })

  /**
   * Create User
   */
  describe('POST /new', () => {
    it('should return user data', async () => {
      try {
        const res = await chai
          .request(server)
          .post('/xgithub/new')
          .send(user_data)

        const { data } = res.body
        expect(res.status).to.be.equal(201)
        expect(data.name).to.be.equal('John Wick')
        expect(data.username).to.be.equal('johnwick')
        expect(data.email).to.be.equal('jw@gmail.com')
        expect(data.password).to.not.be.equal('pass1234')
      } catch (err) {
        console.error(err)
      }
    })
  })

  // USER end ---
})
