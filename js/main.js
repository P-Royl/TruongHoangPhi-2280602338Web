document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
    document.getElementById('btnAddBook').addEventListener('click', handleAddOrUpdateProduct);
});

function fetchProducts() {
    const apiUrl = 'http://localhost:5133/api/ProductApi'; // Ensure this matches your API endpoint
    fetch(apiUrl)
        .then(handleResponse)
        .then(data => displayProducts(data))
        .catch(error => console.error('Fetch error:', error.message));
}

function handleResponse(response) {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
}

function displayProducts(products) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // Clear existing products

    // Check if products exist
    if (products && products.data) {
        products.data.forEach(product => {
            bookList.innerHTML += createProductRow(product);
        });
    }
}

function createProductRow(product) {
    return `
    <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td><img src="${product.imageUrl}" alt="${product.name}" width="50"></td>
        <td>
            <button class="btn btn-warning edit-btn" data-id="${product.id}">Sửa</button>
            <button class="btn btn-danger delete-btn" data-id="${product.id}">Xóa</button>
        </td>
    </tr>
    `;
}

function handleAddOrUpdateProduct() {
    const productId = document.getElementById('bookId').value;

    if (productId) {
        // If a product ID is set, we're updating an existing product
        updateProduct(productId);
    } else {
        // Otherwise, we add a new product
        addProduct();
    }
}

function addProduct() {
    const formData = new FormData();
    formData.append('name', document.getElementById('bookName').value);
    formData.append('price', document.getElementById('bookPrice').value);
    formData.append('description', document.getElementById('bookDescription').value);
    const imageInput = document.getElementById('imageUrl');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    fetch('http://localhost:5133/api/ProductApi', {
        method: 'POST',
        body: formData,
    })
    .then(handleResponse)
    .then(data => {
        console.log('Product added:', data);
        fetchProducts(); // Refresh the product list
        clearForm(); // Clear the form after adding
    })
    .catch(error => console.error('Error:', error));
}

function updateProduct(productId) {
    const formData = new FormData();
    formData.append('name', document.getElementById('bookName').value);
    formData.append('price', document.getElementById('bookPrice').value);
    formData.append('description', document.getElementById('bookDescription').value);
    const imageInput = document.getElementById('imageUrl');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    fetch(`http://localhost:5133/api/ProductApi/${productId}`, {
        method: 'PUT',
        body: formData,
    })
    .then(handleResponse)
    .then(data => {
        console.log('Product updated:', data);
        fetchProducts(); // Refresh the product list
        clearForm(); // Clear the form after updating
    })
    .catch(error => console.error('Error updating product:', error));
}

function deleteProduct(event) {
    const productId = event.target.getAttribute('data-id');
    const apiUrl = `http://localhost:5133/api/ProductApi/${productId}`;

    fetch(apiUrl, {
        method: 'DELETE',
    })
    .then(handleResponse)
    .then(() => {
        console.log('Product deleted');
        fetchProducts(); // Refresh the product list
    })
    .catch(error => console.error('Error deleting product:', error));
}

function clearForm() {
    document.getElementById('bookId').value = '';
    document.getElementById('bookName').value = '';
    document.getElementById('bookPrice').value = '';
    document.getElementById('bookDescription').value = '';
    document.getElementById('imageUrl').value = '';
}

// Event listeners for edit and delete buttons (after products are displayed)
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-btn')) {
        const productId = e.target.getAttribute('data-id');
        editProduct(productId);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteProduct(e);
    }
});

function editProduct(productId) {
    const apiUrl = `http://localhost:5133/api/ProductApi/${productId}`;

    fetch(apiUrl)
        .then(handleResponse)
        .then(product => {
            // Populate the form with the existing product data for editing
            document.getElementById('bookId').value = product.id;
            document.getElementById('bookName').value = product.name;
            document.getElementById('bookPrice').value = product.price;
            document.getElementById('bookDescription').value = product.description;
        })
        .catch(error => console.error('Error fetching product details:', error));
}
