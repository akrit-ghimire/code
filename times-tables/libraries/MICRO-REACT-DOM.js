// VERSION: 1.0.1
// MADE BY AKRIT GHIMIRE
export const version = 'V1.0.1'

let globalID = 0
let globalParent
let componentState = new Map()
let domObjectTree
let App



// ****************************************** REACT HOOKS ******************************************

// store application data
export const useState = (initialState) => {
    const id = globalID
    const parent = globalParent
    globalID++
    return (() => {// closure to scope vars
        const { cache, component } = componentState.get(parent)
        if (cache[id] == null) {
            cache[id] = {value: typeof initialState === 'function' ? initialState() : initialState,}
        }
        const setState = state => {
            // const { component } = componentState.get(parent)
            if (typeof state === 'function') {
                cache[id].value = state(cache[id].value)
            } else {
                cache[id].value = state
            }
            const newDomObjectTree = render(App, root)
            findDiffAndReRender(domObjectTree, newDomObjectTree)
            domObjectTree = newDomObjectTree // trouble maker - now a bug fix: didn't set new dom to old dom therefore always comparing to original dom
            runEventsFunction() // create all events from new dom
        }
        return [cache[id].value, setState]
    })()
}
// runs when a dependency changes
export const useMemo = (callback, dependencies) => {
    const id = globalID
    const parent = globalParent
    globalID++

    return (() => {// closure to scope vars
        const { cache } = componentState.get(parent)
        if (cache[id] == null) {
            cache[id] = {dependencies: undefined}
        }

        const dependenciesChanged = 
            dependencies == null || // always rerender
            dependencies.some((dependency, index) => { // check to see if different
                return (
                    cache[id].dependencies == null || // if first time just do it
                    cache[id].dependencies[index] !== dependency // otherwise check to see if different
                )
            })
        if (dependenciesChanged) {
            cache[id].value = callback()
            cache[id].dependencies = dependencies
        }
        return cache[id].value
    })()
}
// requires modification for lazy running -- runs when a depencency changes
export const useEffect = (callback, dependencies) => {
    const id = globalID
    const parent = globalParent
    globalID++

    (() => {// closure to scope vars
        const { cache } = componentState.get(parent)
        if (cache[id] == null) {
            cache[id] = {dependencies: undefined}
        }

        const dependenciesChanged = 
            dependencies == null || // always rerender
            dependencies.some((dependency, index) => { // check to see if different
                return (
                    cache[id].dependencies == null || // if first time just do it
                    cache[id].dependencies[index] !== dependency // otherwise check to see if different
                )
            })
        if (dependenciesChanged) {
            if (cache[id].cleanup != null) cache[id].cleanup()
            cache[id].cleanup = callback()
            cache[id].dependencies = dependencies
        }
    })()
}
// detects change in url hash and calls passed in function handler
export const useHash = (hashChangeHandler) => {
    useEffect(() => {
        window.addEventListener('hashchange', hashChangeHandler);
        return () => window.removeEventListener('hashchange', hashChangeHandler);
    }, [version]);
}
// best for onclick functions
const runEvents = []
const runEventsFunction = () => {
    // run effects/events
    while(runEvents.length > 0) {
        const func = runEvents.pop()
        func()
    }
    // runEvents.forEach(event => event())
}
export const useEvent = (callback) => {
    const id = globalID
    const parent = globalParent
    globalID++

    runEvents.push(() => {// closure to scope vars
        const { cache } = componentState.get(parent)
        if (cache[id] == null) {
            cache[id] = {}
        }
        // if (dependenciesChanged) {
        if (cache[id].cleanup != null) cache[id].cleanup()
        cache[id].cleanup = callback()
        return callback
        // }
    })
}
// ** Shortcuts
export const onclick = (buttonId, functionRef) => {
    useEvent(() => {
        const button = document.getElementById(buttonId)
        button.onclick = functionRef
        return () => {
            // no clean up as new func will overwrite old onclick func
        }
    })
    return `data-onclick-${functionRef.name}`
}
export const onchange = (buttonId, functionRef) => {
    useEvent(() => {
        const button = document.getElementById(buttonId)
        button.onkeyup = functionRef
        return () => {
            // no clean up as new func will overwrite old onclick func
        }
    })
    return `data-onchange-${functionRef.name}`
}

// ****************************************** REACT RENDER FUNCTIONS ******************************************

// for all components
export const renderComponent = (component, props, parentName) => {
    if (typeof component !== 'function') return
    globalParent = parentName
    //
    const state = componentState.get(parentName) || { cache: [] }
    componentState.set(parentName, {...state, component})
    // pass in default component function name then properties object
    let output = component(component.name)(props)
    // globalID = 0 // removed V1.0.1 // hopefully to allow multiple render components in same component
    // html shorthands for dynamically appending id to tags
    if (output.includes('-id-') && props.elemId !== null) {
        output = output.replace(/-id-/g, `id="${props.elemId}"`)
    }
    //
    return output
}
// for root component
const render = (component, parentName) => {
    const output = renderComponent(component, {}, parentName)
    globalID = 0 // added V1.0.1
    return createComponentObject(output)
}

export const getRoute = () => {
    return window.location.hash.replace('#', '')
}

// ****************************************** REACT VIRTUAL DOM ******************************************

export const unpack = (elementArray) => elementArray.join('')
const getAttributes = (child) => child.getAttributeNames().reduce((acc, name) => ({ ...acc, [name]: child.getAttribute(name) }), {});
const setAttributes = (child, attributes) => Object.keys(attributes).forEach((attribute) => child.setAttribute(attribute, attributes[attribute]))

let defaultIDPrefix = new Date().getTime() + "#M#R#"
let defaultID = 0

const createComponentObject = (domString) => {
    const formatDOM = () => {
        const domContainer = document.createElement('div')
        domContainer.innerHTML = domString
        return domContainer
    }
    const createComponent = (child) => {
        const tag = child.tagName.toLowerCase()
        const attributes = getAttributes(child)
        
        if (!attributes.id) {attributes.id = defaultIDPrefix + defaultID; defaultID++}
    
        let children = []
        const childrenArray = Array.from(child.children)
        if (childrenArray.length > 0) childrenArray.forEach(kid => children.push(createComponent(kid)))
        else children = child.innerText
        
        return { tag, attributes, children }
    }
    const rootNode = formatDOM().children[0]
    const componentObject = createComponent(rootNode)
    defaultID = 0
    return componentObject
}
const createDOMElement = ({ tag,  attributes = {}, children = "", }) => {
    const element = document.createElement(tag)
    setAttributes(element, attributes)
    if (typeof children === "string") element.innerHTML = children
    else children.map(createDOMElement).forEach(element.appendChild.bind(element))
    return element
}
// find different and change algorithm
const attrObjDifferent = (a, b) => {
    const allKeys = Array.from(new Set([...Object.keys(a), Object.keys(b)]))
    return allKeys.some(k => a[k] !== b[k])
}
const replaceNode = (nodeId, newNode) => document.getElementById(`${nodeId}`).replaceWith(createDOMElement(newNode))
const findDiffAndReRender = (previousNode, currentNode) => {
    // console.log(previousNode, currentNode) for debugging
    // Set current inspected DOM element (for replacing purposes)
    const nodeId = previousNode.attributes.id

    // If the child is a text then check if previous and current values are different
    if (typeof currentNode.children == 'string') {
        if (previousNode.children !== currentNode.children) {
            // Only refresh node if it isn't exempt of text refreshes
            if (!previousNode.attributes['data-refresh-exempt'] == 'text') {
                console.log('looking at text')
            }
            replaceNode(nodeId, currentNode)
        }
    }

    else if (currentNode.children.length !== previousNode.children.length) {
        // if a child has been added, append child instead
        // currentNode.children.forEach((child, index) => {
        //     if (index >= previousNode.children.length) {
        //         document.getElementById(nodeId).append(createDOMElement(child))
        //     }
        // })
        // error duplication exponentially with above code
        replaceNode(nodeId, currentNode)
        document.querySelectorAll('code').forEach((el) => {
            hljs.highlightElement(el);
        });
    }
    // If has children then loop through them
    else currentNode.children.forEach((child, index) => findDiffAndReRender(previousNode.children[index], child))
    // If any of the attributes have been changed then
    if (attrObjDifferent(previousNode.attributes, currentNode.attributes)) {
        replaceNode(nodeId, currentNode)
    } 
}

// ****************************************** REACT ROOT RENDER ******************************************

const root = document.getElementById('root')
export const renderRoot = (rootComponent) => {
    App = rootComponent // this is for setState later on
    domObjectTree = render(rootComponent, root)
    root.innerHTML = ''
    root.append(createDOMElement(domObjectTree))
    runEventsFunction()
}

// ****************************************** INDEX.HTML ALTERING ******************************************
export const setTitle = (titleText) => {
    const title = document.createElement('title')
    title.innerText = titleText
    document.querySelector('head').append(title)
}
export const setStyle = (linkRef) => {
    const link = document.createElement('link')
    link.href = linkRef
    link.rel = "stylesheet"
    document.querySelector('head').append(link)
}
export const setIcon = (linkRef) => {
    const link = document.createElement('link')
    link.href = linkRef
    link.rel = "icon"
    link.type = 'image/x-icon'
    document.querySelector('head').append(link)
}

// ****************************************** MICRO-REACT-DOM ******************************************
// ****************************************** BY AKRIT ******************************************

// ****************************************** SOURCES  ******************************************

// get element attributes as key value object
// https://bobbyhadz.com/blog/javascript-get-all-attributes-of-element#:~:text=To%20get%20all%20of%20the,and%20value%20of%20the%20attribute.

// Create a virtual dom
// https://www.youtube.com/watch?v=4LFBSkvJQjg - How Code Works - Youtube Channel

// Create react useState, useEffect, useMemo
// https://www.youtube.com/watch?v=YfnPk3nzWts - Web Dev Simplified - Youtube Channel

// I then merged them together and added my own functions to make this micro-react-dom more user friendly.

