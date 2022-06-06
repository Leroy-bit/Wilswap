var currency = document.getElementsByClassName('currency-choice')
var swapContent = document.getElementsByClassName('swap-content')[0];
var swapSearch = document.getElementsByClassName('swap-search')[0];
var backButton = document.getElementsByClassName('back-button')[0];
var to_sell_label = document.getElementById("currency-number-sell")
var to_buy_label = document.getElementById("currency-number-buy")
var listNumber = 0
var available_coins = document.getElementsByClassName('available-coin')
var sell_currency = "ETH"
var buy_currency = "ETH"
var setting_exchange_currency = "USDT"
var exchange_rates = {}
var li = document.getElementsByClassName('coin-li');
var extraInfo = document.getElementsByClassName('swap-trade-sell-info')[0];
var searchCoins = document.getElementById('input-coins');
var symbols_for_sell_label = ['0','1','2','3','4','5','6','7','8','9','.'];
// var exchange_rate_timer_id = setInterval(async function() {
//     let xmlHttp = new XMLHttpRequest()
//     for (let i = 0; i < available_coins.length; i++) {
        
//         xmlHttp.onload = async function() {
//             let resp = xmlHttp.responseText
//             console.log(resp)
//             exchange_rates[available_coins[i].id] = parseFloat(resp.price).toFixed(2)
           
//         }
//         xmlHttp.open( "GET", "https://api.binance.com/api/v3/ticker/price?symbol=" + available_coins[i].id + setting_exchange_currency, true ) // false for synchronous request
//         xmlHttp.send()
//         xmlHttp.abort()
        
//     }
// }, 10000)

async function exchange_rate_tick(asynch = true) {
    let xmlHttp = new XMLHttpRequest()
    let symbols = []
    for (let i = 0; i < available_coins.length; i++) {
        symbols.push(available_coins[i].id + setting_exchange_currency)
    }
    xmlHttp.onload = async function() {
        let resp = JSON.parse(xmlHttp.responseText)
        for (let i = 0; i < resp.length; i++) {
            exchange_rates[resp[i].symbol.split("USDT")[0]] = parseFloat(resp[i].price).toFixed(2)
        }
        xmlHttp.abort()      
    }
    xmlHttp.open( "GET", "https://api.binance.com/api/v3/ticker/price?symbols=" + JSON.stringify(symbols), asynch )
    xmlHttp.send()
    extraInfo.innerHTML = '<p>'+ sell_currency +'</p><p class="numbers">' + String(exchange_rates[sell_currency]) + " " + setting_exchange_currency +'</p>';
    to_sell_input_change()
}

document.addEventListener("DOMContentLoaded", function() {
    exchange_rate_tick(false)
    to_sell_label.value = 0
    to_buy_label.innerHTML = 0
})
exchange_rate_tick(false)
var exchange_rate_timer_id = setInterval(exchange_rate_tick, 10000)  


for (var i=0; i<currency.length; i++) {
    currency[i].addEventListener('click', function() {
        swapContent.style.display = 'none';
        swapSearch.style.display = 'flex';
        if (this.classList.contains("sell")) {
            listNumber = 0
        }
        else {
            listNumber = 1
        }
    });
}

backButton.addEventListener('click', function() {
    swapContent.style.display = 'flex';
    swapSearch.style.display = 'none';
});

async function get_exchange_rate(sell, buy="USDT") {
    if (buy == "USDT") {
        return exchange_rates[sell]
    }
    else {
        return exchange_rates[sell] / exchange_rates[buy]
    }
}

function on_click_coin_li(element) {
    var exchange_rate = exchange_rates[element.id]
    var a = 0
    console.log(exchange_rate)
    currency[listNumber].innerHTML = element.innerHTML + '<ion-icon name="chevron-down-outline" class="list-arrow"></ion-icon>';
    if (listNumber == 0) {
        extraInfo.innerHTML = '<p>'+ element.id +'</p><p class="numbers">' + String(exchange_rate) + " " + setting_exchange_currency +'</p>';
        sell_currency = element.id
    }
    else {
        buy_currency = element.id
    }
    swapContent.style.display = 'flex';
    swapSearch.style.display = 'none';
    to_sell_input_change()
}

var coinImages = document.getElementsByClassName('coin-image');
var noResult = document.getElementById('error-search');
var showedLi = 0;

searchCoins.addEventListener('keyup', function() {
    for (var i=0; i<li.length; i++) {
        if (coinImages[i].alt.indexOf(this.value) == -1 && coinImages[i].alt.toLowerCase().indexOf(this.value) == -1 && coinImages[i].alt.toUpperCase().indexOf(this.value) == -1) {
            li[i].style.display = "none";
        } else {
            li[i].style.display = "flex";
        }
    }
    for (var i=0; i<li.length; i++) {
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



to_sell_label.addEventListener('keyup', function() {
    if (symbols_for_sell_label.includes(this.value[this.value.length-1]) == false) {
        this.value = this.value.slice(0, -1);
    }
    if (this.value == "") {
        this.value = "0";
    }
    if (this.value[0] == '0' && this.value.length > 1) {
        this.value = this.value.substring(1);
    }
});




async function connect_wallet() {
    const getWeb3 = async () => {
        return new Promise(async (resolve, reject) =>  {
            const Web3 = new Web3(window.ethereum)
            try {
                await window.ethereum.request({method: "eth_requestAccounts"})
                resolve(web3)
            } catch (error) {
                reject(error)
            }
        })
    }
    if(window.ethereum) {
        console.log("Metamask detected")
       web3 = await getWeb3()
        const wallet_adress = web3.eth.requestAccounts()
        console.log(wallet_adress)
    }
    else {
        window.location = "https://metamask.io"
    }
}

async function to_sell_input_change(value=to_sell_label.value) {
    exchange_rate = exchange_rates[sell_currency] / exchange_rates[buy_currency]
    change_value = (parseFloat(value) * exchange_rate).toFixed(3);
    if (change_value == "NaN") {
        to_buy_label.innerHTML = "0";
    } else {
        to_buy_label.innerHTML = change_value;
    }
}

to_sell_label.oninput = function() {
    to_sell_input_change(this.value)
}