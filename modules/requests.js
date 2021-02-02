export const getShowsByKey = key => { // get shows by key 
   return fetch(`https://api.tvmaze.com/search/shows?q=${key}`).then(resp => resp.json())}
   

export const getShowsById = id => { // get shows by id 
    return fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`).then(resp => resp.json())
}
