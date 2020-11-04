const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

let server = require('../../server')
const connectDB = require('../../config/db')
const User = require('../../models/User')
const { before } = require('mocha')

chai.use(chaiHttp)

/**
 * common usage things
 * _id to generate INVALID_TOKEN: 5f9d85efb17362c9f04b9889
 * _id to generate VALID_TOKEN: 5f9d85efb17362c9f04b9879
 */
const INVALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOWQ4NWVmYjE3MzYyYzlmMDRiOTg4OSIsImlhdCI6MTYwNDI0MDc0Mn0.Wf-QPvFyLJmSs5XcqFNHSiFt5dNIv3LfAVmGaY3eV1s'
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
    })
  })

  /**
   * When user has NO auth token
   * Expected Response:
   *    status: 400 - bad request
   *    response: {"errorMessage": "Access Denied"}
   */
  describe('GET xgithub/user_one - NO auth token', () => {
    before(async () => {
      try {
        const res = await chai
          .request(server)
          .post('/xgithub/new')
          .send(user_data)
      } catch (err) {
        console.error(err)
      }
    })
    it("should NOT return user's info", async () => {
      const res = await chai.request(server).get('/xgithub/johnwick')

      expect(res.status).to.be.equal(400)
      expect(res.body).to.have.property('errorMessage')
      expect(res.body.errorMessage.toLowerCase()).to.be.equal('access denied')
      expect(res.body).to.have.property('code')
      expect(res.body.code).to.be.equal(400)
    })
  })

  /**
   * When user has INVALID auth token
   * Expected Response:
   *    status: 200 - OK
   * view: public
   * NOTE: invalid token is set
   */
  describe('GET /xgithub/johnwick - INVALID auth token', () => {
    before(async () => {
      try {
        await chai.request(server).post('/xgithub/new').send(user_data)
      } catch (err) {
        console.error(err)
      }
    })
    it('should return PUBLIC info of user', async () => {
      const res = await chai
        .request(server)
        .get('/xgithub/johnwick')
        .set('auth-token', INVALID_TOKEN)

      const { data } = res.body
      expect(res.status).to.be.equal(200)
      expect(res.body.view).to.be.equal('public')
      expect(data.name).to.be.equal('John Wick')
      expect(data.username).to.be.equal('johnwick')
      expect(data).to.not.have.property('email')
      expect(data).to.not.have.property('password')
    })
  })

  /**
   * When user has VALID auth token
   * Expected Response:
   *    status: 200 - OK
   * view: private
   * NOTE: valid token is set when user is created in before hook
   */
  describe('GET /xgithub/johnwick - VALID auth token', () => {
    let token, hashed_password
    before(async () => {
      try {
        const res = await chai
          .request(server)
          .post('/xgithub/new')
          .send(user_data)
        valid_token = res.body.token
        hashed_password = res.body.data.password
      } catch (err) {
        console.error(err)
      }
    })
    it('should return PRIVATE info of user', async () => {
      const res = await chai
        .request(server)
        .get('/xgithub/johnwick')
        .set('auth-token', valid_token)

      const { data } = res.body
      expect(res.status).to.be.equal(200)
      expect(res.body.view).to.be.equal('private')
      expect(data.name).to.be.equal('John Wick')
      expect(data.username).to.be.equal('johnwick')
      expect(data.email).to.be.equal('jw@gmail.com')
      expect(data.password).to.not.be.equal('pass1234')
      expect(data.password).to.be.equal(hashed_password)
    })
  })

  /**
   * When Invalid username is entered
   * response:
   *  status = 400
      desc = Incorrect username or password // uname
   */
  describe('POST /xgithub/login - Invalid username', () => {
    before(
      async () =>
        await chai.request(server).post('/xgithub/new').send(user_data)
    )
    it('should return error for incorrect username or password', async () => {
      const login_credentials = {
        username: 'johnywick',
        password: 'pass1234',
      }
      const res = await chai
        .request(server)
        .post('/xgithub/login')
        .send(login_credentials)
      const words = res.body.desc.toLowerCase().split(' ')
      expect(res.status).to.be.equal(400)
      expect(res.body.desc).to.be.a('String')
      expect(words).to.include('incorrect')
      expect(words).to.include('username')
      expect(words).to.include('password')
      expect(words).to.include('uname')
    })
  })

  /**
   * When Invalid email is entered
   * response:
   *  status = 400
      desc = Incorrect email or password // email
   */
  describe('POST /xgithub/login - Invalid email', () => {
    before(
      async () =>
        await chai.request(server).post('/xgithub/new').send(user_data)
    )
    it('should return error for incorrect email or password', async () => {
      const login_credentials = {
        email: 'jw@something.com',
        password: 'pass1234',
      }
      const res = await chai
        .request(server)
        .post('/xgithub/login')
        .send(login_credentials)
      const words = res.body.desc.toLowerCase().split(' ')
      expect(res.status).to.be.equal(400)
      expect(res.body.desc).to.be.a('String')
      expect(words).to.include('incorrect')
      expect(words).to.include('email')
      expect(words).to.include('password')
    })
  })

  /**
   * When INCORRECT pasword is entered
   * response:
   *  status = 400
      desc = Incorrect email or password // password
   */
  describe('POST /xgithub/login - Incorrect password', () => {
    before(
      async () =>
        await chai.request(server).post('/xgithub/new').send(user_data)
    )
    it('should return error for incorrect email or password', async () => {
      const login_credentials = {
        email: 'jw@gmail.com',
        password: 'pass4321',
      }
      const res = await chai
        .request(server)
        .post('/xgithub/login')
        .send(login_credentials)
      const words = res.body.desc.toLowerCase().split(' ')
      expect(res.status).to.be.equal(400)
      expect(res.body.desc).to.be.a('String')
      expect(words).to.include('incorrect')
      expect(words).to.include('email')
      expect(words).to.include('password')
      expect(words).to.include('password')
    })
  })

  /**
   * When VALID Credentials are entered
   * response:
   *
   */
  describe('POST /xgithub/login - VALID credentials', () => {
    before(
      async () =>
        await chai.request(server).post('/xgithub/new').send(user_data)
    )
    it('should return error for incorrect email or password', async () => {
      const login_credentials = {
        email: 'jw@gmail.com',
        password: 'pass1234',
      }
      const res = await chai
        .request(server)
        .post('/xgithub/login')
        .send(login_credentials)
      const { data } = res.body

      expect(res.status).to.be.equal(200)
      expect(res.body).to.have.property('desc')
      expect(res.body).to.have.property('token')
      expect(data.name).to.be.equal('John Wick')
      expect(data.username).to.be.equal('johnwick')
      expect(data.email).to.be.equal('jw@gmail.com')
      expect(data.password).to.not.be.equal('pass1234')
    })
  })

  // USER end ---
})
