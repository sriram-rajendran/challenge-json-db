const fs = require('fs')
const path = require('path')
const promisify = require('util.promisify')
const _ = require('lodash')
const { DATA_DIRECTORY } = require('./constant')

module.exports = {
  getStudentIdFromRequest,
  getPropertyPathFromRequest,
  getPropertyValueFromBody,
  getFilePath,
  getJsonDataFromFile,
  setJsonDataToFile,
  setJsonProperty
}

const readFile = promisify(fs.readFile)

const writeFile = promisify(fs.writeFile)

function parseJsonSafely (string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    console.error(error)
    return {}
  }
}

function getStudentIdFromRequest (req) {
  return req.params.studentId
}

function getPropertyPathFromRequest (req) {
  return req.params.propertyName + req.params[0].replace(/\//g, '.')
}

function getPropertyValueFromBody (req) {
  return req.body
}

function getFilePath (studentId) {
  return path.join(__dirname, `${DATA_DIRECTORY}/${studentId}.json`)
}

function setJsonProperty (student, propertyPath, value) {
  return _.set(student, propertyPath, value)
}

async function getJsonDataFromFile (filePath) {
  if (fs.existsSync(filePath)) {
    let buffer = await readFile(filePath)
    return parseJsonSafely(buffer.toString())
  } else {
    return {}
  }
}

async function setJsonDataToFile (filePath, studentJson) {
  try {
    await writeFile(filePath, JSON.stringify(studentJson))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
