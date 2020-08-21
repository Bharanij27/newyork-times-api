let path = sessionStorage.getItem('currentSection') || 'HOME';

let link = [
    "HOME",
    "WORLD",
    "POLITICS",
    "MAGAZINE",
    "TECHNOLOGY",
    "SCIENCE",
    "HEALTH",
    "SPORTS",
    "ARTS",
    "FASHION",
    "FOOD",
    "TRAVEL",
];

function createNavBar() {

    let navBar = document.querySelector('.navbar-nav');

    link.forEach(section => {
        let list = document.createElement('li');
        list.classList.add('nav-item');
        list.setAttribute('id', section.toLowerCase());

        if (path == section) list.classList.add('selected');

        let name = document.createElement('a');
        name.classList.add('nav-link');
        name.innerText = section;

        list.append(name);

        list.addEventListener('click', function () {
            changeActive(list);
            loadContent(list.innerText.toLowerCase());
        }, true)

        navBar.append(list);
    });
}

function changeActive(selected) {
    let currentActive = document.querySelector('.selected');
    currentActive.className = 'nav-item';

    selected.classList.add('selected');
    path = selected.innerText;
    sessionStorage.setItem('currentSection', path);
}

async function loadContent(section) {
    try {
        let container = document.querySelector('.container');
        while (container.children.length != 2) container.removeChild(container.lastElementChild)
        let fetchedData = await fetch('https://api.nytimes.com/svc/topstories/v2/' + section + '.json?api-key=d7JHyx5L3ZK3Hha3nMlQQShN6HPGVenU');
        let data = await fetchedData.json();
        let news = data.results;

        let cnt = 1;
        news.forEach(content => {
            let card = createCard(content);
            container.append(card);
        });
    } catch (error) {
        console.error(error)
    }
}

function createCard(news) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    let card = document.createElement('div');
    card.classList.add('card', 'mb-3', 'border-card');

    let row = document.createElement('div');
    row.classList.add('row', 'no-gutters', 'const-height');

    let leftPart = document.createElement('div');
    leftPart.classList.add('col-md-8');

    let body = document.createElement('div');
    body.classList.add('card-body');

    let sectioncard = document.createElement('h5');
    sectioncard.classList.add('sectioncard');
    sectioncard.innerText = news.section.toUpperCase();

    let titlecard = createTag('p', 'titlecard', news.title);

    let byline = createTag('p', 'byline', news.byline);

    let createdDate = new Date(news.created_date)
    let dateText = createdDate.getDate() + ' ' +
        months[createdDate.getMonth()]

    let dateCard = createTag('p', 'dateCard', dateText);

    let abstractcard = createTag('p', 'abstractcard', news.abstract);

    let item_type = createTag('p', 'item_type', news.item_type);

    let continueRead = document.createElement('a');
    continueRead.setAttribute('href', news.short_url)
    continueRead.classList.add('continueReading');
    continueRead.innerText = 'Continue Reading';

    body.append(sectioncard, titlecard, item_type, byline, dateCard, abstractcard, continueRead);
    leftPart.append(body)

    let rightPart = document.createElement('div');
    rightPart.classList.add('col-md-4');

    let image = document.createElement('img');
    let url = (news.multimedia && news.multimedia[4] && news.multimedia[4].url) || '';

    image.setAttribute('src', url);
    image.classList.add('img-thumbnail', 'card-img', 'card-image-height')
    image.setAttribute('alt', 'news.png')

    rightPart.append(image);

    row.append(leftPart, rightPart)
    card.append(row);
    return card;
}

function createTag(tag, classes, text) {
    let content = document.createElement(tag);
    if(Array.isArray(classes)){
        while(classes.length){
            content.classList.add(classes[0]);
            classes.shift();
        }
    }
    else content.classList.add(classes);
    content.innerText = text;
    return content;
}

function createBody() {
    let container = createTag('div', 'container', '');

    let heading = createTag('div', ['heading', 'justify-content-center'], 'THE PERTINENT TIMES');

    let navBar = createTag('nav', ['navbar', 'navbar-expand-lg', 'navbar-light', 'margin-line', 'm-3'], '');

    let button = createTag('button', 'navbar-toggler', '');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'collapse');
    button.setAttribute('data-target', '#navbarSupportedContent');
    button.setAttribute('aria-controls', 'navbarSupportedContent');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Toggle navigation');

    let span = createTag('span', 'navbar-toggler-icon', '');

    button.append(span);

    let navContent = createTag('div', ['collapse', 'navbar-collapse', 'm-1', 'space-evenly'], '');
    navContent.setAttribute('id', 'navbarSupportedContent');

    let unorderList = createTag('ul', ['navbar-nav', 'm-1'], '');

    navContent.append(unorderList);

    navBar.append(button, navContent);

    container.append(heading, navBar);
    document.body.append(container);
}

(async function () {
    try {
        await createBody();
        sessionStorage.setItem('currentSection', path);
        await createNavBar();
        await loadContent(path.toLowerCase());
    } catch (error) {
        console.log(error)
    }
})();