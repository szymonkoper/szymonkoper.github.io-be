require("dotenv").config()
const express = require("express")
const app = express()
const axios = require("axios")

const PORT = process.env.PORT || 5000

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/access_token'

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

const OAUTH_REDIRECT_URL_IOS = process.env.OAUTH_REDIRECT_URL_IOS

app.use(express.json())

app.use('/api/highscores', require('./routes/api/highscores'))

// TODO: Maybe not needed for RN
app.all("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
})

app.get("/oauth/login", (req, res) => {
  const GITHUB_AUTH_URL =
    "https://github.com/login/oauth/authorize?scope=user:email&client_id="
  res.redirect(GITHUB_AUTH_URL + OAUTH_CLIENT_ID)
})

app.get("/oauth/callback", async (req, res) => {
  try {
    const response = await axios({
      method: "post",
      url: GITHUB_OAUTH_URL,
      data: {
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        code: req.query.code
      }
    })
    console.log('response')
    console.log(response)
    res.redirect(OAUTH_REDIRECT_URL_IOS)
      // console.log("Success " + response)
    } catch(error) {
      console.error("Error " + error.message)
    }
  })


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))