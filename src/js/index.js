// Global app controller
//8ee4d817d5f1005632981c63b178567e
//http://food2fork.com/api/search

import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import { elements, renderSpinner, clearSpinner } from './views/base'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'


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
		//prepare ui
		recipeView.clearRecipe()
		renderSpinner(elements.recipe)

		if (state.search) searchView.highlightSelected(id)

		state.recipe = new Recipe(id)

		try {
			await state.recipe.getRecipe()
			state.recipe.parseIngredients()
			state.recipe.cookTime()
			state.recipe.servings()
			//results to ui
			clearSpinner()
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
		} catch(error) {
			alert(error)
		}
	}
}


window.addEventListener('hashchange', controlRecipe)
window.addEventListener('load', controlRecipe)

elements.recipe.addEventListener('click', event => {
	if (event.target.matches('.btn-increase, .btn-increase *')) {
		state.recipe.updateServings('increase')
		recipeView.updateServings(state.recipe)
	} else if (event.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1) {
		state.recipe.updateServings('decrease')
		recipeView.updateServings(state.recipe)
	} else if (event.target.matches('.recipe__btn--shopping, .recipe__btn--shopping *')) {
		controlList()
	} else if (event.target.matches('.recipe__love, .recipe__love *')) {
		controlLike()
	}
})

/** 
	List Controller
*/
const controlList = () => {

	if (!state.list) {
		state.list = new List()
		window.list = state.list
	}
	state.recipe.ingredients.forEach(each => {
		const item = state.list.addItem(each.count, each.units, each.ingredient)
		listView.renderItem(item)
	})
}

elements.shoppingList.addEventListener('click', event => {

	const id = event.target.closest('.shopping__item').dataset.itemid

	if (event.target.matches('.shopping__delete, .shopping__delete *')) {
		listView.deleteItem(id)
	} else if (event.target.matches('.shopping__count--value')) {
		const value = event.target.value
		state.list.updateCount(id, value)
	}
})

/** 
	Like Controller
*/

const controlLike = () => {

	if (!state.likes) state.likes = new Likes()
	const currentId = state.recipe.id

	if (!state.likes.isLiked(currentId)) {
		//add recipe to likes
		const like = state.likes.addRecipe(currentId, state.recipe.title, state.recipe.author, state.recipe. image)

		//toggle like button
		likesView.toggleLikeButton(true)

		//add like to ui
		likesView.renderLike(like)
	} else {
		//remove recipe from likes
		state.likes.removeRecipe(currentId)

		//toggle like button
		likesView.toggleLikeButton(false)

		//remove recipe from ui
		likesView.deleteLike(currentId)
	}
	likesView.toggleLikesMenu(state.likes.getNumLikes())
}


window.addEventListener('load', () => {
	state.likes = new Likes()
	state.likes.readData()
	likesView.toggleLikesMenu(state.likes.getNumLikes())
	state.likes.likes.forEach(like => likesView.renderLike(like))
})


















