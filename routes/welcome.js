const express = require('express');
const router = express.Router()
const Note = require('../models/Welcome')
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// route1 : get all welcome using GET: "/api/welcome/fetchallwelcome" login required
router.get('/fetchallwelcome', fetchuser, async (req, res) => {
    try {
        const welcome = await Note.find({ user: req.user.id });
        res.json(welcome)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

// route2 : Add New welcome using POST: "/api/welcome/addwelcome" login required
router.post('/addwelcome', fetchuser, [
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

// route3 : Update welcome using PUT: "/api/welcome/updatewelcome/:id" login required

router.put('/updatewelcome/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newwelcome object
        const newWelcome = {};
        if (title) { newWelcome.title = title };
        if (description) { newWelcome.description = description };
        if (tag) { newWelcome.tag = tag };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newWelcome }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})

// route4 : Update welcome using Detele: "/api/welcome/deletewelcome/:id" login required
router.delete('/deletewelcome/:id', fetchuser, async (req, res) => {
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