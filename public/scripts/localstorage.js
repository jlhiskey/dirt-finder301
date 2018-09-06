'use strict';

function makeNewUserKey() {
  let randomUserKey = Math.floor((Math.random() * 99999) + 1);

  if(!localStorage.userKey){
    localStorage.setItem('userKey', randomUserKey);
  }

  let thisUserKey = JSON.parse(localStorage.getItem('userKey'));
  $('#userkey').val(thisUserKey);
  $('#home').attr('href', `/query/${thisUserKey}`);
  console.log('test', thisUserKey);
}

makeNewUserKey();


