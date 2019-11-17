const express = require('express')
const router = express.Router()
const highscores = require('../../fake/highscores')

const createErrorForGameNotFound = game => ({ message: `No game found: ${game}` })
const createErrorForGameScoreNotFound = game => ({
  message: `No highscore found with id: ${game}`
})

const gameSelector = (game) => highscores[game]

router.get('/:game', (req, res) => {
  const { game } = req.params
  const foundGame = gameSelector(game)

  if (!foundGame) {
    return res.status(404).json(createErrorForGameNotFound(game))
  }

  return res.json(foundGame)
})

router.get("/:game/:id", (req, res) => {
  const { game, id } = req.params
  const foundGame = gameSelector(game)

  if (!foundGame) {
    return res.status(404).json(createErrorForGameNotFound(game))
  }

  const foundHighscores = foundGame.find(highscore => highscore.id === id)

  if (!foundHighscores) {
    return res.status(404).json(createErrorForGameScoreNotFound(id))
  }

  return res.json(foundHighscores)
})

module.exports = router