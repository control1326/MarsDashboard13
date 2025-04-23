//require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
//const Immutable = require('immutable'); 

const app = express()
//const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))


app.get('/latestphotos/:rover', async (req, res) => {
    try {
        const {rover} = req.params
        const latest_photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
          .then(res => res.json())
          .then()
        res.send({latest_photos} )
    } catch (err) {
        console.log('error:', err);
    }
})



// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
          .then(res => res.json())
          .then()
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

const hostname = "0.0.0.0";
const port = process.env.port || 3000;


//app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});

