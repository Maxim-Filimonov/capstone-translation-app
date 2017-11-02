/* global $, render, api */
'use strict';

/**
 * 
 * Event Handlers validate input, update STATE and call render methods
 */

var handle = {
  signup: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const firstname = el.find('[name=firstname]').val().trim();
    const lastname = el.find('[name=lastname]').val().trim();
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    // const confirmPassword = el.find('[name=conf-password]').val().trim();
    el.find('[name=firstname]').val('');
    el.find('[name=lastname]').val('');
    el.find('[name=username]').val('');
    el.find('[name=password]').val('');
    el.find('[name=conf-password]').val('');

    api.signup(username, password, firstname, lastname)
      .then(() => {
        state.view = 'confirmation';
        render.page(state);
      }).catch(err => {
        if (err.reason === 'ValidationError') {
          console.error('ERROR:', err.reason, err.message);
        } else {
          console.error('ERROR:', err);
        }
      });
  },

  login: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    el.find('[name=username]').val('');
    el.find('[name=password]').val('');
    api.login(username, password)
      .then(response => {
        state.token = response.authToken;
        localStorage.setItem('authToken', state.token);
        state.view = (state.backTo) ? state.backTo : 'dashboard';
        return api.getAll(state.token);
      })
      .then(result => {
        state.list = result;
        render.results(state);
        render.page(state);
      }).catch(err => {
        state.action = null;
        if (err.reason === 'ValidationError') {
          console.error('ERROR:', err.reason, err.message);
        } else {
          console.error('ERROR:', err);
        }
      });
  },

  refresh: function (event) {
    // don't preventDefault on this one!
    const state = event.data;
    const timer = state.timer;
    if (state.action === 'getToken') { return; }
    if (state.token && timer.remaining < timer.warning) {
      api.refresh(state.token)
        .then(response => {
          state.token = response.authToken;
          localStorage.setItem('authToken', state.token);
        }).catch(err => {
          state.token = null; // remove expired token
          localStorage.removeItem('authToken');
          console.error('ERROR:', err);
        });
    }
  },

  checkExpiry: function (state) {
    const timer = state.timer;
    if (state.token) {
      var section = state.token.split('.')[1];
      var payload = window.atob(section);
      var decoded = JSON.parse(payload);
      var now = new Date();
      var expiry = new Date(0);
      expiry.setUTCSeconds(decoded.exp);

      timer.remaining = Math.floor(expiry - now);
      // console.log('Seconds: ', Math.floor(timer.remaining / 1000));
      if (timer.remaining < 0) {
        timer.status = 'expired';
      } else if (timer.remaining <= timer.warning) {
        timer.status = 'warning';
      } else {
        timer.status = 'ok';
      }
      render.status(state);
    }
  },

  translateNow: function(event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target).parent();
    const document = {
      phrase: el.find('#input').val(),
      language: el.find('#language :selected').text()
    };
    api.translate(document)
      .then(result => {

        // var audio = new Audio(result);
        // audio.play();

        const outputText = result.headers.get('x-phrase');
        render.translate(outputText);
        render.page(state);
      });
  },

  translate: function(event) {
    event.preventDefault();
    const state = event.data;
    const language = $('#dashboard').find('#language :selected').text();
    const id = $(event.target).closest('li').attr('id');
    api.detail(id, state.token)
      .then(result => {
        const phrase = result.phrase;
        const document = {phrase, language};
        return api.translate(document);
      })
      .then(result => {
        const outputText = result.headers.get('x-phrase');            
        render.translate(outputText);
        render.page(state);
      });
  },

  EditDetail: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const id = el.closest('li').attr('id');
    api.detail(id, state.token)
      .then(response => {
        state.item = response;
        render.edit(state);
        state.view = 'editDetail';
        render.page(state);      
      }).catch(err => {
        state.error = err;
      });
  },

  create: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target).parent();
    const savedPhrase = {
      phrase: el.find('#input').val()
    };
    el.find('#input').val('');
    api.create(savedPhrase, state.token)
      .then(response => {
        state.item = response;
        state.list = null; //invalidate cached list results
        render.create(state);
        render.page(state);
      }).catch(err => {
        if (err.status === 401) {
          state.backTo = state.view;
          state.view = 'signup';
          render.page(state);
        }
        console.error('ERROR:', err);
      });
  },

  update: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const document = {
      id: state.item.id,
      phrase: el.find('[name=phrase]').val()
    };
    api.update(document, state.token)
      .then(() => {
        render.detail(state);
        handle.viewEdit(event);
      }).catch(err => {
        if (err.status === 401) {
          state.backTo = state.view;
          state.view = 'signup';
          render.page(state);
        }
        console.error('ERROR:', err);
      });
  },

  remove: function (event) {
    event.preventDefault();
    const state = event.data;
    const id = $(event.target).closest('li').attr('id');
    api.remove(id, state.token)
      .then(() => {
        state.list = null;
        handle.viewEdit(event);
        render.page(state);
      });
  },

  viewEdit: function (event) {
    event.preventDefault();
    const state = event.data;
    return api.getAll(state.token)
      .then(result => {
        state.list = result;
        render.resultsEdit(state);
        state.view = 'edit';    
        render.page(state);
      }).catch(err => {
        state.action = null;
        if (err.reason === 'ValidationError') {
          console.error('ERROR:', err.reason, err.message);
        } else {
          console.error('ERROR:', err);
        }
      });
  },

  logout: function (event) {
    event.preventDefault();
    localStorage.removeItem('authToken');
    const state = event.data;
    state.view = 'login';
    render.page(state);
  },

  viewLogin: function (event) {
    event.preventDefault();
    const state = event.data;
    state.view = 'login';
    render.page(state);
  },

  viewSignup: function (event) {
    event.preventDefault();
    const state = event.data;
    state.view = 'signup';
    render.page(state);
  },

  viewDashboard: function (event) {
    event.preventDefault();
    const state = event.data;
    // state.token = localStorage.getItem('authToken');
    return api.getAll(state.token)
      .then(result => {
        state.list = result;
        render.results(state);
        state.view = 'dashboard';
        render.page(state);
      });
  }
};
