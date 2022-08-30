const productContainer = document.getElementById('productContainer');
const productModal = document.getElementById('productModal');
const cartModal = document.getElementById('cartModal');
const searchInput = document.getElementById('searchInput');
const stock = [];
const cart = []; 
const parsedStock = [];

function addEmptyCartEvnt() {
    const emptyCartButton = document.getElementById('emptyCart');

    emptyCartButton.addEventListener('click', (e) => {
        if (cart.length === 0) {
            Toastify({
                text: `Cart's already empty!`,
                duration: 2000,
                newWindow: false,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "#EFE5DD",
                  color: "#351817",
                  border: ".05rem solid #5C3018"
                },
                offset: {
                    y: "9rem" 
                },
                oldestFirst: true,
            }).showToast();
        }else {
            Toastify({
            text: `Cart was emptied.`,
            duration: 2000,
            newWindow: false,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#EFE5DD",
              color: "#351817",
              border: ".05rem solid #5C3018"
            },
            offset: {
                y: "9rem" 
            },
            oldestFirst: true,
        }).showToast();}
        cart.splice(0, cart.length);
        stock.forEach(product => product.amountInCart = 0);
        e.target.parentElement.querySelector('.cartProductsContainer').innerHTML = '';
        cartCount();
        localStorage.clear();
    });
} // Agrega evento de vaciado de carrito

function productsCartBtnEvnts() {
    const sum1ToCartButtons = document.querySelectorAll('.sum1ToCart');
    const rest1FromCartButtons = document.querySelectorAll('.rest1FromCart');
    const deleteFromCartButtons = document.querySelectorAll('.deleteFromCart');

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
                cart.splice(index, 1);
                renderProductsInCart();
            } else e.target.parentElement.parentElement.querySelector('.pAmount').innerHTML = cart[index].amountInCart;
            cartCount();
            storeInLS();
        })
    });

    deleteFromCartButtons.forEach((button,index) => {
        button.addEventListener('click', (e) => {
            cart[index].amountInCart = 0;
            Toastify({
                text: `${cart[index].title} was deleted from the cart.`,
                duration: 2000,
                newWindow: false,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "#EFE5DD",
                  color: "#351817",
                  border: ".05rem solid #5C3018"
                },
                offset: {
                    y: "9rem" 
                },
                oldestFirst: true,
            }).showToast();
            cart.splice(index,1);
            renderProductsInCart();
            cartCount();
            storeInLS();
        })
    });
}; //Incorpora eventos a botones de carrito: suma, resta, eliminacion

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
                            <p>${product.descript}<br>Origin: ${product.origin}.</p>
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
                                        <p class="productModalDescript">${product.descript}<br>Origin: ${product.origin}.</p>
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
        renderProductsInCart();
        cartCount();
        productModal.classList.toggle('active');
        storeInLS();
        Toastify({
            text: `${product.title} was addded to the cart!`,
            duration: 2000,
            newWindow: false,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#EFE5DD",
              color: "#351817",
              border: ".05rem solid #5C3018"
            },
            offset: {
                y: "9rem" 
            },
            oldestFirst: true,
        }).showToast();
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
    addEmptyCartEvnt()
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
    productsCartBtnEvnts();
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

function addSearchFunction() {
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length >= 1) {
            const searchResults = stock.filter(product => {
                const keywords = product.keywords;
                const searchText = searchInput.value.toLowerCase();
                return keywords.includes(searchText);
            })
            productContainer.innerHTML = '';
            addCards(searchResults);
            addProductModalEvnt(searchResults)
        } else {
            productContainer.innerHTML = '';
            addCards(stock);
            addProductModalEvnt(stock);
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    renderShop();
    addSearchFunction();
    loadCart();
    cartCount();
    renderCartModal();
    addCartModalEvnt();
});