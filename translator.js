'use strict';
const express = require('express');
const app = express();


const watson = require('watson-developer-cloud');
const language_translator = watson.language_translator({
    url: 'https://gateway.watsonplatform.net/language-translator/api',
    username: '28abb1bc-a068-4748-9d1f-4a73d4a19d55',
    password: 'xuZEb1vpXlE8',
    version: 'v2'
});

const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const fs = require('fs');
const textToSpeech = new TextToSpeechV1({
    username: '2835f5d1-0a4a-4e04-87e6-3e0dfc85b3d7',
    password: 'p3ptpvHBWOzg'
});

function translator2(textToTranslate, lang, language_translator) { 
    language_translator.translate({
      url: 'https://gateway.watsonplatform.net/language-translator/api',
      text: textToTranslate,
      source: 'en',
      target: lang
    }, function(err, translation) {
      if (err) {
        console.log(err);
      }
      else {
        
        let textToAudio = translation.translations[0].translation;
        const transcript = textToSpeech.synthesize({
            text: textToAudio,
            voice: 'es-ES_EnriqueVoice',
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
  }

app.get('/api/synthesize', (req, res, next) => {
    const textToTranslate = 'where is the bathroom ?'
    language_translator.translate({

        url: 'https://gateway.watsonplatform.net/language-translator/api',
        text: textToTranslate,
        source: 'en',
        target: 'es-ES'
      }, function(err, translation) {
        if (err) {
          console.log(err);
        }
        else {
          //console.log(translation);
          let textToAudio = translation.translations[0].translation;
          const transcript = textToSpeech.synthesize({
              text: textToAudio,
              voice: 'es-ES_EnriqueVoice',
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

app.listen(8080)