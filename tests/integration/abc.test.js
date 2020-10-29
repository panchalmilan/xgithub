const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')
// const connectDB = require('../../config/db')

let server

chai.use(chaiHttp)

describe('#basic-setup', () => {
  beforeEach(() => {
    server = require('../../server')
  })
  afterEach(() => {
    server.close()
    console.log('server closed')
  })
  it('should return true', () => {
    console.log(process.env.NODE_ENV)
    expect(true).to.be.true
  })
})

// describe('GET /', () => {
//   beforeEach(() => {})
// afterEach(() => {})
//   it('should return Hello World', async () => {
//     const res = await chai.request(server).get('/').send()
// expect(res.status).to.be.equal(200)
//   })
// })
