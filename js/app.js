// Получение дом элементов
const products = document.querySelector('.products');
const baketBtn = document.querySelector('.cart-icon');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeModal = document.getElementById('closeModal');
const count = document.querySelector('.cart-counter');
const sidebar = document.querySelector('.cart-sidebar');
const totalPrice = document.getElementById('totalPrice');


// Массив для хранения товаров в корзине
const arrBaket = [];

// Получение данных с сервера
async function getApi(params) {
    const url = 'https://dummyjson.com/products';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        showApi(data);
        return data;
    } catch (err) {
        console.error('Ошибка при запросе к API', err);
    }
}
getApi();

// Отображение полученных данных на странице
function showApi(data) {
    data.products.forEach(element => {
        const newElement = `
            <div class="product" data-id="${element.id}" id="${element.title}">
                <img src="${element.images[0]}" alt="${element.title}" class="product__img">
                <div class="product__content">
                    <h3 class="product__title">${element.title}</h3>
                    <p class="product__description">${element.description}.</p>
                    <p class="product__price">$${element.price}</p>
                </div>
                <a href="#" class="btn">Купить</a>
            </div>`;
        document.querySelector('.product__row').insertAdjacentHTML('beforeend', newElement);
    });
}

// Добавление товара в корзину
products.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('btn')) {
        const productElement = event.target.closest('.product'); // Получаем элемент продукта

        const productId = productElement.dataset.id;
        const cardInBasket = {
            id: productId,
            src: productElement.querySelector('.product__img').src, // Исправлено здесь
            title: productElement.querySelector('.product__title').textContent,
            price: productElement.querySelector('.product__price').textContent.replace('$', ''),
            quantity: 1
        };

        const existingProduct = arrBaket.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity++;
            updateProductQuantityInBasket(existingProduct);
        } else {
            arrBaket.push(cardInBasket);
            showProductsInBuket(cardInBasket);
        }
        count.textContent = arrBaket.length;
        totalPrice.textContent = priceUpdate(arrBaket);
    }
});

// Обновляем количество товара в корзине
function updateProductQuantityInBasket(product) {
    const productElement = document.querySelector(`#quantity-${product.id}`);
    if (productElement) {
        productElement.value = product.quantity;
    }
}

// Отображение товаров в корзине
function showProductsInBuket(element) {
    const cartContainer = document.querySelector('.cart-items');
    const newCart = `
        <div class="cart-product" data-id="${element.id}" id="${element.title}">
            <img src="${element.src}" alt="${element.title}" class="cart-product__img">
            <div class="cart-product__content">
                <h3 class="cart-product__title">${element.title}</h3>
                <p class="cart-product__description">${element.description}</p>
                <p class="cart-product__price">$${element.price}</p>
                <div class="cart-product__quantity">
                    <button class="btn quantity-btn" data-action="decrease">-</button>
                    <input type="number" id="quantity-${element.id}" value="1" min="1" class="cart-product__input">
                    <button class="btn quantity-btn" data-action="increase">+</button>
                </div>
            </div>
            <button class="btn remove-btn" data-id="${element.id}">Удалить</button>
        </div>`;
    cartContainer.insertAdjacentHTML('beforeend', newCart);
}

// Отображение корзины
baketBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show'); // Исправлено
});

closeModal.addEventListener('click', () => {
    sidebar.classList.remove('show'); // Исправлено
});

// Удаление товара из корзины
sidebar.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
        const id = e.target.dataset.id;
        const index = arrBaket.findIndex((item => item.id === id));
        if (index !== -1) {
            arrBaket.splice(index, 1);
            count.textContent = arrBaket.length;
            e.target.parentElement.remove();
            totalPrice.textContent = priceUpdate(arrBaket);
        }
    }
});

// Считаем цену товаров
function priceUpdate() {
    const newPrice = arrBaket.reduce((acc, item) => {
        return acc + Math.ceil(Number(item.price)) * item.quantity;
    }, 0);
    return newPrice;
}


document.addEventListener('click', function (event) {
    if (event.target.classList.contains('quantity-btn')) {
        const productElement = event.target.closest('.cart-product');
        const productId = productElement.dataset.id;
        const productInBasket = arrBaket.find(item => item.id === productId);

        // Проверяем, какую кнопку нажали (увеличить или уменьшить)
        if (event.target.dataset.action === 'increase') {
            productInBasket.quantity++;
        } else if (event.target.dataset.action === 'decrease') {
            // Уменьшаем количество, но не меньше 1
            if (productInBasket.quantity > 1) {
                productInBasket.quantity--;
            }
        }

        // Обновляем значение в input
        const quantityInput = productElement.querySelector('.cart-product__input');
        quantityInput.value = productInBasket.quantity;

        // Обновляем общую стоимость
        totalPrice.textContent = priceUpdate(arrBaket);
    }
});