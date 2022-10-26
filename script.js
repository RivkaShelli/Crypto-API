const firstAPI = "https://api.coingecko.com/api/v3/coins/list";
const moreInfoAPI = "https://api.coingecko.com/api/v3/coins/{id}";
var coinsArr = [];
const coinsCards = document.getElementById("coins");
const moreInfoButton = document.getElementById("more-info");
const homeButton = document.getElementById("home");
const aboutButton = document.getElementById("about");
const reportsButton = document.getElementById("reports");
const searchButton = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const CACHE = {};
const CACHE_REFRESH = 120; // in seconds

coinsCards.innerHTML = `<div class="spinner-border mt-4" role="status">
                    <span class="visually-hidden">Loading...</span>
                    </div>`;

fetch(firstAPI).then(res => res.json()).then(res => {
    for (let i = 0; i < 100; i++) {
        coinsArr.push({
            name: res[i].name,
            symbol: res[i].symbol,
            id: res[i].id
        });
    }
    console.log(coinsArr);
    insertCoinsToHtml(coinsArr);
});

async function insertCoinsToHtml(coinsArr) {
    coinsCards.innerHTML = "";
    let trackNamesArr = trackArr.map(obj => obj.name);
    console.log(trackNamesArr);

    for (let i = 0; i < coinsArr.length; i++) {
        if (trackNamesArr.indexOf(coinsArr[i].name) === -1) {
            coinsCards.innerHTML += `<div class="col m-2"><div class="card" style="width: 18rem;">
        <div class="form-check form-switch">
        <input onclick="tracking(event)" class="form-check-input toggle btn-lg" type="checkbox" id="flexSwitchCheckDefault${i}" data-symbol="${coinsArr[i].symbol}" data-name="${coinsArr[i].name}" data-id="${coinsArr[i].id}">
        </div>
        <div class="card-body" data-idx="${i}">
        <h5 class="card-title">${coinsArr[i].symbol}</h5> 
        <p class="card-text">${coinsArr[i].name}</p>
        <button onclick="getMoreInfo(event)" id="${coinsArr[i].id}" class="btn btn-secondary" data-idx="${i}" data-name="${coinsArr[i].name}">More Info</button>
        <div id="${i}" class="info n${i}" data-id="${i}"></div>     
        </div></div></div>`;
        }
        else {
            coinsCards.innerHTML += `<div class="col m-2"><div class="card" style="width: 18rem;">
        <div class="form-check form-switch">
        <input onclick="tracking(event)" class="form-check-input toggle btn-lg" checked type="checkbox" id="flexSwitchCheckDefault${i}" data-symbol="${coinsArr[i].symbol}" data-name="${coinsArr[i].name}" data-id="${coinsArr[i].id}">
        </div>
        <div class="card-body" data-idx="${i}">
        <h5 class="card-title">${coinsArr[i].symbol}</h5> 
        <p class="card-text">${coinsArr[i].name}</p>
        <button onclick="getMoreInfo(event)" id="${coinsArr[i].id}" class="btn btn-secondary" data-idx="${i}" data-name="${coinsArr[i].name}">More Info</button>
        <div id="${i}" class="info n${i}" data-id="${i}"></div>     
        </div></div></div>`;
        }
        
    }
};


function getMoreInfo(e) {
    e.preventDefault();
        var myClassArr = [];
        for (let i = 0; i < e.target.classList.length; i++) {
            myClassArr.push(e.target.classList[i]);
        }
        if (myClassArr.indexOf("open") == -1) {
            e.target.classList += " open";
            var idx = e.target.dataset.idx;
            if (CACHE[e.target.dataset.name] && (new Date - CACHE[e.target.dataset.name].fetchDate) / 1000 < CACHE_REFRESH) {
                document.getElementById(`${idx}`).innerHTML = `<img class="coin-img" src="${CACHE[e.target.dataset.name].image}"><div>Current price in: <br> UDS: ${CACHE[e.target.dataset.name].usd} &#36 <br> EUR: ${CACHE[e.target.dataset.name].eur} &#8364; <br> ILS: ${CACHE[e.target.dataset.name].ils} &#8362 </div>`;
            }
            else {
                document.getElementById(`${idx}`).innerHTML = `<div class="spinner-border text-secondary mt-4" role="status">
                    <span class="visually-hidden">Loading...</span>
                    </div>`;
                fetch(`https://api.coingecko.com/api/v3/coins/${e.target.id}`).then(res => res.json()).then(res => {
                    document.getElementById(`${idx}`).innerHTML = `<img class="coin-img" src="${res.image.thumb}"><div>Current price in: <br> UDS: ${res.market_data.current_price.usd} &#36 <br> EUR: ${res.market_data.current_price.eur} &#8364; <br> ILS: ${res.market_data.current_price.ils} &#8362 </div>`;
                    CACHE[e.target.dataset.name] = {
                        coinName: e.target.dataset.name,
                        image: res.image.thumb,
                        usd: res.market_data.current_price.usd,
                        eur: res.market_data.current_price.eur,
                        ils: res.market_data.current_price.ils,
                        fetchDate: new Date()
                    };
                    console.log(CACHE);
                });
            }
        }
        else {
            e.target.classList.remove("open");
            document.getElementById(`${e.target.dataset.idx}`).innerHTML = "";

        }
    }



homeButton.addEventListener('click', backtohome);
aboutButton.addEventListener('click', about);
reportsButton.addEventListener('click', reports);

function about() {
    coinsCards.innerHTML = "<div class='about'> My name is Rivka Shelli, 21 , live in Jerusalrm. <br> The project contains a page that accesses information and reports from the world of virtual trading - virtual currencies. </div>";
}

function reports() {
    coinsCards.innerHTML = "";
}

function backtohome() {
    insertCoinsToHtml(coinsArr);
    for (let i = 0; i < coinsArr.length; i++){
        
    }
}

searchButton.addEventListener('click', search);

function search() {
    var searchRes = [];
    let res = searchInput.value;
    let counter = 0;
    for (let i = 0; i < coinsArr.length; i++) {
        if (coinsArr[i].symbol.indexOf(res) > -1) {
            searchRes.push(coinsArr[i]);
        }
        else {
            counter++;
        }
    }
    insertCoinsToHtml(searchRes);
    if (counter == coinsArr.length) {
        coinsCards.innerHTML = `<div class="about">Coin not found</div>`;
    }
    searchInput.value = "";
}

const trackArr = [];

const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('staticBackdrop'));

var moreTrack;

function tracking(e) {
    debugger;
        moreTrack = {
        name: e.target.dataset.name,
        symbol: e.target.dataset.symbol,
        id: e.target.dataset.id
    }
    if (trackArr.length < 5) {
        let count = 0;
        let idx;
        for (let i = 0; i < trackArr.length; i++) {
            if (trackArr[i].name !== e.target.dataset.name) {
                count++;
            }
            else {
                idx = i;
            }
        }
        if (count === trackArr.length) {
            trackArr.push(moreTrack);
        }
        else {
            trackArr.splice(idx, 1);
        }
    }
    else {
        let flag = false;
        for (let i = 0; i < trackArr.length; i++){
            if (trackArr[i].name === e.target.dataset.name) {
                trackArr.splice(i, 1);
                flag = true;
            }
        }
        if (flag === false) {
            e.target.checked = false;
            showModal();
        }
    }
    
    console.log(trackArr);
    console.log(moreTrack);
}


function buildModalStr() {
    modalStr = "";
    for (let i = 0; i < trackArr.length; i++) {
        modalStr += `<div class="col m-2"><div class="card" style="width: 18rem;">
        <div class="form-check form-switch">
    <input onclick="finishTheModal(event)" id="${trackArr[i].name}" data-pick=${trackArr[i]} class="form-check-input  toggle btn-lg" type="checkbox" checked id="flexSwitchCheckDefault">
</div>
        <div class="card-body" data-idx="${i}">
        <h5 class="card-title">${trackArr[i].symbol}</h5> 
        <p class="card-text">${trackArr[i].name}</p>
        </div></div></div>`
    }
    return modalStr;
}


function showModal() {
    document.getElementById('m-body').innerHTML = buildModalStr();
    myModal.show();
}

function finishTheModal(e) {
    myModal.hide();
    console.log(e.target);
    let idx;
    for (let i = 0; i < trackArr.length; i++){
        if (e.target.id === trackArr[i].name) {
            idx = i;
        }
    }
    trackArr.splice(idx, 1);
    trackArr.push(moreTrack);
    console.log(trackArr);
    insertCoinsToHtml(coinsArr);
}

