const util = require('./util')
const student = require('./student')

module.exports = {
  getHealth,
  setStudentDetails
}

async function getHealth (req, res) {
  res.json({ success: true })
}

async function setStudentDetails (req, res) {
  const studentId = util.getStudentIdFromRequest(req)
  const propertyPath = util.getPropertyPathFromRequest(req)
  const propertyValue = util.getPropertyValueFromBody(req)
  const studentData = { studentId, propertyPath, propertyValue }

  const status = await student.setDetails(studentData)
  res.json({ success: status })
}
