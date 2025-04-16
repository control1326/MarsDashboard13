require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const Immutable = require('immutable'); 

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
 //const roverName = 'curiosity'; // or 'opportunity' or 'spirit'

/*const apiKey = `${process.env.API_KEY}`; // Replace with your actual API key

const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${process.env.API_KEY}`;

async function getMostRecentPhotos(rover, key) {
  try {
    const response = await fetch(
        apiUrl
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.latest_photos;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function displayMostRecentPhotos(rover) {
  const photos = await getMostRecentPhotos(rover, {apiKey});
  if (photos && photos.length > 0) {
    console.log(`Most recent photos from ${rover}:`);
    photos.forEach((photo) => {
      console.log(`- Photo ID: ${photo.id}, Earth Date: ${photo.earth_date}, Image URL: ${photo.img_src}`);
    });
  } else {
    console.log(`No recent photos found for ${rover}.`);
  }
}

displayMostRecentPhotos(roverName); */

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2025-4-14&api_key=ppoLxFfojdyvv9VdXJXQYxAvQmTBnVKU4k0LWf1B

//https://api.nasa.gov/mars-photos/api/v1/rovers/${RoverName}}/latest_photos?api_key=${process.env.API_KEY}