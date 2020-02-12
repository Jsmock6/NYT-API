const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; //1
const key = 'Mkv4cKW8j9Mh1VCEZRNxY2f2IstepDCI'; //2
let url; //3

//SEARCH FORM
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');


//RESULTS SECTION
const section = document.querySelector('section');
const nav = document.querySelector('nav');

nav.style.display = 'none';

let pageNumber = 0;
let displayNav = false;

//1                     //2   
searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage); //3
previousBtn.addEventListener('click', previousPage); //3

//1
function fetchResults(e) {
    e.preventDefault(); //1
    // Assemble the full URL
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value; //3
    //1
    if (startDate.value !== '') {
        url += '&begin_date=' + startDate.value;
    };

    if (endDate.value !== '') {
        url += '&end_date=' + endDate.value;
    };
    fetch(url).then(function (result) {
        return result.json(); //2
    }).then(function (json) {
        displayResults(json); //3
    });
}
function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild); //1

    }
    let articles = json.response.docs;

    if (articles.length === 10) {
        nav.style.display = 'block';
    } else {
        nav.style.display = 'none';
    }
    if (articles.length === 0) {
        let para = document.createElement('p');
        para.textContent = 'No results returned.'
    } else {
        for (let i = 0; i < articles.length; i++) {
            let article = document.createElement('article');
            let heading = document.createElement('h2');
            let link = document.createElement('a');
            let img = document.createElement('img');  //1
            let para1 = document.createElement('p');
            let para2 = document.createElement('p');
            let clearfix = document.createElement('div');

            let current = articles[i];
            console.log(current);

            link.href = current.web_url;
            link.textContent = current.headline.main;
            para1.textContent = current.snippet;
            para2.textContent = 'Keywords:';


            for (let j = 0; j < current.keywords.length; j++) {
                let span = document.createElement('span');
                span.textContent += current.keywords[j].value + ' ';
                para2.appendChild(span);
            }

            //2
            if (current.multimedia.length > 0) {
                //3
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
                //4
                img.alt = current.headline.main;
            }

            clearfix.setAttribute('class', 'clearfix');

            article.appendChild(heading);
            heading.appendChild(link);
            article.appendChild(img); //5
            article.appendChild(para1);
            article.appendChild(para2);
            article.appendChild(clearfix);
            section.appendChild(article);
        }
    }
};

function nextPage(e) {
    pageNumber++; //1
    fetchResults(e);  //2
    console.log("Page number:", pageNumber); //3
};

function previousPage(e) {
    if (pageNumber > 0) { //1
        pageNumber--; //2
    } else {
        return; //3
    }
    fetchResults(e); //4
    console.log("Page:", pageNumber); //5

};