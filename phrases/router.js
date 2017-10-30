'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Phrase } = require('./models');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const basicAuth = passport.authenticate('basic', { session: false, failWithError: true  });
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.get('/', jwtAuth, (req, res) => {
  Phrase
    .find(req.user.id = Phrase.id)
    .then(phrases => {
      res.status(200).json(phrases);
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});
 
router.post('/', jsonParser, jwtAuth, (req, res) => {
  if(!('phrase' in req.body)){
    return res.status(422).json({message: 'Phrase field is empty'});
  }

  if(typeof req.body.phrase !== 'string'){
    return res.status(422).json({message: 'Incorrect field type: expected string'});
  }

  let {phrase} = req.body;
  phrase = phrase.trim();

  if (phrase === '') {
    return res.status(422).json({message: 'Incorrect phrase length'});
  }

  return Phrase.create({
    phrase,
    id: req.user.id
  })
    .then(phrase => {
      res.status(201).json(phrase.apiRepr());
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({message: 'Request path id and request body id values must match'});
  }

  const updated = {};
  const updateableFields = ['phrase'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Phrase
    .findByIdAndUpdate(req.param.id, {$set: updated}, {new: true})
    .then(updatedPhrase => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
  Phrase
    .findById(req.params.id)
    .then(phrase => {
      let userIdFromPhrase = phrase._id;
      let userIdFromToken = req.user.id;
      console.log(req.user);   
      if(userIdFromPhrase !== userIdFromToken){
        return res.status(400).json({message: 'You are not authorized to delete the phrase'});
      }
    }
    );
    
  Phrase
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted phrase with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

module.exports = { router };