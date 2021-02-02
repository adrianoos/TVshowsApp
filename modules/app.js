


import { mapListToDOMElements, createDOMElem } from './DOMactions.js' // importing modules
import { getShowsByKey, getShowsById } from './requests.js'

class Tvapp { // App Class
    constructor() {
        this.viewElems = {} 
        this.showNameButtons = {} 
        this.selectedName = "Comedy" // Default most popular keyword
        this.initializeApp()
    }

    initializeApp = () => { // Run up app necessary functions 
        this.connectDOMElements()
        this.setupListeners()
        this.fetchAndDisplayShows()
    }

    connectDOMElements = () => { // mapping DOM elements and showNameButtons to objects for further easier use 
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id); 
        const listOfShowNames = Array.from(document.querySelectorAll('[data-show-name]')).map(elem => elem.dataset.showName);
    this.viewElems = mapListToDOMElements(listOfIds, 'id');
    this.showNameButtons = mapListToDOMElements(listOfShowNames, 'data-show-name');
    }

setupListeners = () => { // setup listeners for usable buttons 
Object.keys(this.showNameButtons).forEach(showName => { 
    this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter)
})
this.viewElems.searchButton.addEventListener('keydown', this.handleSubmit);
this.viewElems.searchInput.addEventListener('keydown', this.handleSubmit);
this.viewElems.Favs.addEventListener('click', this.renderfav);
}

setCurrentNameFilter = () => { // execution of selected keywords
    this.selectedName = event.target.dataset.showName;
    this.fetchAndDisplayShows()
}

fetchAndDisplayShows = () => { // rendering function for selected keywords 
    getShowsByKey(this.selectedName).then(shows => this.renderCardsOnList(shows)) 
}

clearInput = () => { // support cleaning function for message display
    this.viewElems.searchInput.value = '';
    this.viewElems.label1.innerText = "TV Shows Base";
}

handleSubmit = () => { // handling function for search input 
    if (event.key === 'Enter') {
      let query = this.viewElems.searchInput.value; 
      getShowsByKey(query).then(shows => {if (shows.length > 0) { 
          this.renderCardsOnList(shows);
      } else {
          this.errorHandle();
      } 
    });
      this.clearInput();
  }
}


errorHandle = () => { // message function empty response from API
this.viewElems.label1.innerText = "Error";
this.viewElems.searchInput.value = "Sorry no Data";
setTimeout(this.clearInput, 4000);
}

renderCardsOnList = shows => { // separating function for API response to display downloaded shows on showCards
Array.from( document.querySelectorAll('[data-show-id]')).forEach(btn => btn.removeEventListener('click', this.openDetailsView))
this.viewElems.showsWrapper.innerHTML = ""
for (const {show} of shows) { 
const card = this.createShowCard(show)
this.viewElems.showsWrapper.appendChild(card) 
this.showsSet = show; 
}
}

addMessage = () => { // messages
    this.viewElems.popUp.innerText = "Show added to Favorites";
    this.viewElems.popUp.style.visibility = "visible";
}

existMessage = () => {
    this.viewElems.popUp.innerText = "Show already in Favorites";
    this.viewElems.popUp.style.visibility = "visible";
}
hideMessage = () => {
this.viewElems.popUp.innerText = "";
this.viewElems.popUp.style.visibility = "hidden";
}
removeMessage = () => {
    this.viewElems.popUp.innerText = "Show removed from favorites";
    this.viewElems.popUp.style.visibility = "visible";
    }
emptyFavsMessage = () => {
    this.viewElems.popUp.innerText = "No Items added";
    this.viewElems.popUp.style.visibility = "visible";
}
nonExistMessage = () => {
    this.viewElems.popUp.innerText = "Show is not in favorites";
    this.viewElems.popUp.style.visibility = "visible";
}

addToFav = () => { // adding to favorites function using Local Storage
    let storage = JSON.parse(localStorage.getItem('showID')); 
    if (storage === null) { 
        storage = []; 
    }
 let input = event.target.dataset 
 let idsArr = storage.map( show => show.showId) 
 let cnts = idsArr.includes(input.showId);
 if (cnts === true) {
     this.existMessage();
     setTimeout(this.hideMessage ,3000)
 } else {
    storage.push(input);
    this.addMessage();
    setTimeout(this.hideMessage, 3000);
    }
localStorage.setItem('showID', JSON.stringify(storage));

};

favsCheck = (id) => { // check is current ID is saved in LS
    let loadedShows = JSON.parse(localStorage.getItem('showID')); 
    if (loadedShows != null) {
    let showIdsArray = loadedShows.map( show => show.showId);
    let index = showIdsArray.includes(id);
    return index;
    }
}

favsLoad = () => { // loading favorites from LS function
        this.viewElems.showsWrapper.innerHTML = ""
        let loadedShows = JSON.parse(localStorage.getItem('showID')); 
    if (loadedShows === null) {
this.emptyFavsMessage()
setTimeout(this.hideMessage, 4000);
        let showIdsArray = [];
    } else {
        let showIdsArray = loadedShows.map( show => show.showId);
        let iterableArray = [];
        for ( const show of showIdsArray) { 
            const promise1 = getShowsById(show)
            promise1.then(iterableArray.push(promise1))
            }
    return iterableArray;
}
    };

renderfav = show => { // rendering loaded shows from LS on cards
            Array.from( document.querySelectorAll('[data-show-id]')).forEach(btn => btn.removeEventListener('click', this.openDetailsView)) 
            const iterArray = this.favsLoad()
            if (iterArray.length === 0) {
                this.emptyFavsMessage()
                setTimeout(this.hideMessage, 4000);
            }
            for ( const show of iterArray) {
                show.then( show => { 
                    const card = this.createShowCard(show)
                    this.viewElems.showsWrapper.appendChild(card)
                    this.showsSet = show;
                })
            }
};

removeFav = () => { // removing favorites shows from Local Storage
     let storage = JSON.parse(localStorage.getItem('showID')); 
     let showIdsArray = storage.map( show => show.showId);
     let input = event.target.dataset
     const index = showIdsArray.indexOf(input.showId); 
     if ( index > -1 ) {
         storage.splice(index, 1)
         localStorage.setItem('showID', JSON.stringify(storage));
         this.removeMessage()
         setTimeout(this.hideMessage ,3000)
         this.renderfav()
        } else {
this.nonExistMessage();
setTimeout(this.hideMessage ,3000);
        }
};
 
closeDetailsView = event => { // changing view from details to general
    const { showId } = event.target.dataset
    const closeBtn = document.querySelector(`[id="showPreviev"] [data-show-id="${showId}"]`)
    this.viewElems.showPreview.style.display = "none"
    this.viewElems.showsWrapper.style.display = "flex"
    this.viewElems.label1.style.display = "flex"
    this.viewElems.InputFields.style.display = "flex"
    this.viewElems.keywords.style.display = "flex"
    this.viewElems.showPreview.innerHTML = ""
};

openDetailsView = event => { // changing view from general to shows details
    const { showId } = event.target.dataset
    getShowsById(showId).then(show => {
        const card = this.createShowCard(show, true)
        this.viewElems.showPreview.appendChild(card)
        this.viewElems.showPreview.style.display = "block"
        this.viewElems.showsWrapper.style.display = "none"
        this.viewElems.label1.style.display = "none"
        this.viewElems.InputFields.style.display = "none"
        this.viewElems.keywords.style.display = "none"
        })
};

replaceAll = (str, map) => { // cleaning downloaded shows description from html tags
    map = {
        '<p>': '',
        '</p>': '',
        '<b>': '',
        '</b>': '',
        '<i>': '',
        '</i>': ''
    }
    for(this.key in map){ 
    str = str.replaceAll(this.key, map[this.key]); 
    }
    return str;
};
    
createShowCard = (show, isDetailed) => { // creating div card for each show function
const divCard = createDOMElem('div', 'card')
const divCardBody = createDOMElem('div', 'card-body')
const h5 = createDOMElem('h5', 'card-title', show.name)
const btn = createDOMElem('button', 'btn btn-primary', 'Show Details', 'primaryBtn', 'showDet')
const btn2 = createDOMElem('button2', 'btn btn-primary', '+', 'primaryBtn', 'favBtn')
const btn3 = createDOMElem('button3', 'btn btn-primary', '-', 'primaryBtn', 'fav2Btn')
let paragraph = show.summary
let correctParagraph

if (paragraph != null) {
correctParagraph = this.replaceAll(paragraph, this.map)
}
let img, p;
if (show.image) {
    if (isDetailed) {
        img = createDOMElem('div', 'card-preview-bg');
        img.style.backgroundImage = `url('${show.image.original}')`
    } else {
        img = createDOMElem('img', 'card-img-top', null, show.image.medium)
    }
} else {
    if (isDetailed) {
        img = createDOMElem('div', 'card-preview-bg');
        img.style.backgroundImage = `url('https://via.placeholder.com/410x495?text=No Image')`
    } else {
    img = createDOMElem('img', 'card-img-top', null, 'https://via.placeholder.com/210x295?text=No Image')
    }
} 
if (show.summary) {
    if( isDetailed) {
        p = createDOMElem('p', 'card-text', correctParagraph )
    } else {
        p = createDOMElem('p', 'card-text', `${correctParagraph.slice(0, 70)}...`)
    }
} else {
    p = createDOMElem('p', 'card-text', 'There is no summary for this Show yet')
}

if (isDetailed) {
    btn.addEventListener('click', this.closeDetailsView)
    btn.innerText = "Back"
    btn2.style.visibility = "hidden"
    btn3.style.visibility = "hidden"
   
} else {
    btn.addEventListener('click', this.openDetailsView);
    btn2.addEventListener('click', this.addToFav);
    btn3.addEventListener('click', this.removeFav); 
}

let suppId = show.id
let strID = suppId.toString();
let checker = this.favsCheck(strID);

if (checker) {
    btn2.style.backgroundColor = "rgb(56, 111, 212)";
    btn2.style.color = "white"
}

if (checker === false) {
    btn3.style.visibility = "hidden"

}


btn.dataset.showId = show.id
btn2.dataset.showId = show.id
btn3.dataset.showId = show.id
btn.addEventListener('click', this.closeDetailsView)
divCard.appendChild(divCardBody)
divCardBody.appendChild(img)
divCardBody.appendChild(h5)
divCardBody.appendChild(p)
divCardBody.appendChild(btn)
divCardBody.appendChild(btn2)
divCardBody.appendChild(btn3)
return divCard;

};

}; // end of AppClass

document.addEventListener('DOMContentLoaded', new Tvapp()); // loading function
