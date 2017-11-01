'use strict';
/**
 * API: DATA ACCESS LAYER (using fetch())
 * 
 * Primary Job: communicates with API methods. 
 *  
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - No jquery on this page, use `fetch()` not `$.AJAX()` or `$.getJSON()`
 * - Do not call render methods from this layer
 * 
 */

const PHRASES_URL = '/api/phrases/';
const USERS_URL = '/api/users/';
const LOGIN_URL = '/api/auth/login/';
const REFRESH_URL = '/api/auth/refresh/';

function buildUrl(path, query) {
  var url = new URL(path, window.location.origin);
  if (query) {
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  }
  return url;
}

function normalizeResponseErrors(res) {
  if (!res.ok) {
    if (
      res.headers.has('content-type') &&
      res.headers.get('content-type').startsWith('application/json')
    ) {
      // It's a nice JSON error returned by us, so decode it
      return res.json().then(err => Promise.reject(err));
    }
    // It's a less informative error returned by express
    return Promise.reject({
      status: res.status,
      message: res.statusText
    });
  }
  return res;
}

var api = {
  signup: function (username, password, firstname, lastname) {
    const url = buildUrl(USERS_URL);
    const body = {
      username,
      password,
      firstname,
      lastname
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },

  login: function (username, password) {
    const url = buildUrl(LOGIN_URL);
    const base64Encoded = window.btoa(`${username}:${password}`);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Encoded}`,
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },

  refresh: function (token) {
    const url = buildUrl(REFRESH_URL);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },  

  getAll: function (token) {
    const url = buildUrl(PHRASES_URL);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },

  // search: function (query, token) {
  //   const url = buildUrl(PHRASES_URL, query);

  //   return fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,        
  //       'Accept': 'application/json'
  //     }
  //   }).then(normalizeResponseErrors)
  //     .then(res => res.json());
  // },

  details: function (id, token) {
    const url = buildUrl(`${PHRASES_URL}${id}`);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,                
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },

  create: function (savedPhrase, token) {
    const url = buildUrl(`${PHRASES_URL}`);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: savedPhrase ? JSON.stringify(savedPhrase) : null
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },  

  update: function (document, token) {
    const url = buildUrl(`${PHRASES_URL}${document.id}`);

    return fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: document ? JSON.stringify(document) : null
    }).then(normalizeResponseErrors);
    // .then(res => res.json());
  },

  remove: function (id, token) {
    const url = buildUrl(`${PHRASES_URL}/${id}`);

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.text());
  }
};