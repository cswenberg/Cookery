


export default class Likes {

	constructor() {
		this.likes = []
	}

	addRecipe(id, title, author, image) {
		const like = {id, title, author, image}
		this.likes.push(like)
		return like
	}

	deleteRecipe(id) {
		const index = this.likes.findIndex(element => element.id == id)
		this.likes.splice(index, 1) 
	}

	isLiked(id) {
		return this.likes.findIndex(element => element.id == id) != -1
	}

	getNumLikes() {
		return this.likes.length
	}
}