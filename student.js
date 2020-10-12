const _ = require('lodash')
const util = require('./util')

module.exports = {
  setDetails
}

async function setDetails (studentData) {
  const {
    studentId,
    propertyPath,
    propertyValue
  } = studentData
  const filePath = util.getFilePath(studentId)
  let studentJson = await util.getJsonDataFromFile(filePath)
  let updatedStudentJson = util.setJsonProperty(
    studentJson,
    propertyPath,
    propertyValue)

  return util.setJsonDataToFile(filePath, updatedStudentJson)
}
