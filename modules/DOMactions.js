const _getDOMElem = (attribute, value) => {  // find DOM element by attribute and its value
return document.querySelector(`[${attribute}= "${value}"]`)
}   

export const mapListToDOMElements = (listofValues, attribute) => { // map DOM elements to object in JS
    const _viewElems = {} 
    for (const value of listofValues) { 
        _viewElems[value] = _getDOMElem(attribute, value); 
    }
    return _viewElems;
}

export const createDOMElem = (tagName, className, innerText, src, id) => { // Creating DOM elements for further use
const tag = document.createElement(tagName) 
tag.classList = className 
if (innerText) {tag.innerText = innerText} 
if (src) { tag.src = src}
if (id) {tag.id = id}

return tag
}
