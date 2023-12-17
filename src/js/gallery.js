import Notiflix, { Notify } from "notiflix";
import axios from 'axios';


const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "41267904-288ba903f65ff7510d19cbcee";
const perPage = 40;


const fetchData = async (page, query) => {
  try {
      return await axios.get(`${BASE_URL}`, {
          params: {
              key: API_KEY,
              q: query,
              image_type: "photo",
              orientation: "horizontal",
              safesearch: true,
              page: page,
              per_page: perPage,

        }
      });
    
    // return response.data;
    
  } catch (error) {
    // Handle error
    console.error(error);
  }
};

fetchData();

const formEl = document.querySelector('.js-search-form');
const ulEl = document.querySelector('.js-gallery');
const moreBtnEl = document.querySelector('.js-load-more');

let page = 1;
let query = null;

formEl.addEventListener('submit', onSubmit)
moreBtnEl.addEventListener('click', onClick)


async function onSubmit(evt) {
  evt.preventDefault()
  page = 1;
  const searchQuery = evt.target.elements['user-search-query'].value.trim()
  query = searchQuery;
  console.log(searchQuery);
  try {
    const { data } = await fetchData(page, query); 
    const { totalHits, total, hits } = data;
    if (hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    ulEl.innerHTML = createMarkup(hits);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
    if (totalHits > perPage) {
      moreBtnEl.classList.remove('is-hidden');
    }

  } catch (error) {
    console.log(error.message);
  }
}

async function onClick(evt) {
  page += 1;
  try {
    const { data } = await fetchData(page, query); 
    const { totalHits, total, hits } = data;
    ulEl.insertAdjacentHTML('beforeend', createMarkup(hits))
    const lastPage = Math.ceil(totalHits / perPage)
    if (lastPage === page) {
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
      moreBtnEl.classList.add('is-hidden')
    }
    
  } catch (error) {
    console.log(error.message);
  }
}


function createMarkup(arr) {
  return arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
    <div class="photo-card">
<img class="imag-card" src="${webformatURL}" alt="${tags}" loading="lazy"/>
<div class="info">
<p class="info-item">
  <b>Likes: ${likes}</b>
</p>
<p class="info-item">
  <b>Views: ${views}</b>
</p>
<p class="info-item">
  <b>Comments: ${comments}</b>
</p>
<p class="info-item">
  <b>Downloads: ${downloads}</b>
</p>
</div>
</div>
    `).join("")
}