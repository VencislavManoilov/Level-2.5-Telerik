let cookies = 0, cookie, title, cookieText, allUpgradesElement, allMouseUpgradesElement, cps, cpsNum = 0, cpcNum = 1, cookieIsClicked = false;

let click1 = new Audio("sounds/click1.mp3");
click1.volume = 0.1;

let click2 = new Audio("sounds/click2.mp3");
click2.volume = 0.1;

let upgrades = [
    {
        name: "Cursor",
        image: "mouse",
        number: 0,
        discription: "Adds one click per second.",
        price: 25,
        show: true,
        Upgrade: function() {
            instance = upgrades[0];
            if(cookies >= instance.price) {
                cookies -= instance.price;
                instance.number++;
                cpsNum++;
                upgrades[1].show = true;
                RegenerateAllUpgrades();
            }
        },
        update: function() {
            instance = upgrades[0];
            cookies += instance.number;
        }
    },
    {
        name: "Grandma",
        image: "grandma",
        number: 0,
        discription: "Adds 10 click per second.",
        price: 100,
        show: false,
        Upgrade: function() {
            instance = upgrades[1];
            if(cookies >= instance.price) {
                cookies -= instance.price;
                instance.number++;
                cpsNum += 10;
                upgrades[2].show = true;
                RegenerateAllUpgrades();
            }
        },
        update: function() {
            instance = upgrades[1];
            cookies += instance.number*10;
        }
    },
    {
        name: "Farm",
        image: "farm",
        number: 0,
        discription: "Adds 100 click per second.",
        price: 1000,
        show: false,
        Upgrade: function() {
            instance = upgrades[2];
            if(cookies >= instance.price) {
                cookies -= instance.price;
                instance.number++;
                cpsNum += 100;
                upgrades[3].show = true;
                RegenerateAllUpgrades();
            }
        },
        update: function() {
            instance = upgrades[2];
            cookies += instance.number*100;
        }
    },
    {
        name: "Mine",
        image: "mine",
        number: 0,
        discription: "Adds 1000 click per second.",
        price: 10000,
        show: false,
        Upgrade: function() {
            instance = upgrades[3];
            if(cookies >= instance.price) {
                cookies -= instance.price;
                instance.number++;
                cpsNum += 1000;
                RegenerateAllUpgrades();
            }
        },
        update: function() {
            instance = upgrades[3];
            cookies += instance.number*1000;
        }
    },
];

let mouseUpgrades = [
    {
        name: "Rainforced",
        image: "rainforced",
        number: 0,
        discription: "At click you get 1 more cookie",
        price: 550,
        show: true,
        BuyIt: function() {
            instance = mouseUpgrades[0];
            if(cookies >= instance.price) {
                cookies -= instance.price;
                instance.bought = true;
                instance.number++;
                cpcNum += 1;
                mouseUpgrades[1].show = true;
                RegenerateAllUpgrades();
            }
        }
    },
    {
        name: "Carpal",
        image: "PinkCursor",
        number: 0,
        discription: "At click you get 5 more cookie",
        price: 2750,
        show: false,
        BuyIt: function() {
            instance = mouseUpgrades[1];
            if(cookies >= instance.price) {
                cookies -= instance.price;
                instance.bought = true;
                instance.number++;
                cpcNum += 5;
                mouseUpgrades[2].show = true;
                RegenerateAllUpgrades();
            }
        }
    },
    {
        name: "Ambidextrous",
        image: "Cyan",
        number: 0,
        discription: "At click you get 25 more cookie",
        price: 15250,
        show: false,
        BuyIt: function() {
            instance = mouseUpgrades[2];
            if(cookies >= instance.price) {
                cookies -= instance.price;
                instance.bought = true;
                instance.number++;
                cpcNum += 25;
                RegenerateAllUpgrades();
            }
        }
    },
]

let Game = {
    Earn: function(number) {
        cookies += number;
        return String("You earned " + number + " cookies!!!");
    }
}

function onBodyLoad() {
    for(i = 0; i < upgrades.length; i++) {
        setInterval(upgrades[i].update, 1000);
    }

    setInterval(update, 10);
    setInterval(oneSecondsUpdate, 1000);

    allUpgradesElement = document.getElementById("all-upgrades");
    for(i = 0; i < upgrades.length; i++) {
        if(upgrades[i].show) {
            allUpgradesElement.innerHTML +=
            `<div style="margin:5px" id="upgrade` + i + ` ">
                <h2>` + upgrades[i].name + `</h2>
                <img draggable="false" src=images/` + upgrades[i].image + `.png>
                <h4 id="number` + i + `">` + upgrades[i].number + `</h4>
                <h3>` + upgrades[i].discription + `</h3>
                <h5 id="button` + i + `" class="button">Buy: ` + upgrades[i].price + `</h5>
            </div>`;
        }
    }

    allMouseUpgradesElement = document.getElementById("all-mouseUpgrades");
    for(i = 0; i < mouseUpgrades.length; i++) {
        if(mouseUpgrades[i].show) {
            allMouseUpgradesElement.innerHTML +=
            `<div style="margin:5px" id="mouseUpgrade` + i + `">
                <h2>` + mouseUpgrades[i].name + `</h2>
                <img draggable="false" src=images/` + mouseUpgrades[i].image + `.png>
                <h4 id="numberForMouseUpgrade` + i + `">` + mouseUpgrades[i].number + `</3>
                <h3>` + mouseUpgrades[i].discription + `</3>
                <h5 id="buttonForMouseUpgrade` + i + `" class="button">Buy: ` + mouseUpgrades[i].price + `</h5>
            </div>`
        }
    }
}

function update() {
    cookie = document.getElementById("Cookie");
    cookie.addEventListener("mousedown", CookieClick);
    cookie.addEventListener("mouseup", CookieUnClick);

    cookie.style.transition = "0.1s";
    if(cookieIsClicked) {
        cookie.style.transform = "scale(0.95)";
    } else {
        cookie.style.transform = "scale(1)";
        cookie.style.transition = "0.5s";
    }

    cookieText = document.getElementById("CookieText");
    cookieText.innerHTML = "Cookies: " + cookies;

    cps = document.getElementById("CPS");
    cps.innerHTML = ("Clicks Per Second: " + cpsNum);

    for(i = 0; i < upgrades.length; i++) {
        if(upgrades[i].show) {
            upgrades[i].buttonElement = document.getElementById("button" + i);
            upgrades[i].buttonElement.addEventListener("mouseup", upgrades[i].Upgrade);

            upgrades[i].numberElement = document.getElementById("number" + i);
            upgrades[i].numberElement.innerHTML = upgrades[i].number;
        }
    }

    for(i = 0; i < mouseUpgrades.length; i++) {
        if(mouseUpgrades[i].show) {
            mouseUpgrades[i].buttonElement = document.getElementById("buttonForMouseUpgrade" + i);
            mouseUpgrades[i].buttonElement.addEventListener("mouseup", mouseUpgrades[i].BuyIt);

            mouseUpgrades[i].numberElement = document.getElementById("numberForMouseUpgrade" + i);
            mouseUpgrades[i].numberElement.innerHTML = mouseUpgrades[i].number;
        }
    }
}

function RegenerateAllUpgrades() {
    allUpgradesElement = document.getElementById("all-upgrades");
    allUpgradesElement.innerHTML = "";
    for(i = 0; i < upgrades.length; i++) {
        if(upgrades[i].show) {
            allUpgradesElement.innerHTML +=
            `<div style="margin:5px" id="upgrade` + i + ` ">
            <h2>` + upgrades[i].name + `</h2>
            <img draggable="false" src=images/` + upgrades[i].image + `.png>
            <h4 id="number` + i + `">` + upgrades[i].number + `</h4>
            <h3>` + upgrades[i].discription + `</h3>
            <h5 id="button` + i + `" class="button">Buy: ` + upgrades[i].price + `</h5>
            </div>`;
        }
    }

    allMouseUpgradesElement = document.getElementById("all-mouseUpgrades");
    allMouseUpgradesElement.innerHTML = "";
    for(i = 0; i < mouseUpgrades.length; i++) {
        if(mouseUpgrades[i].show) {
            allMouseUpgradesElement.innerHTML +=
            `<div style="margin:5px" id="mouseUpgrade` + i + `">
            <h2>` + mouseUpgrades[i].name + `</h2>
            <img draggable="false" src=images/` + mouseUpgrades[i].image + `.png>
            <h4 id="numberForMouseUpgrade` + i + `">` + mouseUpgrades[i].number + `</3>
            <h3>` + mouseUpgrades[i].discription + `</3>
                <h5 id="buttonForMouseUpgrade` + i + `" class="button">Buy: ` + mouseUpgrades[i].price + `</h5>
            </div>`
        }
    }
}

function oneSecondsUpdate() {
    if(cookies >= 1) {
        title = document.getElementById("title");
        title.innerHTML = "Cookie Clicker - " + cookies + " cookies";
    }
}

function CookieClick() {
    cookieIsClicked = true;
    let whatClick = randomInteger(1, 2);
    if(whatClick == 1) {
        click1.play();
    } else {
        click2.play();
    }
}

function CookieUnClick() {
    cookies += cpcNum;
    cookieIsClicked = false;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (min - max + 1) + max);
 }