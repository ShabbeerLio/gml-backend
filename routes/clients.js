const express = require('express');
const router = express.Router()
const Note = require('../models/Clients')
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// route1 : get all clients using GET: "/api/clients/fetchallclients" login required
router.get('/fetchallclients', fetchuser, async (req, res) => {
    try {
        const clients = await Note.find({ user: req.user.id });
        res.json(clients)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

// route2 : Add New clients using POST: "/api/clients/addclients" login required
router.post('/addclients', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 3 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()

        res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

// route3 : Update clients using PUT: "/api/clients/updateclients/:id" login required

router.put('/updateclients/:id', fetchuser, async (req, res) => {
    const { title, description} = req.body;
    try {
        // Create a newclients object
        const newClients = {};
        if (title) { newClients.title = title };
        if (description) { newClients.description = description };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newClients }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})

// route4 : Update clients using Detele: "/api/clients/deleteclients/:id" login required
router.delete('/deleteclients/:id', fetchuser, async (req, res) => {
    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }

        // allows deletion  only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Succes": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})


module.exports = router