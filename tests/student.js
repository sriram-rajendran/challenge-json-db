const fs = require('fs')
const tape = require('tape')
const jsonist = require('jsonist')
const path = require('path')
const promisify = require('util.promisify')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())

const { DATA_DIRECTORY } = require('../config/constant')
const server = require('../server')

const endpoint = `http://localhost:${port}`
const deleteFile = promisify(fs.unlinkSync)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const studentId = 'rn1abu8'
const sampleStudentData = {
  courses: {
    astronomy: {
      quizzes: {
        'question': 'answer'
      }
    },
    calculus: {
      quizzes: {
        'question': 'answer'
      }
    }
  }
}

tape('PUT /:studentId/:propertyName sets student property to JSON file',
  async function (t) {
    const url = `${endpoint}/${studentId}/courses`

    await deleteFileFromPath(studentId)

    jsonist.put(url, sampleStudentData.courses,
      async (err, body, response) => {
        if (err) t.error(err)
        t.equals(body.success, true, 'should have successful set property')
        t.equals(response.statusCode, 200,
          'should have successful set property response code')
        t.deepEquals(await getJsonDataFromFile(studentId), sampleStudentData,
          'should have match the file content')
        await deleteFileFromPath(studentId)
        t.end()
      })
  })

tape('PUT /:studentId/:propertyName sets nested student property to JSON file',
  async function (t) {
    const url = `${endpoint}/${studentId}/courses/calculus`

    await deleteFileFromPath(studentId)

    jsonist.put(url, sampleStudentData.courses.calculus,
      async (err, body, response) => {
        if (err) t.error(err)
        t.equals(body.success, true, 'should have successful set property')
        t.equals(response.statusCode, 200,
          'should have successful set property response code')
        t.deepEquals((await getJsonDataFromFile(studentId)).courses.calculus,
          sampleStudentData.courses.calculus,
          'should have match the file content')
        await deleteFileFromPath(studentId)
        t.end()
      })
  })

tape('GET /:studentId/:propertyName get student property from JSON file',
  async function (t) {
    const url = `${endpoint}/${studentId}/courses`

    await deleteFileFromPath(studentId)

    t.equals(await createTestFileForStudent(studentId, sampleStudentData),
      true,
      'should have successful file creation')

    jsonist.get(url, async (err, body, response) => {
      if (err) t.error(err)
      t.equals(body.success, true, 'should have successful get property')
      t.equals(response.statusCode, 200,
        'should have successful set property response code')
      t.deepEquals((await getJsonDataFromFile(studentId)).courses,
        body.data,
        'should have match the file content')
      t.end()
    })
  })

tape('GET /:studentId/:propertyName get nested student property' +
 'from JSON file',
async function (t) {
  const url = `${endpoint}/${studentId}/courses/calculus`

  await deleteFileFromPath(studentId)

  t.equals(await createTestFileForStudent(studentId, sampleStudentData), true,
    'should have successful file creation')
  jsonist.get(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equals(body.success, true, 'should have successful get property')
    t.equals(response.statusCode, 200,
      'should have successful set property response code')
    t.deepEquals((await getJsonDataFromFile(studentId)).courses.calculus,
      body.data,
      'should have match the file content')
    t.end()
  })
})

tape('GET /:studentId/:propertyName check if it returns not found for ' +
 'empty property',
async function (t) {
  const url = `${endpoint}/${studentId}/courses/random`

  await deleteFileFromPath(studentId)

  t.equals(await createTestFileForStudent(studentId, sampleStudentData), true,
    'should have successful file creation')
  jsonist.get(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equals(body.error, 'Not Found',
      'should have successful redirect message on not found')
    t.equals(response.statusCode, 404,
      'should have successful redirect on not found')
    t.end()
  })
})

tape('DELETE /:studentId/:propertyName deletes student property' +
 'from JSON file',
async function (t) {
  const url = `${endpoint}/${studentId}/courses`

  await deleteFileFromPath(studentId)

  t.equals(await createTestFileForStudent(studentId, sampleStudentData), true,
    'should have successful file creation')

  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equals(body.success, true, 'should have successful delete property')
    t.equals(response.statusCode, 200,
      'should have successful delete property response code')
    t.deepEquals((await getJsonDataFromFile(studentId)),
      { },
      'should have delete file content')
    t.end()
  })
})

tape('DELETE /:studentId/:propertyName deletes nested student property' +
 'from JSON file',
async function (t) {
  const url = `${endpoint}/${studentId}/courses/calculus`

  await deleteFileFromPath(studentId)

  t.equals(await createTestFileForStudent(studentId, sampleStudentData), true,
    'should have successful file creation')

  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equals(body.success, true,
      'should have successful delete nested property')
    t.equals(response.statusCode, 200,
      'should have successful delete property response code')
    t.notOk(
      (await getJsonDataFromFile(studentId))
        .courses
        .hasOwnProperty('calculus'),
      'should have delete nested file content')
    t.end()
  })
})

tape('DELETE /:studentId/:propertyName check if it returns not found for' +
 ' empty property',
async function (t) {
  const url = `${endpoint}/${studentId}/courses/random`

  await deleteFileFromPath(studentId)

  t.equals(await createTestFileForStudent(studentId, sampleStudentData), true,
    'should have successful file creation')

  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equals(body.error, 'Not Found',
      'should have successful redirect message on not found')
    t.equals(response.statusCode, 404,
      'should have successful redirect on not found')
    t.end()
  })
})

tape('cleanup', async function (t) {
  await deleteFileFromPath(studentId)
  server.close()
  t.end()
})

function getFilePath (studentId) {
  return path.join(__dirname, `../${DATA_DIRECTORY}/${studentId}.json`)
}

function parseJsonSafely (string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    console.error(error)
    return {}
  }
}

async function getJsonDataFromFile (studentId) {
  const filePath = getFilePath(studentId)
  if (fs.existsSync(filePath)) {
    let buffer = await readFile(filePath)
    return parseJsonSafely(buffer.toString())
  } else {
    return {}
  }
}

async function deleteFileFromPath (studentId) {
  const filePath = getFilePath(studentId)
  if (fs.existsSync(filePath)) {
    deleteFile(filePath)
  }
}

async function createTestFileForStudent (studentId, data) {
  const filePath = getFilePath(studentId)
  try {
    writeFile(filePath, JSON.stringify(data))
    return true
  } catch (error) {
    return false
  }
}
