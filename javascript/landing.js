const slider = document.getElementById('slider');
const sliderButton = document.querySelectorAll('#sliderButton');

sliderButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        let translate = index * -25;

        slider.style.transform = `translateX(${translate}%)`;

        sliderButton.forEach(btn => {
            btn.classList.remove('active');
        })
        
        button.classList.add('active');
    })


})


