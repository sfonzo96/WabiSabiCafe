const navToggler = document.getElementById('navToggler');
const navUl = document.getElementById('navUl');
const navLinks = document.querySelectorAll('.navLink');
const footerLinks = document.querySelectorAll('.footerLink'); 
const scrollToElements = [document.getElementById('landingSection'), document.getElementById('facilitySection'), document.getElementById('shopSection')];
const logoContainer = document.getElementById('logoContainer');

function toggleMenu() {
    navUl.classList.toggle('hidden');

    navToggler.classList.toggle('active');
};

navToggler.addEventListener('click', toggleMenu);

navLinks.forEach((link , index) => {
    link.addEventListener('click', toggleMenu);
    
    switch (index){
        case 0:
            link.addEventListener('click', () => scrollToElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
            break;
        case 1:
            link.addEventListener('click', () => scrollToElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
            break;
        case 2:
            link.addEventListener('click', () => scrollToElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
            break;
    }
});

footerLinks.forEach((link , index) => {   
    switch (index){
        case 0:
            link.addEventListener('click', () => scrollToElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
            break;
        case 1:
            link.addEventListener('click', () => scrollToElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
            break;
        case 2:
            link.addEventListener('click', () => scrollToElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
            break;
    }
});

logoContainer.addEventListener('click', () => scrollToElements[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));