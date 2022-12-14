const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const res = require('express/lib/response')

// Utility function:
const log = console.log

// Config values, We are connecting to database with name `db-project1`
//mongodb db's default port is 27017 to avoid clash and issues, the code is defined on localhost and then around the postman,
//postman is like a vlc play to drop and play around the api's
const MONGODB_URI = 'mongodb://localhost:27017/db-project1'
const PORT = 3002
const commonErrorMessgDb = { message: "error", reason: "Some database error occured!" }

// Start backend server
const app = express()

// Connection to db
mongoose.connect(MONGODB_URI)
    .then(() => {
        log('::INFO::Connection to database successful!')
    }).catch(() => {
        log('- X - X - X - X - Oopsss!! Failed to connect to mongodb server')
    })

// LEARN: Below collectionModel will help us to interact with a collection named `notes` in the database.
// Defining collectionModel () with collectionName as `notes` and propertyName as `note`
const NoteM = mongoose.model('notes', { note: String })

// `cors` is generally used in all webapps as a convention to bypass future cors issues.
app.use(cors())

// Enable json parsing of request.body of all requests
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello i am homepage')
})

app.get('/abc', (req, res) => {
    res.send('hello i am page abc')
})
app.get('/xyz', (req, res) => {
    res.send('hello i am page xyz')
})
 
app.get('/user/sahil', (req, res) => {
    let data = {name: 'sahil rajput', username: 'sahilrajput03', age: 10}
    res.send(data)
})

// Making a POST endping @ http://localhost:3001/api/todos so we can add notes to mongo database
// LEARN: req stands for request and res stands for response
app.post('/api/todos', async (req, res) => {
    log('received request was here.....')
    let todo
    if (req.body && req.body.todo) {
        todo = req.body.todo
        log('RECEIVED TODO: ', todo)
    }

    // LEARN: Make a note document. Also, noteDoc means noteDocument
    const note = new NoteM({ note: todo })

    // LEARN: Using try and catch coz the database can throw error anytime and can crash our server anytime for any general database errors that occur all the time with any databases!
    try {
        // LEARN: Now we'll save the document to database
        const noteDoc = await note.save()
        log('SAVED TO DB: ', noteDoc.note)

        // LEARN: Fetch all notes from database
        const notes = await NoteM.find({})

        res.json(notes.map((doc) => doc.note))
        return

    } catch (error) {
        res.json(commonErrorMessgDb)
        return
    }
})

// Making a GET endpoint @ http://localhost:3001/api/todos so we fetch notes from mongo from anywhere
// TIP: You can browse http://localhost:3001/api/todos in browser to get all notes
app.get('/api/todos', async (req, res) => {

    try {
        // LEARN: Fetch all notes from database
        const notes = await NoteM.find({})
        const notesDocuments = notes.map((doc) => doc.note)
        log('ALL NOTES FROM DB', notesDocuments)

        res.json(notesDocuments)

    } catch (error) {
        res.json(commonErrorMessgDb)

    }
})

app.listen(PORT, () => log('::Server is listening @ ', PORT))
