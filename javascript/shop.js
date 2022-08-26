const productContainer = document.getElementById('productContainer');
const productModal = document.getElementById('productModal');
const cartModal = document.getElementById('cartModal');
const stock = [];
const cart = []; 
const parsedStock = [];

function cartBtnEvnts() {
    const sum1ToCartButtons = document.querySelectorAll('.sum1ToCart');
    const rest1FromCartButtons = document.querySelectorAll('.rest1FromCart');
    const deleteFromCartButtons = document.querySelectorAll('.deleteFromCart');
    const emptyCartButton = document.getElementById('emptyCart');

    sum1ToCartButtons.forEach((button,index) => {
        button.addEventListener('click', (e) => {
            cart[index].amountInCart++;
            e.target.parentElement.parentElement.querySelector('.pAmount').innerHTML = cart[index].amountInCart;
            cartCount();
            storeInLS();
        })
    });

    rest1FromCartButtons.forEach((button,index) => {
        button.addEventListener('click', (e) => {
            cart[index].amountInCart--;
            if (cart[index].amountInCart < 1) {
                e.target.parentElement.parentElement.parentElement.remove()
                cart.splice(index, 1);
            } else e.target.parentElement.parentElement.querySelector('.pAmount').innerHTML = cart[index].amountInCart;
            renderProductsInCart();
            cartCount();
            storeInLS();
        })
    });

    deleteFromCartButtons.forEach((button,index) => {
        button.addEventListener('click', (e) => {
            cart[index].amountInCart = 0;
            cart.splice(index,1);
            e.target.parentElement.remove();
            cartCount();
            storeInLS();
        })
    });

    emptyCartButton.addEventListener('click', (e) => {
        cart.splice(0, cart.length);
        stock.forEach(product => product.amountInCart = 0);
        e.target.parentElement.querySelector('.cartProductsContainer').innerHTML = '';
        cartCount();
        stock.forEach(product => product.amountInCart = 0);
        localStorage.clear();
    });

}; //Incorpora eventos a botones de carrito: suma, resta, eliminacion y vaciado

function renderShop() {
    if (!JSON.parse(localStorage.getItem('stockLS'))) {
        fetch('../stock.json')
        .then(response => response.json())
        .then(jsonedStock => {addCards(jsonedStock); return jsonedStock})
        .then(jsonedStock =>  {addProductModalEvnt(jsonedStock); stock.push(...jsonedStock)})  
    } else {
        parsedStock.push(...JSON.parse(localStorage.getItem('stockLS')));
        parsedStock.forEach(product => stock.push(product));
        addCards(stock);
        addProductModalEvnt(stock);
    }
    
}; // Obtiene stock desde json

function addCards(stock) {
    stock.forEach((product) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
                            <img src=${product.img} alt="">
                            <h3>${product.title}</h3>
                            <p>${product.descript}.<br>Origen: ${product.origin}.</p>
                            <button class='openModalBtn'>See more</button>
                        `
        productContainer.appendChild(card);
    });
}; // Renderiza cards de productos

function addProductModalEvnt(stock) {
    const modalBtnList = document.querySelectorAll('.openModalBtn');
    modalBtnList.forEach((btn, index) => {
        btn.addEventListener('click', () => showProductModal(stock[index]));
    })
}; // Agrega evento para renderizar modal al clickear producto

function showProductModal(product) {
    productModal.innerHTML = `<div class="productModalContent">
                                <div class="productModalGoBack">
                                    <i class="fa-solid fa-circle-arrow-left"></i> 
                                    <p>GO BACK</p>              
                                </div>
                                <div class="productModalBottomDiv">
                                    <img src=${product.img} alt="">
                                    <div class="descriptDiv">
                                        <h2>${product.title}</h3>
                                        <h3>${product.subtitle}</h3>
                                        <p class="productModalPrice">${'$ ' + product.price}</p>
                                        <p class="productModalDescript">${product.descript}.<br>Origen: ${product.origin}.</p>
                                        <button class="addBtn" id='addBtn'> Add to cart</button>
                                    </div> 
                                </div>
                            </div>
                            `;
    productModal.classList.toggle('active');
    addCloseModal('.productModalGoBack', productModal,'.productModalContent');
    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', () => {
        if (product.amountInCart <= 0) {
            cart.push(product);
        }
        product.amountInCart++;
        console.log(cart);
        console.log(stock);
        renderProductsInCart();
        cartCount();
        productModal.classList.toggle('active');
        storeInLS();
    }
)}; // Renderiza y muestra modal de producto

function storeInLS() {
    localStorage.setItem('stockLS', JSON.stringify(stock));
};// Almacena cart en localStorage

function addCartModalEvnt() {
    const cartBtnContainer = document.getElementById('cartBtnContainer');
    cartBtnContainer.addEventListener('click', () => {
        cartModal.classList.toggle('active');
    })
}; // Agrega evento abrir modal al clickear icono

function renderCartModal() {
    const cartModalContent = document.createElement('div');
    cartModalContent.classList.add('cartModalContent');
    cartModalContent.innerHTML = `
                                    <div class="cartModalGoBack">
                                        <i class="fa-solid fa-circle-arrow-left"></i> 
                                        <p>Go back</p>              
                                    </div>
                                    <div class="cartModalBottomDiv">
                                        <div class="cartRow">
                                            <h3>Img</h3>
                                            <h3>Product</h3>
                                            <h3>Price</h3>
                                            <h3>Amount</h3>
                                            <h3>Total</h3>
                                            <h3>Delete from cart</h3>
                                        </div>
                                        <div class='cartProductsContainer' id='cartProductsContainer'></div>
                                        <button class='emptyCart' id='emptyCart'>Empty cart</button>
                                    </div>
                                `
    cartModal.appendChild(cartModalContent);
    addCloseModal('.cartModalGoBack', cartModal, '.cartModalContent');
    renderProductsInCart();
}; // Renderiza modal vacio (una vez al cargar sitio o cada vez que se abra modal?)

function cartCount() {
    let counter = 0;
    const cartCounter = document.getElementById('cartCounter');
    cart.forEach(product => counter += product.amountInCart)
    cartCounter.innerHTML = counter;
}; // Carga cantidad total de productos en carro

function renderProductsInCart() {
    const cartProductsContainer = document.getElementById('cartProductsContainer');
    cartProductsContainer.innerHTML = '';
    cart.forEach(product => {
        renderProduct(product, cartProductsContainer);
    });
    cartBtnEvnts();
}; // Junto con renderProduct renderiza todos los productos en carrito

function renderProduct(product, cartProductsContainer) {
    const cartRow = document.createElement('div');
    cartRow.classList.add('cartRow');
    cartRow.innerHTML = `
                            <img src=${product.img} alt="">
                            <h3 class='pTitle'>${product.title}</h3>
                            <p>${'$ ' + product.price}</p>
                            <div class='amountContainer'>
                                <button><i class="fa-solid fa-circle-minus rest1FromCart"></i></button>
                                <p class='pAmount'>${product.amountInCart}</p>
                                <button><i class="fa-solid fa-circle-plus sum1ToCart"></i></button>
                            </div>
                            <p>${'$ ' + product.price * product.amountInCart}</p>
                            <button class="deleteFromCart">Delete</button>
                        `;
    cartProductsContainer.appendChild(cartRow);
}; // Renderiza cada producto en el contenedor

function addCloseModal(clickSelector, modal, contentSelector) {
    const clickable = document.querySelector(clickSelector);
    clickable.addEventListener('click', () => {
        modal.classList.toggle('active');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.contains('active') ? modal.classList.toggle('active') : null;
        }
    });
    modal.addEventListener('click', () => modal.classList.remove('active'))
    const modalContent = document.querySelector(contentSelector);
    modalContent.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    })
}; // Generica para modales, agrega eventos de cierre al clickear fuera, apretar esc o boton de cierre

function loadCart() {
    if (stock) {
        stock.forEach(product => {
            if (product.amountInCart >= 1) {
                cart.push(product);
            }
        })
    }
} // Carga stock desde local storage y define carrito en funcion del mismo.

document.addEventListener('DOMContentLoaded',   () => {
    renderShop();
    loadCart();
    cartCount();
    renderCartModal();
    addCartModalEvnt();
});