const _ = require('lodash')
const util = require('./util')

module.exports = {
  setDetails,
  getDetails
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

async function getDetails (studentData) {
  const {
    studentId,
    propertyPath
  } = studentData
  const filePath = util.getFilePath(studentId)
  let studentJson = await util.getJsonDataFromFile(filePath)

  return util.getJsonProperty(
    studentJson,
    propertyPath)
}
