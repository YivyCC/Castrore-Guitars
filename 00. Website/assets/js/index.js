// My personal api token for Rverb
const API_KEY = '8087b4cc3e1b804b54d42e652af6a0cd72921f818384e691edf9ee99088f64ec';

// Function to fetch products
async function fetchListings(searchTerm, url) {
  var searchURL = `https://api.reverb.com/api/listings?&per_page=25&query=${encodeURIComponent(searchTerm)}`;
  // const url = `https://api.reverb.com/api/listings/1234`; INDIVIDUAL SEARCH BY ID
  
  if (url) searchURL = url;

  try {
    const response = await fetch(searchURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/hal+json',
        'Accept': 'application/hal+json',
        'Accept-Version': '3.0',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data:', response.statusText);
    } else {
      const data = await response.json();
      console.log(data);
      displayProducts(data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to display the fetched products
function displayProducts(data) {
  deleteProducts();
  if (data.listings.length > 0) { // If products exist...
    for (var product of data.listings){
      createElement(product);
    }
    if (data.current_page == 1) { // if it is the first page,there will not be a 'prev' btn
      displayPagination('', data._links.next.href, data.current_page, data.total_pages);
    } else if (data.current_page == data.total_pages){ // If it is the last page there will not be a 'next' btn
      displayPagination(data._links.prev.href, '', data.current_page, data.total_pages);
    } else {
      displayPagination(data._links.prev.href, data._links.next.href, data.current_page, data.total_pages);
    }

  } else {
    createProdNotFoundElem(data.suggestion);
  }
}

const prevListHTMLElement = document.querySelector('.prev');
const nextListHTMLElement = document.querySelector('.next');
const pageListHTMLElement = document.querySelector('.current-page');
// function to add the 'next/prev' button(s)
function displayPagination(prev, next, currentPage, totalPages){
  if (prev != ''){
    prevListHTMLElement.style.display = 'block';
    const newPrevBtn = document.createElement('button');
    newPrevBtn.innerText = '❮';
    newPrevBtn.className = 'main__prev-btn main__prev-next-btns';
    prevListHTMLElement.appendChild(newPrevBtn);
    newPrevBtn.addEventListener('click', () => {
      fetchListings('', prev);
      const elementPosition = mainGrid.getBoundingClientRect().top + window.scrollY -100;
      window.scrollTo({top: elementPosition, behavior: 'smooth'});
    });
  } else {
    prevListHTMLElement.style.display = 'none';
  }

  if (next != ''){
    nextListHTMLElement.style.display = 'block';
    const newNextBtn = document.createElement('button');
    newNextBtn.innerText = '❯';
    newNextBtn.className = 'main__next-btn main__prev-next-btns';
    nextListHTMLElement.appendChild(newNextBtn);
    newNextBtn.addEventListener('click', () => {
      fetchListings('', next);
      const elementPosition = mainGrid.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({top: elementPosition, behavior: 'smooth'});
    });
  } else {
    nextListHTMLElement.style.display = 'none';
  }

  const newPaginationElement = document.createElement('span');
  newPaginationElement.className = 'main__page-counter';
  newPaginationElement.innerText = `Page ${currentPage} of ${totalPages}`;
  pageListHTMLElement.appendChild(newPaginationElement);
}

const mainElement = document.querySelector('.main');
// Function to display when a search result is not found
// This is not necessary as I would directly show results
// based on the suggestion, regardless of the user's mistakes/typos,
// but I wanted to play with this option and showcase the feature.
function createProdNotFoundElem(suggestion){
  const searchInputVal = searchInput.value;
  const newDiv = document.createElement('div');
  newDiv.className = 'main__search-not-found';
  mainElement.appendChild(newDiv);

  const newSpan = document.createElement('span');
  newSpan.innerHTML = `Could not find any products related to <strong>${searchInputVal}</strong>.`;
  newDiv.appendChild(newSpan);

  const newLink = document.createElement('a');
  newLink.innerHTML = `Did you mean <strong>${suggestion}</strong>?`;
  newDiv.appendChild(newLink);
  newLink.addEventListener('click', () => {
    searchInput.value = suggestion;
    fetchListings(suggestion);
  });
}

const mainGrid = document.querySelector('.main__grid');
// Function to create elements for each product
function createElement(product) {
  const newFig = document.createElement('figure');
  newFig.className = 'main__grid-element';
  mainGrid.appendChild(newFig);

  const newDiv = document.createElement('div');
  newDiv.className = 'main__image-container';
  newFig.appendChild(newDiv);

  const newImg = document.createElement('img');
  newImg.className = 'main__item-image';
  newImg.alt = product.title;
  newImg.src = product._links.photo.href;
  newDiv.appendChild(newImg);

  const newCaption = document.createElement('figcaption');
  newCaption.className = 'main__item-description';
  newCaption.innerText = product.title;
  newFig.appendChild(newCaption);

  const newSpan = document.createElement('span');
  newSpan.className = 'main__item-price';
  newSpan.innerText = product.price.display;
  newFig.appendChild(newSpan);

  const newBtn = document.createElement('button');
  newBtn.className = 'main__add-to-cart-btn';
  newBtn.innerHTML = 'Add to Cart';
  newFig.appendChild(newBtn);

  const newLink = document.createElement('a');
  newLink.className = 'main__item-reverb-link';
  newLink.href = product._links.web.href;
  newLink.target = '_blank';
  newLink.innerText = 'View on Reverb';
  newFig.appendChild(newLink);
}

// Function to delete currently displayed products
function deleteProducts(){
  // remove elements from the 'Not found' section (if any)
  const notFoundElem = document.querySelector('.main__search-not-found');
  if (notFoundElem) mainElement.removeChild(notFoundElem);

  // Remove page counter elements
  const prevBtn = document.querySelector('.main__prev-btn');
  if (prevBtn) prevListHTMLElement.removeChild(prevBtn);

  const nextBtn = document.querySelector('.main__next-btn');
  if (nextBtn) nextListHTMLElement.removeChild(nextBtn);

  const pageCounter = document.querySelector('.main__page-counter');
  if (pageCounter) pageListHTMLElement.removeChild(pageCounter);

  // remove elements from the products grid
  const figEelem = document.querySelectorAll('.main__grid-element');
  for (var product of figEelem){
    mainGrid.removeChild(product);
  }
}

// Search bar event listeners
const searchBtn = document.querySelector('.header__search-btn');
const searchInput = document.querySelector('.header__search-input');
searchBtn.addEventListener('click', () => {
  const searchBarVal = searchInput.value;
  fetchListings(searchBarVal);
});

searchInput.addEventListener('keydown', (event) => {
  const searchBarVal = searchInput.value;
  if (event.key === 'Enter') fetchListings(searchBarVal);
});

// search for popular brands section
const popularBrand = document.querySelectorAll('.brand');
popularBrand.forEach((item) => {
  item.addEventListener('click', () =>{
    const brandSearch = item.innerText;
    searchInput.value = brandSearch;
    fetchListings(brandSearch);
  });
});

// Display initial products for testing
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('query');
if (searchQuery){
  fetchListings(searchQuery);
} else {  
    fetchListings('ESP guitars');
}