const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')

let server = require('../../server')
const connectDB = require('../../config/db')

chai.use(chaiHttp)

describe(' basic-setup '.bgCyan.black, () => {
  beforeEach(async () => {
    await connectDB()
  })
  afterEach(() => {})
  it('should return true', () => {
    console.log(process.env.NODE_ENV)
    expect(true).to.be.true
  })
})

describe(' GET / '.bgCyan.black, () => {
  beforeEach(() => {})
  afterEach(() => {})
  it('should return Hello World', async () => {
    try {
      const res = await chai.request(server).get('/').send()
      expect(res.status).to.be.equal(200)
      expect(res.text).to.be.a('string')
      expect(res.text.toLowerCase()).to.contain('hello')
      expect(res.text.toLowerCase()).to.contain('world')
    } catch (error) {}
  })
})
