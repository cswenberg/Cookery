import { elements } from './base'


export const getInput = () => elements.searchInput.value
export const clearInput = () => elements.searchInput.value = '' 

const renderRecipe = (recipe) => {
	console.log(recipe)
	const markup = `<li>
	                    <a class="results__link" href="#${recipe.recipe_id}">
	                        <figure class="results__fig">
	                            <img src="${recipe.image_url}" alt=${recipe.title}>
	                        </figure>
	                        <div class="results__data">
	                            <h4 class="results__name">${cleanTitle(recipe.title)}</h4>
	                            <p class="results__author">${recipe.publisher}</p>
	                        </div>
	                    </a>
                	</li>`
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup)
}

const cleanTitle = (title, limit= 20) => {
	if (title.length > limit) {    
	    return title.substring(0, title.substring(0, limit).lastIndexOf(' ')) + ' ...'
	}
	return title
}

const buttonMarkup = (page, type) => `
	<button class="btn-inline results__btn--${type}" data-goto=${type=='prev' ? page-1 : page+1}>
		<span>Page ${type=='prev' ? page-1 : page+1}</span>
    	<svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type=='prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults/resPerPage)

	let button
	if (page == 1 && pages > 1) {
		button = buttonMarkup(page, 'next')
	} else if (page < pages) {
		button = `
			${buttonMarkup(page, 'prev')}
			${buttonMarkup(page, 'next')}
		`
	} else if (page == pages && pages > 1) {
		button = buttonMarkup(page, 'prev')
	}
	elements.searchResultsPages.insertAdjacentHTML('beforeEnd', button)
}

export const renderResults = (recipes, page = 2, resPerPage = 10) => {
	//rendering results of current pages
	const start = (page-1)*resPerPage
	const end = page*resPerPage
	recipes.slice(start,end).forEach(renderRecipe)
	//render pages
	renderButtons(page, recipes.length, resPerPage)
}

export const clearResults = () => {
	elements.searchResultsList.innerHTML = ''
	elements.searchResultsPages.innerHTML = ''
}






















