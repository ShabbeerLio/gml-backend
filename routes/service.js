const express = require('express');
const router = express.Router()
const Note = require('../models/Service')
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// route1 : get all service using GET: "/api/service/fetchallservice" login required
router.get('/fetchallservice', fetchuser, async (req, res) => {
    try {
        const service = await Note.find({ user: req.user.id });
        res.json(service)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

// route2 : Add New service using POST: "/api/service/addservice" login required
router.post('/addservice', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
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

// route3 : Update service using PUT: "/api/service/updateservice/:id" login required

router.put('/updateservice/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newservice object
        const newservice = {};
        if (title) { newservice.title = title };
        if (description) { newservice.description = description };
        if (tag) { newservice.tag = tag };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newservice }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})

// route4 : Update service using Detele: "/api/service/deleteservice/:id" login required
router.delete('/deleteservice/:id', fetchuser, async (req, res) => {
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