'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User } = require('../users/models');

mongoose.Promise = global.Promise;

const PhraseSchema = mongoose.Schema({
  // _owner: { type: Schema.Types.ObjectId, ref: 'User' },
  phrase: {
    type: String,
    required: true,
  },
  owner: {type: String},  
});

PhraseSchema.methods.apiRepr = function () {
  return { 
    id: this._id,
    phrase: this.phrase,
    owner: this.owner    
  };
};

const Phrase = mongoose.models.Phrase || mongoose.model('Phrase', PhraseSchema);

module.exports = { Phrase };
