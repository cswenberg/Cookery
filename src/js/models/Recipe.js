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

	fakeEval(string) {
		if (!string.includes('+')) return parseInt(string)
		const [num1, num2] = string.split('+').map(element => parseInt(element, 10))
		if (!num2) {
			return num1
		} else if (num1 && num2) {
			return num1+num2
		}
		return 0
	}

	parseIngredients() {
		const unitsLong = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds']
		const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound']
		const units = [...unitsShort, 'g', 'kg'] //using ... to destructure unitsShort's elements into new array

		const newIngredients = this.ingredients.map(each => {
			// 1) standardize units
			let ingredient = each.toLowerCase()
			unitsLong.forEach((long, i) => {
				ingredient = ingredient.replace(long, unitsShort[i])
			})
			// 2) remove parantheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
			// 3) parse to differentiate number, unit, and ingredient
			const array = ingredient.split(' ')
			const unitsIndex = array.findIndex(element => units.includes(element)) //findIndex uses callback to go through each element in array and return first instance of a unit
			let ingredientObject;
			if (unitsIndex > -1) {
				//unit found and implies number found

				const countArr = array.slice(0, unitsIndex) // grabs all elements up until unit
				let count
				if (countArr.length == 1) {
					count = this.fakeEval(countArr[0].replace('-','+')) //eval turns string math to a float
				} else {
					count = this.fakeEval(countArr.join('+')) //eval turns string math to a float
				}
				ingredientObject = {
					count,
					units: array[unitsIndex],
					ingredient: array.slice(unitsIndex+1).join(' ') //take words past unit and join with spaces
				}
			} else if (parseInt(array[0], 10)) {
				//no unit found, but there is number
				ingredientObject = {
					count: this.fakeEval(array[0]),
					units: '',
					ingredient: array.slice(1).join(' ') //takes off first element and rejoins to string
				}
			} else {
				//no unit found and no number
				ingredientObject = {
					count: 1,
					units: '',
					ingredient //ES6 syntax that makes attribute ingredient and stores variable ingredient in it
				}
			}
			return ingredientObject
		})
		this.ingredients = newIngredients
	}

	updateServings(type) {
		const newServings = type == 'increase' ? this.servings + 1 : this.servings - 1;
		this.ingredients.forEach(each => {
			each.count *= newServings/this.servings
		})
		this.servings = newServings
	}
}






















