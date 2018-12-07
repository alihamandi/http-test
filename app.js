/* 
 *this is the main file
*/

//dependencies
const http = require('http')
const url = require('url')
// i start this with a capital letter cause its a class
const StringDecoder = require('string_decoder').StringDecoder
const handlers = require('./handlers')


// create a server so it can deal with our request
let server = http.createServer((req, res) => {

    //getting the full data from the url
    let parsedUrl = url.parse(req.url, true)

    //knowing what route the user is calling
    let path = parsedUrl.pathname
    //using rejax to remove the extra slashes 
    var trimmedPath = path.replace(/^\/+|\/+$/g, '')

    /*getting methods post get put delete
    //post i take it from the user
    //get the user get data from me
    //put to put data in an already posted id
    delete is to delete certain id*/
    let method = req.method.toLowerCase()

    //getting the query and save it in an object
    let queryObject = parsedUrl.query

    //getting the headers
    let headers = req.headers

    //creating new object from StringDecoder
    let decoder = new StringDecoder('utf-8')

    let buffer = ''

    //there is an event listener
    //when the req start sending data (payload)
    req.on('data', (data) => {
        buffer += decoder.write(data)


    })

    //when the req stops sending data (payload)
    req.on('end', () => {
        buffer += decoder.end()

        //chosen a function that sould be called
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound ; 


        //setting the data we have to get from the request so we can send them to the chosenHandler
        let data = {
            'method':method,
            'query':queryObject,
            'payload':buffer,
            'headers':headers
        }

        //calling the chosenHundler
        chosenHandler(data , (statusCode,returnedData)=>{

            //handle the statusCode when the below function doesnt send a valid status
             statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            //handle the statusCode when the below function doesnt send a valid object
             returnedData = typeof(returnedData) == 'object' ? returnedData : {}

            //converting the object to a string

            let srtingPayload = JSON.stringify(returnedData)

            //to make the page display the json as it is 
            res.setHeader('content-type' , 'application/json')

            //returning the status code in the header
            res.writeHeader(statusCode)

            res.end(srtingPayload)

        })
    })
})



let router = {
    'home': handlers.home,
    'users': handlers.users,
    'ping': handlers.ping
}

server.listen(3000, () => {
    console.log('listing on port 3000');

})
