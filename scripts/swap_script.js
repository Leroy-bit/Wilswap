// define all global variables
let main_bg = document.getElementsByClassName('main-bg')[0]
let light = document.getElementsByClassName('light')[0]
let swap_block = document.getElementsByClassName('swap')[0]
let currency = document.getElementsByClassName('currency-choice')
let swapSearch = document.getElementsByClassName('swap-search')[0]
let to_sell_label = document.getElementById("currency-number-sell")
let to_buy_label = document.getElementById("currency-number-buy")
let listNumber = 0
let accounts
let available_coins = document.getElementsByClassName('available-coin')
let coin_prices = document.getElementsByClassName('search-price')
let coin_name = document.getElementsByClassName('coin-name')
let sell_currency = "ETH"
let buy_currency = "ETH"
let setting_exchange_currency = "USDT"
let exchange_rates = {}
let li = document.getElementsByClassName('coin-li')
let extraInfo = document.getElementsByClassName('swap-trade-sell-info')
let searchCoins = document.getElementById('input-coins')
let account_block = document.getElementsByClassName('account-block')[0]
let account_adress_element = document.getElementsByClassName('account-adress')[0]
let symbols_for_sell_label = ['0','1','2','3','4','5','6','7','8','9','.']
let blur_block = document.getElementsByClassName('blur')[0]
let connect_wallet_buttons = document.getElementsByClassName('connect_wallet_button')
let menu_buttons = document.getElementsByClassName('menu-buttons')
let menu_options = document.getElementsByClassName('menu-options')
let mobile_menu = document.getElementsByClassName('mobile-menu')[0]
let mobile_menu_icon = document.getElementsByClassName('mobile-menu-icon')[0]
let extra_menu_icon = document.getElementsByClassName('extra-menu-icon')[0]
let extra_menu = document.getElementsByClassName('extra-menu')[0]
let gas_options = document.getElementsByClassName('gas-option')
let custom_options = document.getElementsByClassName('custom-option')
let percentage_buttons = document.getElementsByClassName('percentage-button')
let time_buttons = document.getElementsByClassName('time-button')
let ctx = document.getElementsByClassName('trading-view-chart')[0]
let trading_data = {}
let trading_view = document.getElementsByClassName('trading-view')[0];
let range
let swap_modes = document.getElementsByClassName('swap-mode');
let second_mode_menu = document.getElementsByClassName('second-mode-menu')[0]
let extra_menu_modes = document.getElementsByClassName('mode-button')
let standart_mode = document.getElementsByClassName('standart-mode')
let custom_mode = document.getElementsByClassName('custom-mode')

// get cryptocurrency exchange rate

async function exchange_rate_tick(asynch = true) {
    let xmlHttp = new XMLHttpRequest()
    let symbols = []
    for (let i = 0; i < available_coins.length; i++) {
        symbols.push(available_coins[i].id + setting_exchange_currency)
    }
    xmlHttp.onreadystatechange = async function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let resp = JSON.parse(xmlHttp.responseText)
            for (let i = 0; i < resp.length; i++) {
                exchange_rates[resp[i].symbol.split("USDT")[0]] = parseFloat(resp[i].price).toFixed(2)
            }
            xmlHttp.abort()
        }     
    }
    xmlHttp.open( "GET", 'https://api.binance.com/api/v3/ticker/price?symbols=' + JSON.stringify(symbols), asynch)
    xmlHttp.send()
    for (let i = 0; i < extraInfo.length; i++) {
        if (i == 0) {
            if (String(exchange_rates[sell_currency]) != 'undefined') {
                extraInfo[i].innerHTML = '<p class="numbers">' + String(exchange_rates[sell_currency]) + " " + setting_exchange_currency +'</p>';
            }
        }
        else {
            if (String(exchange_rates[buy_currency]) != 'undefined') {
                extraInfo[i].innerHTML = '<p class="numbers">' + String(exchange_rates[buy_currency]) + " " + setting_exchange_currency +'</p>';
            }
        }
    }
    for (let i = 0; i < coin_prices.length; i++) {
        if (String(exchange_rates[available_coins[i].id]) != 'undefined') {
            coin_prices[i].innerHTML = String(exchange_rates[available_coins[i].id]) + " " + setting_exchange_currency;
        }
    }
    to_sell_input_change()
}

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

    extra_menu.style.zIndex = '0';
    extra_menu.style.opacity = '0';
    extra_menu.style.left = '0%';
    swap_block.style.marginRight = '0px';
});

for (let i = 0; i < connect_wallet_buttons.length; i++) {
    connect_wallet_buttons[i].addEventListener('click', get_accounts)
}
import generateIdenticon from "./handmade-jazzicon.js"; // Get avatar

// On page load listener

document.addEventListener("DOMContentLoaded", function() {
    get_accounts() // Check a connection to Metamask
    // Set a null values to input lables
    to_sell_label.value = '0';
    to_buy_label.innerHTML = '0';

    extra_menu_modes[0].style.background = "#FFFFFF25";
    extra_menu_modes[0].style.opacity = "1";


    if (localStorage.hasOwnProperty('gas-option') == true) {
        gas_options[localStorage.getItem('gas-option')].className += ' gas-selected';
        gas_options[parseInt(localStorage.getItem('gas-option'))+4].className += ' gas-selected';
    } else {
        gas_options[0].className += ' gas-selected';
        gas_options[4].className += ' gas-selected';
    }

    if (localStorage.hasOwnProperty('custom-option') == true) {
        custom_options[localStorage.getItem('custom-option')].className += ' custom-selected';
        custom_options[parseInt(localStorage.getItem('custom-option'))+2].className += ' custom-selected';
    } else {
        custom_options[0].className += ' custom-selected';
        custom_options[2].className += ' custom-selected';
    }

    if (localStorage.hasOwnProperty('percentage-option') == true) {
        percentage_buttons[localStorage.getItem('percentage-option')].className += ' range-selected';
        percentage_buttons[parseInt(localStorage.getItem('percentage-option'))+4].className += ' range-selected';
    } else {
        percentage_buttons[0].className += ' range-selected';
        percentage_buttons[4].className += ' range-selected';
    }

    if (localStorage.hasOwnProperty('time-option') == true) {
        time_buttons[localStorage.getItem('time-option')].className += ' range-selected';
        range = parseInt(time_buttons[localStorage.getItem('time-option')].id)
    } else {
        time_buttons[0].className += ' range-selected';
        range = parseInt(time_buttons[0].id)
    }

    if (localStorage.hasOwnProperty('swap-mode') == true) {
        if (localStorage['swap-mode'] != 0) {
            trading_view.className = 'trading-view';
        }

        if (localStorage['swap-mode'] == 1) {
            extra_menu_icon.style.display = 'none';
            second_mode_menu.style.display = 'block'
        }
    } else {
        trading_view.className = 'trading-view none';
        second_mode_menu.style.display = 'none'
    }

    trading_data["date"] = []
    for (let i = 0; i < available_coins.length; i++) {
        trading_data[available_coins[i].id] = []
    }
})
let exchange_rate_timer_id = setInterval(exchange_rate_tick, 10000);  // Create a timer for get the exchange rates

// update trading view

async function update_charts() {
    let date = new Date();
    let dateLabel = String(("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear() + '  ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2));
    for (let i = 0; i < chart.data.datasets.length; i++) {
        if (trading_data[chart.data.datasets[i].label].length == 8640) {
            trading_data[chart.data.datasets[i].label].shift()
        }
        trading_data[chart.data.datasets[i].label].push(parseFloat(exchange_rates[available_coins[i].id]));
        chart.data.datasets[i].data = trading_data[chart.data.datasets[i].label].slice(-1 * range);
    }
    if (trading_data["date"].length == 8640) {
        trading_data["date"].shift()
    }
    trading_data["date"].push(dateLabel);
    chart.data.labels = trading_data["date"].slice(-1 * range);
    chart.update()
}

setInterval(update_charts, 20000)

for (let i=0; i<currency.length; i++) {
    currency[i].addEventListener('click', function() {
        swapSearch.style.display = 'flex';
        blur_block.style.display = 'block';
        if (this.classList.contains("view")) {
            listNumber = 0;
        }
        else if (this.classList.contains("sell")) {
            listNumber = 1;
        }
        else if (this.classList.contains("buy")) {
            listNumber = 2;
        }
    });
}

for (let i = 0; i < li.length; i++) {
    li[i].addEventListener('click', function() {
        let exchange_rate = exchange_rates[this.id]
        if (listNumber == 0) {
            currency[listNumber].innerHTML = coin_name[i].innerHTML + '<p style="margin-left: 5px;">/</p>' + '<img src="images/Tether-USDT.png" alt="tether">' + 'USDT' + '<ion-icon name="chevron-down-outline" class="list-arrow"></ion-icon>';
            for (let j=0; j<chart.data.datasets.length; j++) {
                chart.data.datasets[j].hidden = true;
                if (chart.data.datasets[j].label == this.id) {
                    chart.data.datasets[j].hidden = false;
                }
            }
            chart.update();
        }
        else {
            currency[listNumber].innerHTML = coin_name[i].innerHTML + '<ion-icon name="chevron-down-outline" class="list-arrow"></ion-icon>';
        }
        if (String(exchange_rate) != 'undefined' && listNumber != 0) {
            extraInfo[listNumber-1].innerHTML = '<p class="numbers">' + String(exchange_rate) + " " + setting_exchange_currency +'</p>';
        }
        if (listNumber == 1) {
            sell_currency = this.id
        }
        else if (listNumber == 2) {
            buy_currency = this.id
        }
        swapSearch.style.display = 'none';
        blur_block.style.display = 'none';
        to_sell_input_change()
    })
}

let coinImages = document.getElementsByClassName('coin-image');
let noResult = document.getElementById('error-search');
let showedLi = 0;

searchCoins.addEventListener('keyup', function() {
    for (let i=0; i<li.length; i++) {
        if (coinImages[i].alt.indexOf(this.value) == -1 && coinImages[i].alt.toLowerCase().indexOf(this.value) == -1 && coinImages[i].alt.toUpperCase().indexOf(this.value) == -1) {
            li[i].style.display = "none";
        } else {
            li[i].style.display = "flex";
        }
    }
    for (let i=0; i<li.length; i++) {
        if (li[i].style.display == "flex") {
            showedLi += 1;
        }
    }
    if (showedLi == 0) {
        noResult.style.display = 'flex';
        noResult.innerHTML = '<p>No results for "'+ this.value + '"</p>';
    } else {
        noResult.style.display = 'none';
    }
    showedLi = 0;
});

to_sell_label.addEventListener('keyup', function() { // Exchange input filter 
    if (symbols_for_sell_label.includes(this.value[this.value.length-1]) == false) {
        this.value = this.value.slice(0, -1);
    }
    if (this.value == "") {
        this.value = "0";
    }
    if (this.value[0] == '0' && this.value.length > 1 && this.value[1] != '.') {
        this.value = this.value.substring(1);
    }
});



async function to_sell_input_change(value=to_sell_label.value) {
    let exchange_rate = exchange_rates[sell_currency] / exchange_rates[buy_currency]
    let change_value = (parseFloat(value) * exchange_rate).toFixed(3);
    if (change_value == "NaN") {
        to_buy_label.innerHTML = "0";
    } else {
        to_buy_label.innerHTML = change_value;
    }
}

to_sell_label.oninput = function() {
    to_sell_input_change(this.value)
}

// Main menu

for (let i = 0; i < menu_buttons.length; i++) {
    menu_buttons[i].addEventListener('click', () => {
        if (menu_options[i].style.display == 'none') {
            for (var j = 0; j < menu_buttons.length; j++) {
                if (j == i) {
                    menu_options[j].style.display = 'flex';
                    menu_options[j].style.animation = '0.8s show-menu';
                } else {
                    menu_options[j].style.display = 'none';
                }
            }
        } else {
            menu_options[i].style.display = 'none';
        }
    });
}

main_bg.addEventListener('click', () => {
    for (let i = 0; i < menu_options.length; i++) {
        menu_options[i].style.display = 'none';
    }
});

light.addEventListener('click', () => {
    for (let i = 0; i < menu_options.length; i++) {
        menu_options[i].style.display = 'none';
    }
});

mobile_menu_icon.addEventListener('click', () => {
    mobile_menu.style.display = 'flex';
    mobile_menu.style.animation = '0.8s show-menu';
    blur_block.style.display = 'block';
});

blur_block.addEventListener('click', () => {
    mobile_menu.style.display = 'none';
    swapSearch.style.display = 'none';
    blur_block.style.display = 'none';
});

// Extra menu

extra_menu_icon.addEventListener('click', () => {
    if (extra_menu.style.opacity == '0') {
        extra_menu.style.opacity = '1';
        if (window.innerWidth < 750) {
            extra_menu.style.zIndex = '2';
        } else {
            extra_menu.style.left = '107%';
            swap_block.style.marginRight = '350px';
        }
    } else {
        extra_menu.style.zIndex = '0';
        extra_menu.style.opacity = '0';
        if (window.innerWidth < 750) {
            extra_menu.style.left = '0%';
        } else {
            extra_menu.style.left = '20%';
        }
        swap_block.style.marginRight = '0px';
    }
});

main_bg.addEventListener('click', () => {
    extra_menu.style.zIndex = '0';
    extra_menu.style.opacity = '0';
    extra_menu.style.left = '0%';
    swap_block.style.marginRight = '0px';
});

light.addEventListener('click', () => {
    extra_menu.style.zIndex = '0';
    extra_menu.style.opacity = '0';
    extra_menu.style.left = '0%';
    swap_block.style.marginRight = '0px';
});

for (let i = 0; i < gas_options.length; i++) {
    gas_options[i].addEventListener('click', () => {
        localStorage.setItem('gas-option',i%4);
        for (let j = 0; j < gas_options.length; j++) {
            gas_options[j].className = 'gas-option';
        }
        gas_options[i].style.animation = '0.8s option-select';
        gas_options[i%4].className += ' gas-selected';
        gas_options[4+i%4].className += ' gas-selected';
        setTimeout(() => {gas_options[i].style.animation = 'none';}, 800);
    });
}

for (let i = 0; i < custom_options.length; i++) {
    custom_options[i].addEventListener('click', () => {
        localStorage.setItem('custom-option',i%2);
        for (let j = 0; j < custom_options.length; j++) {
            custom_options[j].className = 'custom-option';
        }
        custom_options[i].style.animation = '0.8s option-select';
        custom_options[i%2].className += ' custom-selected';
        custom_options[2+i%2].className += ' custom-selected';
        setTimeout(() => {custom_options[i].style.animation = 'none';}, 800);
    });
}

for (let i = 0; i < percentage_buttons.length; i++) {
    percentage_buttons[i].addEventListener('click', () => {
        localStorage.setItem('percentage-option',i%4);
        for (let j = 0; j < percentage_buttons.length; j++) {
            percentage_buttons[j].className = 'percentage-button';
        }
        percentage_buttons[i].style.animation = '0.8s option-select';
        percentage_buttons[i%4].className += ' range-selected';
        percentage_buttons[4+i%4].className += ' range-selected';
        setTimeout(() => {percentage_buttons[i].style.animation = 'none';}, 800);
    });
}

for (let i = 0; i < swap_modes.length; i++) {
    swap_modes[i].addEventListener('click', () => {
        localStorage.setItem('swap-mode',i);
        if (i != 0) {
            trading_view.className = 'trading-view';
        } else {
            trading_view.className = 'trading-view none';
        }

        if (i != 1) {
            extra_menu_icon.style.display = 'flex';
            second_mode_menu.style.display = 'none'
        } else {
            extra_menu_icon.style.display = 'none';
            extra_menu.style.zIndex = '0';
            extra_menu.style.opacity = '0';
            extra_menu.style.marginLeft = '0%';
            second_mode_menu.style.display = 'block'
            swap_block.style.marginRight = '0px';
        }
    });
}

for (let i = 0; i < extra_menu_modes.length; i++) {
    extra_menu_modes[i].addEventListener('click', () => {
        for (let j = 0; j < extra_menu_modes.length; j++) {
            extra_menu_modes[j].style.background = "none";
            extra_menu_modes[j].style.opacity = "0.5";
        }
        extra_menu_modes[i].style.background = "#FFFFFF25";
        extra_menu_modes[i].style.opacity = "1";
        if (i == 0) {
            for (let j = 0; j < standart_mode.length; j++) {
                standart_mode[j].style.display = "flex";
            }
            for (let j = 0; j < custom_mode.length; j++) {
                custom_mode[j].style.display = "none";
            }
        } else {
            for (let j = 0; j < custom_mode.length; j++) {
                custom_mode[j].style.display = "flex";
            }
            for (let j = 0; j < standart_mode.length; j++) {
                standart_mode[j].style.display = "none";
            }
        }
    });
}

for (let i = 0; i < time_buttons.length; i++) {
    time_buttons[i].addEventListener('click', () => {
        localStorage.setItem('time-option',i);
        for (let j = 0; j < time_buttons.length; j++) {
            time_buttons[j].className = 'time-button';
        }
        time_buttons[i].style.animation = '0.8s option-select';
        time_buttons[i].className += ' range-selected';
        setTimeout(() => {time_buttons[i].style.animation = 'none';}, 800);
        range = parseInt(time_buttons[i].id);
        console.log(range)

        for (let j = 0; j < chart.data.datasets.length; j++) {
            chart.data.datasets[j].data = trading_data[chart.data.datasets[j].label].slice(-1 * range);
        }
        chart.data.labels = trading_data["date"].slice(-1 * range);
        chart.update();
    });
}

// Trading view charts

let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'ETH',
                data: [],
                hidden: false,
                fill: false,
                borderColor: '#215CAF',
                borderWidth: 2.5,
                pointStyle: 'dash',
                pointRadius: 0,
                pointHoverRadius: 0,
                hitRadius: 40,
                tension: 0.05
            },
            {
                label: 'BTC',
                data: [],
                hidden: true,
                fill: false,
                borderColor: '#f7931a',
                borderWidth: 2.5,
                pointStyle: 'dash',
                pointRadius: 0,
                pointHoverRadius: 0,
                hitRadius: 40,
                tension: 0.05
            },
            {
                label: 'MATIC',
                data: [],
                hidden: true,
                fill: false,
                borderColor: '#8247e5',
                borderWidth: 2.5,
                pointStyle: 'dash',
                pointRadius: 0,
                pointHoverRadius: 0,
                hitRadius: 40,
                tension: 0.05
            },
            {
                label: 'ETC',
                data: [],
                hidden: true,
                fill: false,
                borderColor: '#01c853',
                borderWidth: 2.5,
                pointStyle: 'dash',
                pointRadius: 0,
                pointHoverRadius: 0,
                hitRadius: 40,
                tension: 0.05
            },
            {
                label: 'BNB',
                data: [],
                hidden: true,
                fill: false,
                borderColor: '#f3ba2f',
                borderWidth: 2.5,
                pointStyle: 'dash',
                pointRadius: 0,
                pointHoverRadius: 0,
                hitRadius: 40,
                tension: 0.05
            }
        ]
    },
    options: {
        animation: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                displayColors: false,
                callbacks: {
                    title: function(context) {
                        return context[0].dataset.label;
                    },
                    label: function(context) {
                        return 'Price: ' + '$' + context.parsed.y.toFixed(2);
                    },
                    footer: function(context) {
                        return 'Date: ' + context[0].label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    lineWidth: 0.2,
                    color: '#4f4f4f',
                    borderColor: '#FFFFFF80'
                },
                ticks: {
                    color: '#FFFFFF80',
                    padding: 5,
                    callback: function(value) {
                        return this.getLabelForValue(value).split(' ')[2];
                    }
                }
            },
            y: {
                grid: {
                    lineWidth: 0.2,
                    color: '#4f4f4f',
                    borderColor: '#FFFFFF80'
                },
                ticks: {
                    color: '#FFFFFF80',
                    padding: 5,
                    callback: function(value) {
                        return '$' + value.toFixed(2);
                    }
                }
            }
        }
    }
});