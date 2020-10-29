const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('#basic-setup', () => {
  it('should return true', () => {
    console.log(process.env.NODE_ENV)
    expect(true).to.be.true
  })
})
