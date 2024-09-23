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
        showApi(data)
        return data;
    } catch (err) {
        console.error('Ошибка при запросе к API', err);
    }
}
getApi()
// Отображение полученных данных на странице
function showApi(data) {
    data.products.forEach(element => {
        const newElement = `
                        <div class="product" data-id="${element.id}" id="element.title">
                            <img src="${element.images}" alt="Product 1" class="product__img">
                            <div class="product__content">
                                <h3 class="product__title">${element.title}</h3>
                                <p class="product__description">${element.description}.</p>
                                <p class="product__price">$${element.price}</p>
                            </div>
                            <a href="#" class="btn">Купить</a>
                        </div>`
        document.querySelector('.product__row').insertAdjacentHTML('beforeend', newElement);

    });
}

// Добавление товара в корзину
products.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('btn')) {
        const productElement = event.target.closest('.product'); // Получаем элемент продукта

        const cardInBasket = {
            id: productElement.dataset.id,
            src: productElement.querySelector('.product__img').src, // Исправлено здесь
            title: productElement.querySelector('.product__title').textContent,
            price: productElement.querySelector('.product__price').textContent.replace('$', ''),
            quantity: 1
        };

        arrBaket.push(cardInBasket);
        count.textContent = arrBaket.length;
        showProductsInBuket(cardInBasket); 

        totalPrice.textContent = priceUpdate(arrBaket);
        
        
        
    }
});
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
</div>

    `
    cartContainer.insertAdjacentHTML('beforeend', newCart);
}
// Отображение корзины
baketBtn.addEventListener('click', () => {
    cartSidebar.classList.toggle('show');
})
closeModal.addEventListener('click', () => {
    cartSidebar.classList.remove('show');
});


// Удаление товара из корзины 
sidebar.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')){
        const id = e.target.dataset.id
        const index = arrBaket.findIndex((item => {
            return item.id === id
        }))
        arrBaket.splice(index, 1)
        console.log(index)
        count.textContent = arrBaket.length
        e.target.parentElement.remove()
        
    }
    totalPrice.textContent = priceUpdate(arrBaket);
});

// Ситаем цену товаров  
function priceUpdate () {
    const newPrise = arrBaket.reduce((acc, item) => {
        return acc + Math.ceil(Number(item.price))
    }, 0)
    return newPrise
}