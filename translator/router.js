'use strict';
const express = require('express');
const app = express();
const router = express.Router();
const jsonParser = require('body-parser').json();

const watson = require('watson-developer-cloud');
const language_translator = watson.language_translator({
  url: 'https://gateway.watsonplatform.net/language-translator/api',
  username: '28abb1bc-a068-4748-9d1f-4a73d4a19d55',
  password: 'xuZEb1vpXlE8',
  version: 'v2'
});

const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
// const fs = require('fs');
const text_to_speech = new TextToSpeechV1({
  username: '2835f5d1-0a4a-4e04-87e6-3e0dfc85b3d7',
  password: 'p3ptpvHBWOzg'
});

router.post('/', jsonParser, (req, res, next) => {
  console.log('===req.body', req.body);
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
  if (req.body.language === 'Portuguese-BR') {
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
      let textForAudio = translation.translations[0].translation;
      const transcript = text_to_speech.synthesize({
        text: textForAudio,
        voice: speakingVoice,
        accept: 'audio/wav'
      });
      transcript.on('response', (response) => {
        if (req.query.download) {
          response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
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

// const translator = {
//   synthesize:
//   function translator(textToTranslate, lang, language_translator) { 
//     language_translator.translate({
//       url: 'https://gateway.watsonplatform.net/language-translator/api',
//       text: textToTranslate,
//       source: 'en',
//       target: lang
//     }, function(err, translation) {
//       if (err) {
//         console.log(err);
//       }
//       else {
          
//         let textToAudio = translation.translations[0].translation;
//         const transcript = textToSpeech.synthesize({
//           text: textToAudio,
//           voice: 'es-ES_EnriqueVoice',
//           accept: 'audio/wav'
//         });
//         transcript.on('response', (response) => {
//           if (req.query.download) {
//             response.headers['content-disposition'] = `attachment; filename=transcript.${getFileExtension(req.query.accept)}`;
//           }
//         });
//         transcript.on('error', function() {
//           console.log(error);
//           res.status(500).send(error);
  
//         });
//         transcript.pipe(res);
          
//       } 
//     });
//   }
// };

module.exports = { router };