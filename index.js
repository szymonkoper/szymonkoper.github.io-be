const express = require("express")
const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())

app.use('/api/highscores', require('./routes/api/highscores'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
