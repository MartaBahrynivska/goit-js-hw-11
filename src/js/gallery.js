import Notiflix from "notiflix";
import axios from 'axios';

const searchForm = document.querySelector('.js-search-form');
const gallery = document.querySelector('.js-gallery list');
const loadMore = document.querySelector('.js-load-more');
let page = 1;
let searchValue;
let per_page = 20;


searchForm.addEventListener("submit", onSubmit);
loadMore.addEventListener("click", onClick);


function onSubmit(event) {
    event.preventDefault()
    page = 1;
    console.log(event);
    const  searchQuery  = event.currentTarget.elements;
    searchValue = searchQuery.value
    
    
}

function onClick() {
    page += 1;
    searchingSystem(page)
        .then(data => {
            console.log(data.data.hits)
            gallery.insertAdjacentHTML("beforeend", createMarkup(data.data.hits))

})
.catch (error => console.log(error))
}


async function search() {
    try {
        const data = await searchingSystem(page, per_page);
        if (data.data.totalHits === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            loadMore.style.display = 'none'
        } else {
            loadMore.style.display = "block"
            Notiflix.Notify.success("Hooray! We found totalHits images.");
        }
        if (per_page >= data.data.totalHits) {
            loadMore.style.display = "none"
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        }
        gallery.innerHTML = createMarkup(data.data.hits)
    } catch (error) {
        console.log(error);
    }
};


async function searchingSystem(page = 1) {
    const BASE_URL = "https://pixabay.com/api/";
    const key = "41267904-288ba903f65ff7510d19cbcee";
    const query = searchValue;

    
    const results = await axios.get(`${BASE_URL}`, {
        params: {
            key: key,
            query: query,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: page,
            per_page,
        }
    });
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
    `).join("");

}

