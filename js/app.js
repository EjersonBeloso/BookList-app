//Book Class: represents a  Book
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

//Ui Class: Handle Ui tasks
class UI {
	static displayBooks() {
		const books = Store.getBooks();

		books.forEach((book) => UI.addBookToList(book));
	}

	static addBookToList(book) {
		const list = document.querySelector("#book-list");

		const row = document.createElement("tr");

		row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href ="#" class="btn btn-outline-danger btn-sm delete">X</a></td>
        `;

		list.appendChild(row);
	}

	static deleteBooks(el) {
		if (el.classList.contains("delete")) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement("div");
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector(".container");
		const form = document.querySelector("#book-form");
		container.insertBefore(div, form);

		//Vanish in seconds
		setTimeout(() => document.querySelector(".alert").remove(), 3000);
	}

	static clearFields() {
		document.querySelector("#title").value = "";
		document.querySelector("#author").value = "";
		document.querySelector("#isbn").value = "";
	}
}
//store class: handles storage
class Store {
	static getBooks() {
		let books;

		if (localStorage.getItem("books") === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem("books"));
		}
		return books;
	}

	static addbook(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem("books", JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Store.getBooks();

		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});

		localStorage.setItem("books", JSON.stringify(books));
	}
}

//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
	e.preventDefault();
	//Get form values
	const title = document.querySelector("#title").value;
	const author = document.querySelector("#author").value;
	const isbn = document.querySelector("#isbn").value;

	//Validate
	if (title === "" || author === "" || isbn === "") {
		UI.showAlert("Please fill in all fields!", "danger");
	} else {
		//Intatiate book
		const book = new Book(title, author, isbn);

		//Add book to ui
		UI.addBookToList(book);

		//add book to store
		Store.addbook(book);

		//Clear fields
		UI.clearFields();
		UI.showAlert("Book Added", "success");
	}
});

//Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
	//remove book from UI
	UI.deleteBooks(e.target);

	//remove book from store
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	UI.showAlert("Book removed!", "success");
});
