const util = require('../helpers/util')

module.exports = {
  setDetails,
  getDetails,
  deleteDetails
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

async function deleteDetails (studentData) {
  const {
    studentId,
    propertyPath
  } = studentData

  const filePath = util.getFilePath(studentId)
  let studentJson = await util.getJsonDataFromFile(filePath)
  let updatedStudentResponse = util.deleteJsonProperty(
    studentJson,
    propertyPath)

  if (!updatedStudentResponse.isPresent) {
    return { isPresent: false }
  }

  return {
    isPresent: true,
    status: await util.setJsonDataToFile(filePath, updatedStudentResponse.data)
  }
}
