const navToggler = document.getElementById('navToggler');
const navUl = document.getElementById('navUl');
const navLinks = document.querySelectorAll('.navLink');

function toggleMenu() {
    navUl.classList.toggle('hidden');

    navToggler.classList.toggle('active');
}

navToggler.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', toggleMenu)
})

/* cartButtonn.addEventListener('click', (e) => {
    e.preventDefault();
}) */