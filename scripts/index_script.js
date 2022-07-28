let front_flip_button = document.getElementsByClassName('front-flip-button');
let back_flip_button = document.getElementsByClassName('back-flip-button');
let flipper = document.getElementsByClassName('flipper');
let news_click = document.getElementById('news-link');
let menu_buttons = document.getElementsByClassName('menu-buttons');
let menu_options = document.getElementsByClassName('menu-options');
let mobile_menu = document.getElementsByClassName('mobile-menu')[0];
let mobile_menu_icon = document.getElementsByClassName('mobile-menu-icon')[0];
let blur_block = document.getElementsByClassName('blur')[0];

news_click.addEventListener('click', () => {
    flipper[2].style.transform = 'rotateY(180deg)';
});

for (let i = 0; i < front_flip_button.length; i++) {
    front_flip_button[i].addEventListener('click', () => {
        flipper[i].style.transform = 'rotateY(180deg)';
    });
    back_flip_button[i].addEventListener('click', () => {
        flipper[i].style.transform = 'rotateY(0deg)';
    });
}

for (let i = 0; i < menu_buttons.length; i++) {
    menu_buttons[i].addEventListener('click', () => {
        if (menu_options[i].style.display == 'none') {
            for (var j = 0; j < menu_buttons.length; j++) {
                if (j == i) {
                    menu_options[j].style.display = 'flex';
                    menu_options[j].style.animation = '0.8s show';
                } else {
                    menu_options[j].style.display = 'none';
                }
            }
        } else {
            menu_options[i].style.display = 'none';
        }
    });
}

mobile_menu_icon.addEventListener('click', () => {
    mobile_menu.style.display = 'flex';
    mobile_menu.style.animation = '0.8s show';
    blur_block.style.display = 'block';
});

blur_block.addEventListener('click', () => {
    mobile_menu.style.display = 'none';
    blur_block.style.display = 'none';
});