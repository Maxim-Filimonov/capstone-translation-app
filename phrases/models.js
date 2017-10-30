'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const PhraseSchema = mongoose.Schema({
  phrase: {
    type: String,
    required: true,
  },
  username: {
    type: String
  }
});

PhraseSchema.methods.apiRepr = function () {
  return { 
    id: this._id,
    phrase: this.phrase,
    username: this.username 
  };
};

const Phrase = mongoose.models.Phrase || mongoose.model('Phrase', PhraseSchema);

module.exports = { Phrase };
