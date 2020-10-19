const express = require('express')
const bodyParser = require('body-parser')

const commonApi = require('./api/common')
const studentApi = require('./api/student')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json())

app.get('/health', commonApi.getHealth)
app.put('/:studentId/:propertyName*', studentApi.setStudentDetails)
app.get('/:studentId/:propertyName*', studentApi.getStudentDetails)
app.delete('/:studentId/:propertyName*', studentApi.deleteStudentDetails)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
