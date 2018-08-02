


export default class Likes {

	constructor() {
		this.likes = []
	}

	addRecipe(id, title, author, image) {
		const like = {id, title, author, image}
		this.likes.push(like)

		this.persistData()

		return like
	}

	removeRecipe(id) {
		const index = this.likes.findIndex(element => element.id == id)
		this.likes.splice(index, 1) 

		this.persistData()
	}

	isLiked(id) {
		return this.likes.findIndex(element => element.id == id) != -1
	}

	getNumLikes() {
		return this.likes.length
	}

	persistData() {
		localStorage.setItem('likes', JSON.stringify(this.likes))
	}

	readData() {
		const data = JSON.parse(localStorage.getItem('likes'))
		if (data) this.likes = data
	}
}