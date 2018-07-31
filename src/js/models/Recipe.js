import axios from 'axios'
import { proxy, key } from '../config'

export default class Recipe {

	constructor(id) {
		this.id = id
	}

	async getRecipe() {
		try {
			const result = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`)
			console.log(result)
			this.title = result.data.recipe.title
			this.author = result.data.recipe.publisher
			this.image = result.data.recipe.image_url
			this.url = result.data.recipe.source_url
			this.ingredients = result.data.recipe.ingredients
		} catch(error) {
			console.log(error)
		}
	}

	cookTime() {
		const numIngredients = this.ingredients.length
		const periods = Math.ceil(numIngredients/3)
		this.time = periods*15  
	}

	servings() {
		this.servings = 4
	}
}