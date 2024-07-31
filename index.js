document.addEventListener('DOMContentLoaded', function () {
    const bookContainer = document.querySelector('#book-container');
    const bookURL = `http://localhost:3000/books`;
    const bookForm = document.querySelector('#book-form');
    let allBooks = [];

    // Read Data to visualize
    fetch(`${bookURL}`)
        .then(response => response.json())
        .then(bookData => {
            allBooks = bookData;
            bookData.forEach(function (book) {
                bookContainer.innerHTML += `
                    <div id="book-${book.id}">
                        <h2>${book.title}</h2>
                        <h4>Author: ${book.author}</h4>
                        <img src="${book.coverImage}" width="333" height="500">
                        <p>${book.description}</p>
                        <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
                        <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
                    </div>`
            });
        });

    // Create Data and visualize    
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = bookForm.querySelector('#title').value;
        const authorInput = bookForm.querySelector('#author').value;
        const coverImageInput = bookForm.querySelector('#coverImage').value;
        const descInput = bookForm.querySelector('#description').value;

        fetch(`${bookURL}`, {
            method: 'POST',
            body: JSON.stringify({
                title: titleInput,
                author: authorInput,
                coverImage: coverImageInput,
                description: descInput
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(book => {
            bookContainer.innerHTML += `
                <div id="book-${book.id}">
                    <h2>${book.title}</h2>
                    <h4>Author: ${book.author}</h4>
                    <img src="${book.coverImage}" width="333" height="500">
                    <p>${book.description}</p>
                    <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
                    <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
                </div>`;
        });

        bookForm.reset();
    });

    // Update and delete books
    bookContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'edit') {
            const bookId = e.target.dataset.id;
            const bookData = allBooks.find(book => book.id == bookId);

            e.target.parentElement.innerHTML += `
                <div id='edit-book-${bookId}'>
                    <form id="edit-form-${bookId}">
                        <input required id="edit-title" value="${bookData.title}">
                        <input required id="edit-author" value="${bookData.author}">
                        <input required id="edit-coverImage" value="${bookData.coverImage}">
                        <input required id="edit-description" value="${bookData.description}">
                        <input type="submit" value="Edit Book">
                    </form>
                </div>`;

            const editForm = document.querySelector(`#edit-form-${bookId}`);

            editForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const titleInput = document.querySelector("#edit-title").value;
                const authorInput = document.querySelector("#edit-author").value;
                const coverImageInput = document.querySelector("#edit-coverImage").value;
                const descInput = document.querySelector("#edit-description").value;
                const editedBook = document.querySelector(`#book-${bookData.id}`);

                fetch(`${bookURL}/${bookData.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        title: titleInput,
                        author: authorInput,
                        coverImage: coverImageInput,
                        description: descInput
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(book => {
                    editedBook.innerHTML = `
                        <div id="book-${book.id}">
                            <h2>${book.title}</h2>
                            <h4>Author: ${book.author}</h4>
                            <img src="${book.coverImage}" width="333" height="500">
                            <p>${book.description}</p>
                            <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
                            <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
                        </div>
                        <div id="edit-book-${book.id}"></div>`;
                    document.querySelector(`#edit-book-${book.id}`).remove();
                });
            });

        } else if (e.target.dataset.action === 'delete') {
            const bookId = e.target.dataset.id;
            fetch(`${bookURL}/${bookId}`, {
                method: 'DELETE'
            })
            .then(() => {
                document.querySelector(`#book-${bookId}`).remove();
            });
        }
    });
});



