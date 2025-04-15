
//const Immutable = require('immutable');
let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),    
    apod: '',  
    photos: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.merge(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            ${showMenu(rovers)}
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)

    //recentRoverPhotos(store).then(console.log(store)) 
 
    
})





// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
   

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}



// ------------------------------------------------------  API CALLS
    const recentRoverPhotos = async (state, rover) =>{
    const { photos } = state 
    fetch(`http://localhost:3000/latestphotos/${rover}` )
    .then(res => res.json())
    .then(photos => updateStore(store, { photos }))        
    //return data
}


    



// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    //return data
}

const showMenu = (rovers)=>
    {
      return           `
            <div id="selectionBar">
                <span id="span1" class="btn" style="background: red">${rovers[0]}</span>
                <span id="span2" class="btn" style="background: green">${rovers[1]}</span>
                <span id="span3" class="btn" style="background: blue" >${rovers[2]}</span>
            </div>
          `
        }
    
        function waitForElement(selector, callback) {
            const observer = new MutationObserver((mutations, observer) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    callback(element);
                }
            });
        
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
        
        function attachListeners()
        {

            waitForElement('#span1', (element) => {
                const button1 = document.getElementById('span1')
                button1.addEventListener('click',(event)=>{
                    const whichRover = event.target.innerText
                    console.log(whichRover)                
                    recentRoverPhotos(store, whichRover).then(console.log(store)).then(attachListeners())
                })
            });
            waitForElement('#span2', (element) => {
                const button2 = document.getElementById('span2')
                button2.addEventListener('click',(event)=>{                
                    const whichRover = event.target.innerText
                    console.log(whichRover)
                    recentRoverPhotos(store, whichRover).then(console.log(store)).then(attachListeners()) 
                })
            });
            waitForElement('#span3', (element) => {
                const button3 = document.getElementById('span3')
                button3.addEventListener('click',(event)=>{
                    const whichRover = event.target.innerText
                    console.log(whichRover)
                    recentRoverPhotos(store, whichRover).then(console.log(store)).then(attachListeners())
                })
            });

        }

    attachListeners();