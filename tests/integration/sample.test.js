const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

let server = require('../../server')

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
