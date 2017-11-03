'use strict';
const express = require('express');
const app = express();
const router = express.Router();
const jsonParser = require('body-parser').json();
const { LANG_TRANS_USER, LANG_TRANS_PASS, TEXT_TO_SPEECH_USER, TEXT_TO_SPEECH_PASS } = require('../config');

const watson = require('watson-developer-cloud');
const language_translator = watson.language_translator({
  url: 'https://gateway.watsonplatform.net/language-translator/api',
  username: LANG_TRANS_USER,
  password: LANG_TRANS_PASS,
  version: 'v2'
});

const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
// const fs = require('fs');
const text_to_speech = new TextToSpeechV1({
  username: TEXT_TO_SPEECH_USER,
  password: TEXT_TO_SPEECH_PASS
});

let translatedText;

router.post('/', jsonParser, (req, res, next) => {
  const textToTranslate = req.body.phrase;
  let languageToTranslate; 
  let speakingVoice;
  
  if (req.body.language === 'Spanish') {
    languageToTranslate = 'es-ES';
    speakingVoice = 'es-ES_EnriqueVoice';
  } 
  if (req.body.language === 'French') {
    languageToTranslate = 'fr-FR';
    speakingVoice = 'fr-FR_ReneeVoice';
  } 
  if (req.body.language === 'German') {
    languageToTranslate = 'de-DE';
    speakingVoice = 'de-DE_DieterVoice';
  } 
  if (req.body.language === 'Japanese') {
    languageToTranslate = 'ja-JP';
    speakingVoice = 'ja-JP_EmiVoice';
  } 
  if (req.body.language === 'Italian') {
    languageToTranslate = 'it-IT';
    speakingVoice = 'it-IT_FrancescaVoice';
  } 
  if (req.body.language === 'Portuguese-Br') {
    languageToTranslate = 'pt-BR';
    speakingVoice = 'pt-BR_IsabelaVoice';
  } 
  
  language_translator.translate({
    url: 'https://gateway.watsonplatform.net/language-translator/api',
    text: textToTranslate,
    source: 'en',
    target: languageToTranslate
  }, function(err, translation) {
    if (err) {
      console.log(err);
    }
    else {
      translatedText = translation.translations[0].translation;
      const transcript = text_to_speech.synthesize({
        text: translatedText,
        voice: speakingVoice,
        accept: 'audio/wav'
      });

      // // DISPLAY RESULT
      // res.json(translatedText);
      res.set('x-phrase', translatedText);
      
      // PLAY AUDIO
      transcript.on('response', (res) => {
        if (req.query.download) {
          res.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
        }
      });
      transcript.on('error', function() {
        console.log(error);
        res.status(500).send(error);
  
      });
      transcript.pipe(res);
    } 
  });
});

module.exports = { router };