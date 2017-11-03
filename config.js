'use strict';
require('dotenv').config();

exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/translation-app';

exports.TEST_DATABASE_URL = 
    process.env.TEST_DATABASE_URL ||
    global.TEST_DATABASE_URL ||
    'mongodb://localhost/jwt-auth-demo-test';

exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';


exports.LANG_TRANS_USER = process.env.LANG_TRANS_USER;
exports.LANG_TRANS_PASS = process.env.LANG_TRANS_PASS;
exports.TEXT_TO_SPEECH_USER = process.env.TEXT_TO_SPEECH_USER;
exports.TEXT_TO_SPEECH_PASS = process.env.TEXT_TO_SPEECH_PASS;