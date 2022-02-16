// Получение таблицы
let mainTbody = document.getElementById('main-tbody');
// Кнопки перехода на предыдущую/следующюю страницу
let nextPage = document.getElementById('nextPage');
let previousPage = document.getElementById('previousPage');
// Доступ к <p>, отображение номера текущей страницы
let numberCurrentPage = document.getElementById('numCurrentPage');
//
let columnEdit, rowEdit;
let showFirstNameColumn = true;
let showLastNameColumn = true;
let showAboutColumn = true;
let showEyeColorColumn = true;
let triangle = document.querySelectorAll('.triangle');
let count;
for (let i = 0; i < triangle.length; i++) {
    triangle[i].count = 1;
}

let readJson = 'package.json';
let request = new XMLHttpRequest();
let arr = [[],{}];
let currentPage = 0;
request.open('GET', readJson );
request.responseType ='json';
request.send();

request.onload = function () {
    let date = request.response;
    console.log ( date.length) ;
    toArray(date);
    numberCurrentPage.textContent= `The number of the current page is ${currentPage + 1}`;
}

 function toArray(objJson) {
    for (let i = 0; i < objJson.length; i++) {
        let map = new Map();
        for (let key in objJson[i]) {
            if (key != 'id' && key != 'phone') {
                switch (key) {
                    case 'name' :
                        for (let subkey in objJson[i][key]) {
                            map.set(subkey, objJson[i][key][subkey]);
                        }
                        break;
                    case 'about' :
                        map.set(key, objJson[i][key]);
                        break;
                    case 'eyeColor' :
                        map.set(key, objJson[i][key]);
                        break;
                }
            }
        }
        arr[i] = map;
    }
    toTable(currentPage);
    click();
}

// захреначь иницилизация в функцию,
function toTable(currentPage) {
    mainTbody.textContent = '';
    for (let i = 10 * currentPage; i < currentPage * 10 + 10; i++) {
        printTr();
        for (let [key, value] of arr[i].entries()) {
            if (key == 'about' && showAboutColumn) {
                let text = value;
                if (text.length > 115) {
                    text = text.slice(0, 115) + '...';
                    printTd(key, text, false);
                } else {
                    printTd(key, text, false);
                }
            } else if (key == 'eyeColor' && showEyeColorColumn) {
                printTd(key, value, true);
            } else if (key == 'firstName' && showFirstNameColumn) {
                printTd (key, value, false);
            } else if (key == 'lastName' && showLastNameColumn) {
            printTd (key, value, false);
        }
        }
    }
    numberCurrentPage.textContent= `The number of the current page is ${currentPage + 1}`;
}

function printTr() {
    tr = document.createElement("tr");
    mainTbody.appendChild(tr);
}

function printTd(key, text, isColor) {
    td = document.createElement("td");
    tr.appendChild(td);
    if (isColor) {
        td.className = 'eyeColor';
        td.id = 'eyeColor';
        td.style.backgroundColor = text;
    } else {
        td.id = key;
        td.textContent = text;
    }
}

function sortArr(parameter) {
    flipTriangle(parameter);
    let newArr = [[], {}];
    for (let i = 0; i < arr.length; i++) {
        newArr[i] = arr[i];
    }
        switch (parameter) {
        case 0:
            newArr.sort(function (a, b) {
                if (a.get('firstName') === b.get('firstName')) {
                    return 0;
                }
                return a.get('firstName') < b.get('firstName') ? -1 : 1;
            })
            break;
        case 1:
            newArr.sort(function (a, b) {
                if (a.get('lastName') === b.get('lastName')) {
                    return 0;
                }
                return a.get('lastName') < b.get('lastName') ? -1 : 1;
            })
            break;
        case 2:
            newArr.sort(function (a, b) {
                if (a.get('about') === b.get('about')) {
                    return 0;
                }
                return a.get('about') < b.get('about') ? -1 : 1;
            })
            break;
        case 3:
            newArr.sort(function (a, b) {
                if (a.get('eyeColor') === b.get('eyeColor')) {
                    return 0;
                }
                return a.get('eyeColor') < b.get('eyeColor') ? -1 : 1;
            })
            break;
        }
    for (let i = 0; i < arr.length; i++) {
        arr[i] = newArr[i];
    }
    toTable(currentPage);
}

function flipTriangle(parameter) {
    for (let i = 0; i < triangle.length; i++) {
        if (triangle[i].count == 1 && i == parameter) {
            triangle[parameter].style.transform = "rotate(180deg)";
            triangle[i].count *= -1;
        } else if (triangle[i].count == -1 && i != parameter) {
            triangle[i].style.transform = "none";
            triangle[i].count *= -1;
        }
    }
}

function click()  {
    mainTbody.addEventListener("click", (event) => {
        let textarea = document.getElementById("input");
        let target = event.target;
        columnEdit = target.id;
        rowEdit = target.parentNode.rowIndex;
        textarea.value = arr[10 * currentPage + rowEdit - 1].get(columnEdit);
    })
}
function edit() {
    let textarea = document.getElementById("input");
    arr[10 * currentPage + rowEdit - 1].set(columnEdit, textarea.value);
    textarea.value = '';
    toTable(currentPage);
}

nextPage.onclick = function () {
    if (currentPage < 3) {
        currentPage++;
        toTable(currentPage);
        previousPage.style.display = "block";
    } else if (currentPage == 3) {
        currentPage++;
        toTable(currentPage);
        nextPage.style.display = "none";
    }
}
previousPage.onclick = function () {
    if (currentPage > 1) {
        currentPage--;
        toTable(currentPage);
        nextPage.style.display = "block";
    } else if (currentPage == 1) {
        currentPage--;
        toTable(currentPage);
        previousPage.style.display = "none";
    }
}
function hideColumn(parameter) {
    switch (parameter) {
        case 0:
            showFirstNameColumn = !showFirstNameColumn;
            if (!showFirstNameColumn) {
                document.getElementById('#headerFirstName').style.display = "none";
            } else {
                document.getElementById('#headerFirstName').style.display = "table-cell";
            }
            break;
        case 1:
            showLastNameColumn = !showLastNameColumn;
            if (!showLastNameColumn) {
                document.getElementById('#headerLastName').style.display = "none";
            } else {
                document.getElementById('#headerLastName').style.display = "table-cell";
            }
            break;
        case 2:
            showAboutColumn = !showAboutColumn;
            if (!showAboutColumn) {
                document.getElementById('#headerAbout').style.display = "none";
            } else {
                document.getElementById('#headerAbout').style.display = "table-cell";
            }
            break;
        case 3:
            showEyeColorColumn = !showEyeColorColumn;
            if (!showEyeColorColumn) {
                document.getElementById('#headerEyeColor').style.display = "none";
            } else {
                document.getElementById('#headerEyeColor').style.display = "table-cell";
            }
            break;
    }
    toTable(currentPage);
}