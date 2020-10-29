const swaggerJsDoc = require('swagger-jsdoc')

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'xgithub',
      version: '1.0.0',
      description: 'API for version control',
    },
  },
  apis: ['./routes/user.js', './test.yml'],
}

module.exports.swaggerDocs = swaggerJsDoc(swaggerOptions)
