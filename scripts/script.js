
class Book {

    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    info() {
        const read = this.read ? "read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pages} pages, ${read}`;
    }

    toggleRead() {
        this.read = !this.read;
    }

}


class Library {

    constructor() {
        this.library = [];
    }

    add(book) {
        this.library.push(book);
    }

    remove(book) {
        this.library = this.library.filter(b => b.title !== book.title);
    }

    titleExists(title) {
        return this.library.some(book => book.title === title);
    }

}


class BookCards {

    constructor(library) {
        this.booksElement = document.querySelector(".books");
        this.library = library;
    }

    add(book) {
        this.booksElement.appendChild(this.createBookElement(book));
    }

    createBookElement(book) {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        this.addBookProperties(bookElement, book);
        return bookElement;
    }

    addBookProperties(bookElement, book) {
        this.addBookProperty(bookElement, "p", "title", book.title);
        this.addBookProperty(bookElement, "p", "author", book.author);
        this.addBookProperty(bookElement, "p", "pages", book.pages);

        if (book.read) {
            const readButton = this.addBookProperty(bookElement, "button", "read", "Read");
            this.bindToggleRead(readButton, book);
        } else {
            const readButton = this.addBookProperty(bookElement, "button", "not-read", "Not Read");
            this.bindToggleRead(readButton, book);
        }

        const removeBookButton = this.addBookProperty(bookElement, "button", "remove", "Remove");
        this.bindRemoveBook(removeBookButton, bookElement, book);
    }

    addBookProperty(bookElement, element, cls, value) {
        const prop = document.createElement(element);
        prop.classList.add(cls);
        prop.innerHTML = value;
        bookElement.appendChild(prop);
        return prop;
    }

    bindToggleRead(readButton, book) {
        readButton.addEventListener("click", () => {
            if (book.read) {
                readButton.classList.remove("read");
                readButton.classList.add("not-read");
                readButton.innerHTML = "Not Read";
            } else {
                readButton.classList.remove("not-read");
                readButton.classList.add("read");
                readButton.innerHTML = "Read";
            }
            book.toggleRead();
        });
    }

    bindRemoveBook(removeButton, bookElement, book) {
        removeButton.addEventListener("click", () => {
            this.booksElement.removeChild(bookElement);
            this.library.remove(book);
        });
    }
}


class Display {

    constructor(library, cards) {
        this.library = library;
        this.cards = cards;
        this.bindEventListeners();
    }

    bindEventListeners() {
        this.addBookForm();
        this.validateBookTitle();
        this.addBookFromForm();
    }

    addBookForm() {
        const addBookFormContainer = document.querySelector(".add-book-form-container");

        // Show form
        document.querySelector(".add-book-button").addEventListener("click", () => {
            addBookFormContainer.classList.add("active");
        });

        // Hide form
        addBookFormContainer.addEventListener("click", ev => {
            if (ev.target === addBookFormContainer) {
                // If clicking outside the add book form then hide form
                addBookFormContainer.classList.remove("active");
            }
            // If clicking inside the add book form keep showing
        });
    }

    validateBookTitle() {
        document.querySelector("#input-title").addEventListener("change", ev => {
            const title = ev.target.value;
            if (library.titleExists(title)) {
                ev.target.setCustomValidity("This title already exists in the library.");
            } else {
                ev.target.setCustomValidity("");
            }

            ev.target.reportValidity();
        });
    }

    addBookFromForm() {
        const addBookFormContainer = document.querySelector(".add-book-form-container");
        const form = document.querySelector(".add-book-form");

        form.addEventListener("submit", ev => {
            ev.preventDefault();

            const title = form.elements["input-title"].value;
            const author = form.elements["input-author"].value;
            const pages = form.elements["input-pages"].value;
            const read = form.elements["input-read"].checked;

            const book = new Book(title, author, pages, read);
            this.library.add(book);
            this.cards.add(book);

            addBookFormContainer.classList.remove("active");

            form.elements["input-title"].value = "";
            form.elements["input-author"].value = "";
            form.elements["input-pages"].value = "";
            form.elements["input-read"].checked = false;
        });
    }

    addSampleBooks() {
        const b1 = new Book("To Kill a Mockingbird", "Harper Lee", 281, false);
        const b2 = new Book("Holes", "Louis Sachar", 233, true);
        const b3 = new Book("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", 1997, false);
        const b4 = new Book("Ulysses", "James Joyce", 1922, false);
        const b5 = new Book("Afterlife", "Julia Alvarez", 2020, true);

        this.library.add(b1);
        this.library.add(b2);
        this.library.add(b3);
        this.library.add(b4);
        this.library.add(b5);

        this.cards.add(b1);
        this.cards.add(b2);
        this.cards.add(b3);
        this.cards.add(b4);
        this.cards.add(b5);
    }

}

const library = new Library();
const cards = new BookCards(library);
const display = new Display(library, cards);

display.addSampleBooks();