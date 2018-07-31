// Global app controller
//8ee4d817d5f1005632981c63b178567e
//http://food2fork.com/api/search

import Search from './models/Search'
import Recipe from './models/Recipe'
import { elements, renderSpinner, clearSpinner } from './views/base'
import * as searchView from './views/searchView'

/** The Global State
	- the Search object
	- Current Recipe object
	- Shopping List object
	- Like recipes
*/
const state = {}


/** 
	Search Controller
*/
const controlSearch = async () => {

	const query = searchView.getInput()
	if (query) {
		state.search = new Search(query)

		//prepare ui
		searchView.clearInput()
		searchView.clearResults()
		renderSpinner(elements.searchResults)
		try {
			await state.search.getResults()
			//results to ui
			clearSpinner()
			searchView.renderResults(state.search.result)
		} catch(error) {
			alert(error)
		}
	}

}

elements.searchForm.addEventListener('submit', event => {
	event.preventDefault()
	controlSearch()
})

document.addEventListener('keypress', event => { //event passes a KeyPressedEvent
	if (event.keyCode === 13 || event.which === 13) { //checks if the key pressed was 'enter', depending on host software will use .keyCode or .which
		event.preventDefault()
		controlSearch()
	}
})

elements.searchResultsPages.addEventListener('click', event => {
	const button = event.target.closest('.btn-inline')
	if (button) {
		const goto = parseInt(button.dataset.goto, 10)
		searchView.clearResults()
		searchView.renderResults(state.search.result, goto)
	}
})

/** 
	Recipe Controller
*/

const controlRecipe = async () => {
	//get recipe id from url
	const id = window.location.hash.replace('#', '')
	if (id) {

		state.recipe = new Recipe(id)

		try {
			await state.recipe.getRecipe()

			state.recipe.cookTime()
			state.recipe.servings()

			console.log(state.recipe)
		} catch(error) {
			alert(error)
		}
	}
}


window.addEventListener('hashchange', controlRecipe)
window.addEventListener('load', controlRecipe)























