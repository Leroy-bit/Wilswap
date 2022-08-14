let front_flip_button = document.getElementsByClassName('front-flip-button');
let back_flip_button = document.getElementsByClassName('back-flip-button');
let flipper = document.getElementsByClassName('flipper');
let news_click = document.getElementById('news-link');
let menu_buttons = document.getElementsByClassName('menu-buttons');
let menu_options = document.getElementsByClassName('menu-options');
let mobile_menu = document.getElementsByClassName('mobile-menu')[0];
let mobile_menu_icon = document.getElementsByClassName('mobile-menu-icon')[0];
let blur_block = document.getElementsByClassName('blur')[0];
let connect_wallet_buttons = document.getElementsByClassName('connect_wallet_button');
let account_block = document.getElementsByClassName('account-block')[0];
let account_adress_element = document.getElementsByClassName('account-adress')[0];
let accounts;

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

// Connect to Metamask

import { ethers } from "./ethers-5.2.esm.min.js";
const provider = new ethers.providers.Web3Provider(window.ethereum)
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function() {document.location.reload()})
}
async function get_accounts(connect) {
    if(window.ethereum){
        try {
            accounts = await provider.send("eth_accounts", []) // Account is connected?
            if (accounts[0]) {
                console.log(accounts.length)
                for (let i = 0; i < connect_wallet_buttons.length; i++) { // make swap button visible
                    if (!connect_wallet_buttons[i].classList.contains('swap-button')) {
                        connect_wallet_buttons[i].style.display = 'none'
                    } else {
                        
                    }
                    
                }
                document.getElementsByClassName('account-block')[0].appendChild(generateIdenticon(45)) // insert a avatar to account block
                account_block.style.display = "flex"
                account_adress_element.innerHTML = accounts[0].substr(0, 5) + "..." + accounts[0].substr(accounts[0].length - 4, 4)
            }
            else if(accounts != true && connect) {
                try {
                    accounts = await provider.send("eth_requestAccounts", []) // request to connect wallet
                    if (accounts) {
                        document.location.reload() // reload page
                }
                } catch (error) {
                    
                }
                
            }
            else {
                for (let i = 0; i < connect_wallet_buttons.length; i++) { // make swap button invisible
                    if (connect_wallet_buttons[i].classList.contains('swap-button')) {
                        connect_wallet_buttons[i].style.display = 'none';
                    } else {
                        connect_wallet_buttons[i].style.display = 'flex';
                    }
                }
                if (window.innerWidth < 900) {  // for adaptation on swap page
                    connect_wallet_buttons[0].style.display = 'none';
                }
            }
        } catch (error) {
            console.log(error)
        }
                
    }
    else {
        window.location = "https://metamask.io" // Redirect to Metamask site
    }
}

window.addEventListener("resize", () => {  // for adaptation on swap page
    if (window.innerWidth > 900 && account_block.style.display != 'flex') {
        connect_wallet_buttons[0].style.display = 'flex';
    } else {
        connect_wallet_buttons[0].style.display = 'none';
    }
});

for (let i = 0; i < connect_wallet_buttons.length; i++) {
    connect_wallet_buttons[i].addEventListener('click', get_accounts)
}
import generateIdenticon from "./handmade-jazzicon.js"; // Get avatar

// On page load listener

document.addEventListener("DOMContentLoaded", function() {
    get_accounts() // Check a connection to Metamask   
})