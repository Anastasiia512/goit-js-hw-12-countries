import './styles.css';
import axios from 'axios';
import debounce from 'lodash.debounce';
import PNotify from 'pnotify/dist/es/PNotify';
import 'pnotify/dist/PNotifyBrightTheme.css';
import listItemMarkup from './templates/listItem.hbs';
import listCountryMarkup from './templates/listcountry.hbs';
import clearContent from './clear-content-func';

const input = document.querySelector('input');
const ulList = document.querySelector('.list-allcountries');
const divList = document.querySelector('.list-onecountry');
const baseURL = 'https://restcountries.eu/rest/v2/name/';

const handleRequest = function (e) {
  const userInput = input.value;
  if (!userInput) {
    clearContent();
  }
  axios
    .get(`${baseURL}${userInput}`)
    .then(res => {
      console.log(res.data);
      if (res.data.length > 10) {
        clearContent();
        PNotify.error({
          title: '!',
          text: 'Too many matches found.Please enter more specific query!',
        });
        return;
      }
      if (res.data.length === 1) {
        clearContent();
        divList.insertAdjacentHTML('beforeend', listCountryMarkup(res.data[0]));

        return;
      }
      if (res.data.length >= 2 && res.data.length <= 10) {
        clearContent();
        ulList.insertAdjacentHTML('beforeend', listItemMarkup(res.data));
      }
    })
    .catch(err => {
      PNotify.error({
        title: '!',
        text: err.message,
      });
    });
};

input.addEventListener('input', debounce(handleRequest, 500));
