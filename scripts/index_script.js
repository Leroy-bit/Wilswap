let front_flip_button = document.getElementsByClassName('front-flip-button');
let back_flip_button = document.getElementsByClassName('back-flip-button');
let flipper = document.getElementsByClassName('flipper');

for (let i = 0; i < front_flip_button.length; i++) {
    front_flip_button[i].addEventListener('click', () => {
        flipper[i].style.transform = 'rotateY(180deg)';
    });

    back_flip_button[i].addEventListener('click', () => {
        flipper[i].style.transform = 'rotateY(0deg)';
    });
}