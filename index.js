const express = require("express")
const app = express()

const PORT = 3000 // TODO: Extract to .env

app.use(express.json())

app.use('/api/highscores', require('./routes/api/highscores'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
