const util = require('./util')
const student = require('./student')

module.exports = {
  getHealth,
  setStudentDetails,
  getStudentDetails,
  deleteStudentDetails
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

async function getStudentDetails (req, res, next) {
  const studentId = util.getStudentIdFromRequest(req)
  const propertyPath = util.getPropertyPathFromRequest(req)
  const studentData = { studentId, propertyPath }

  let studentResponse = await student.getDetails(studentData)
  if (!studentResponse.isPresent) {
    next()
  } else {
    res.json({ success: true, data: studentResponse.data })
  }
}

async function deleteStudentDetails (req, res, next) {
  const studentId = util.getStudentIdFromRequest(req)
  const propertyPath = util.getPropertyPathFromRequest(req)
  const studentData = { studentId, propertyPath }
  const studentResponse = await student.deleteDetails(studentData)
  if (!studentResponse.isPresent) {
    next()
  } else {
    res.json({ success: studentResponse.status })
  }
}
