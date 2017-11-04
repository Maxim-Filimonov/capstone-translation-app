/* global $ */
'use strict';
/**
 * RENDER METHODS
 * 
 * Primary Job: Direct DOM Manipulation
 * 
 * Rule of Thumb:
 * - Direct DOM manipulation OK
 * - Never update state/store
 * 
 */

const render = {
  page: function (state) {
    if (state.demo) {
      $('.view').css('background-color', 'gray');
      $('#' + state.view).css('background-color', 'white');
    } 
    else {
      const unwantedViews = ['login', 'signup', 'confirmation'];
      if (unwantedViews.includes(state.view)) {
        $('#nav').html('').append('<li>"A spectacular travel app!" - Thinkful</li>');
      } else {
        $('#nav').html('').append(`<li>Hello User!</li>
        <li><a href="" class="viewLogout js-viewLogout">Logout</a></li>`);
      }
      $('.view').hide();
      $('#' + state.view).show(); 
    }
  },

  results: function (state) {
    const allPhrases = state.list.map((phrase) => {
      return `<li id=${phrase._id}>
                ${phrase.phrase}
                <button class="translate js-translate">Translate!</button>
              </li>`;
    });
    $('.results').empty().append(allPhrases);
  },
  resultsEdit: function (state) {
    const allPhrases = state.list.map((phrase) => {
      return `<li id=${phrase._id}>
                ${phrase.phrase}
                <button class="edit js-edit">Edit</button>
                <button class="delete js-delete">Delete</button>
              </li>`;
    });
    $('.edit-results').empty().append(allPhrases);
  },
  create: function (state) {
    const newPhrase = (
      `<li id=${state.item.id}>
        ${state.item.phrase}
        <button class="translate js-translate">Translate!</button>
      </li>`);
    $('.results').append(newPhrase);
  },

  edit: function (state) {
    const el = $('#editDetail');
    const item = state.item;
    el.find('[name=phrase]').val(item.phrase);
  },
  
  detail: function (state) {
    const el = $('#detail');
    const item = state.item;
    el.find('.name').text(item.name);
  },

  //DISPLAY RESULT
  translate: function(phrase) {
    // $('#dashboard').find('.output').html('');
    $('#dashboard').find('.output').html(phrase);
  },

  clearSearch: function() {
    $('#dashboard').find('input').val('');
    $('#dashboard').find('.output').text('Your text will translate here.');
  },

  status: function (state) {
    const timer = state.timer;
    switch (timer.status) {
    case 'warning':
      $('#statusbar').css('background-color', 'orange').find('.message').text(timer.status);
      break;
    case 'expired':
      $('#statusbar').css('background-color', 'red').find('.message').text(timer.status);
      break;
    default:
      $('#statusbar').css('background-color', 'green').find('.message').text(timer.status);
      break;
    }
  }
};