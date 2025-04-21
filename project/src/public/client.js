
document.title = 'Mars Rover Photos'

let store = {  
    apod: '',  
    latest_photos:'',
    rovers: ['Curiosity', 'Perseverance' /*'Opportunity', 'Spirit'*/],
    clickedRover: '',
    rover: ''

}




// add our markup to the page
const root = document.getElementById('root')



const updateStore = (state, newState) => {


    if (newState.hasOwnProperty("latest_photos"))
    {
        
        // Get nested object latest photos. 
        const {latest_photos} = newState.latest_photos.latest_photos
        // Map only the age and the date.
        const mappedPhotos = mapPhotos(latest_photos)
        // Make a new object to store latest photos & rover info.
        const newMappedPhotos = 
        {
            latest_photos:'',
            rover: ''
        }
        newMappedPhotos.latest_photos = mappedPhotos        
        
        // map rover objects to an array.
        const mappedRovers = mapRovers(latest_photos)
        
        // Reduce rover objects to one object b/c they are all the same per each API call. 
        const reducedRover = reduceRover(mappedRovers)


        newMappedPhotos.rover = reducedRover


        store = Object.assign(state, newMappedPhotos)

        console.log(store)
    }
    else
    {        
        store = Object.assign(state, newState)
    } 
    
    render(root, store)

    
}

const mapPhotos = (photos) => photos.map(({img_src,earth_date,rover}) => ({img_src, earth_date,rover}))

const mapRovers = (rovers) => rovers.map(({rover}) => (rover))


const reduceRover = (mappedRovers) => mappedRovers.reduce((prev, curr,i) =>{
    return curr   
}) 




const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    

    const { rovers, apod, latest_photos, clickedRover,rover } = state
 
    // console.log('App function')
    // console.log(latest_photos)

    if (latest_photos.length === 0)
    {
    return `
        <header></header>
        <main>
            ${showMenu(rovers)}           
            <section>
                <h3>Welcome to this Latest Photos from NASA Mars Rover Website ...</h3>
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
                <h3>Welcome to this Latest Photos from NASA Mars Rover Website ...</h3>
                <p class="userPrompt">Click a button above to see the latest photos from a rover.</p>
                <p class="roverInfo">Rover: ${rover.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br class="mobile-break" >Launched: ${new Date(rover.launch_date).toLocaleDateString()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br class="mobile-break">Landed: ${new Date(rover.landing_date).toLocaleDateString()}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br class="mobile-break">Status: ${rover.status}</p>  
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


const RoverLatestPhotos = (latest_photos) => {

       
    // latest photo for rover exists
    if (latest_photos.length > 0 ) {
        let pics = ''
        latest_photos.forEach(photo => {
                pics += 
                (`
                <div class="responsive">
                    <div class="gallery">
                       <img class="fitImg" src="${photo.img_src}"  width="600" height="400">
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
 /*    const recentRoverPhotos = async (state, rover) =>{
    let { latest_photos } = state 
    fetch(`http://localhost:3000/latestphotos/${rover}` )
    .then(res => res.json()) 
    .then(latest_photos => updateStore(store, { latest_photos} )) 
    //return data
} */

    const recentRoverPhotos = async (state, rover) =>{
    let { latest_photos } = state 
    fetch(`https://project-broken-flower-2755.fly.dev/latestphotos/${rover}` )
    .then(res => res.json()) 
    .then(latest_photos => updateStore(store, { latest_photos} )) 
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