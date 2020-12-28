// includes dom elements
export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResultsList: document.querySelector(".results__list"),
  searchResultDiv: document.querySelector(".results"),
  pageButtons: document.querySelector(".results__pages"),
  recipeDiv: document.querySelector(".recipe"),
};

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = (parent) => {
  const loader = `<div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon"/>
            </svg>
        </div>`;

        parent.insertAdjacentHTML('afterbegin', loader);
};


export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
}