


let store = {  
    apod: '',  
    latest_photos:'',
    rovers: ['Curiosity', 'Perseverance' /*'Opportunity', 'Spirit'*/],
    clickedRover: ''
}



// add our markup to the page
const root = document.getElementById('root')



const updateStore = (state, newState) => {


    if (newState.hasOwnProperty("latest_photos"))
    {
        
         
        const {latest_photos} = newState.latest_photos.latest_photos
        //console.log(latest_photos) 
        const mappedPhotos = mapPhotos(latest_photos)
        //console.log(mappedPhotos)
        const newMappedPhotos = {latest_photos:''}
        newMappedPhotos.latest_photos = mappedPhotos
        //console.log(newMappedPhotos)

        store = Object.assign(state, newMappedPhotos)
    }
    else
    {        
        store = Object.assign(state, newState)
    } 
    
    render(root, store)

    
}

const mapPhotos = (photos) => photos.map(({img_src,earth_date}) => ({img_src, earth_date}))




const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    

    const { rovers, apod, latest_photos, clickedRover } = state
 
    console.log('App function')
    console.log(latest_photos)

    if (latest_photos.length === 0)
    {
    return `
        <header></header>
        <main>
            ${showMenu(rovers)}           
            <section>
                <h3>This is the Latest Photos from NASA Mars Rover Application ...</h3>
                <p class="userPrompt">Click a button above to see the latest photos from a rover.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. 
                </p>
                <img src="https://apod.nasa.gov/apod/image/2504/CatsEyeWide_Niittee_960.jpg" height="350px" width="100%">
                ${RoverLatestPhotos(latest_photos)}
            </section>
        </main>
        <footer></footer>
    `
    }
    else
    {
        return `
        <header></header>
        <main>
            ${showMenu(rovers)}           
            <section>
                <h3>This is an Application to show the Latest Photos from a NASA Mars Rover  ...</h3>
                <p class="userPrompt">Click a button above to see the latest photos from a rover.</p>
                ${RoverLatestPhotos(latest_photos)}
            </section>
        </main>
        <footer></footer>
    `        
    }        

}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)

 })





// ------------------------------------------------------  COMPONENTS


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    //console.log(photodate.getDate(), today.getDate());

    //console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date=== today.getDate() ) {
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

const RoverLatestPhotos = (latest_photos) => {

    console.log('rlp')
    console.log(latest_photos)
       
    // latest photo for rover exists
    if (latest_photos.length > 0 ) {
        let pics = ''
        latest_photos.forEach(photo => {
                pics += 
                (`
                <div class="responsive">
                    <div class="gallery">
                       <img src="${photo.img_src}"  width="600" height="400">
                    </div>
                </div>
                `)                                   
            });
        return pics            
    } else {
        return (`            
                `)
    }
}



// ------------------------------------------------------  API CALLS
    const recentRoverPhotos = async (state, rover) =>{
    let { latest_photos } = state 
    fetch(`http://localhost:3000/latestphotos/${rover}` )
    .then(res => res.json()) 
    .then(latest_photos => updateStore(store, { latest_photos} )) 
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
        
        // Event handlers for all 3 buttons
        function attachListeners()
        {

            waitForElement('#span1', (element) => {
                const button1 = document.getElementById('span1')
                button1.addEventListener('click',(event)=>{
                    const whichRover = event.target.innerText                            
                    recentRoverPhotos(store, whichRover)
                    .then(putRoverInStore(whichRover))
                    .then(render(root, store))
                    .then(attachListeners())                    
                })
            });
            waitForElement('#span2', (element) => {
                const button2 = document.getElementById('span2')
                button2.addEventListener('click',(event)=>{                
                    const whichRover = event.target.innerText
                    recentRoverPhotos(store, whichRover)
                    .then(putRoverInStore(whichRover))
                    .then(render(root, store))                    
                    .then(attachListeners()) 
                })
            });

        }

    // Call attachment of event handlers for buttons
    attachListeners();

    const putRoverInStore = (clickedRover)=>{

        let clickedRoverObj = {clickedRover: ''}
        clickedRoverObj.clickedRover = clickedRover

        updateStore(store, clickedRoverObj)
    }

    //<img src="${apod.image.url}" height="350px" width="100%" />