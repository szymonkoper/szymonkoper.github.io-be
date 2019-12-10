const express = require('express')
const uuid = require('uuid')
const dateFns = require('date-fns')
const { parseIso, format } = dateFns
// TODO: Add ES6 support (imports)
const router = express.Router()
const highscores = require('../../fake/highscores')

const DATETIME_FORMAT = "yyyy-LL-dd'T'HH:mm:ssxx"
const formatDate = date => format(date, DATETIME_FORMAT)
const parseDate = dateString => parse(DATETIME_FORMAT, dateString)

// RESPONSES
const createResponse = (message, data) => ({ message, data })

// RESPONSES success
const createResponseForFoundScores = scores => createResponse('Game scores found', scores)

const createResponseForFoundScore = score => createResponse('Game score found', score)

// RESPONSES failure
const createErrorForScoresNotFound = (gameId) =>
  createResponse(
    `No score found for gameId: ${gameId}`
  )

const createErrorForScoreNotFound = (gameId, scoreId) =>
  createResponse(
    `No score found with gameId: ${gameId}, scoreId: ${scoreId}`
  )

// SELECTORS
const scoresSelector = gameId => highscores[gameId]

const scoreSelector = (gameId, scoreId) => (scoresSelector(gameId) || []).find(({ id }) => id === scoreId)

// ROUTES
router.get('/:gameId', (req, res) => {
  const { gameId } = req.params
  const foundScores = scoresSelector(gameId)

  if (!foundScores) {
    return res.status(404).json(createErrorForScoresNotFound(gameId))
  }

  return res.json(createResponseForFoundScores(foundScores))
})

router.get('/:gameId/:scoreId', (req, res) => {
  const { gameId, scoreId } = req.params
  const foundScore = scoreSelector(gameId, scoreId)

  if (!foundScore) {
    return res.status(404).json(createErrorForScoreNotFound(gameId, scoreId))
  }

  return res.json(createResponseForFoundScore(foundScore))
})

router.post('/:gameId', (req, res) => {
  const { gameId } = req.params
  const { username, score } = req.body

  const newScore = {
    id: uuid.v4(),
    username,
    datetime: formatDate(new Date()),
    score
  }


  const foundScores = scoresSelector(gameId)

  return res.json([...foundScores, newScore])
})

module.exports = router