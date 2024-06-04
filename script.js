const API_KEY = "b17f5b2b513c44ba9b3d921cf41be5fe";
const url = "https://newsapi.org/v2/everything?q=";

let currentPage = 1;
let totalResults = 0;
let currentQuery = "hello";
const pageSize = 10;
let curSelectedNav = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchNews(currentQuery);

    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", debounce(() => {
        const query = document.getElementById("search-text").value;
        if (query) {
            currentQuery = query;
            currentPage = 1;
            fetchNews(query);
            if (curSelectedNav) {
                curSelectedNav.classList.remove("active");
                curSelectedNav = null;
            }
        }
    }, 300));
});

function reload() {
    window.location.reload();
}

async function fetchNews(query, page = 1) {
    try {
        const response = await fetch(`${url}${query}&apiKey=${API_KEY}&pageSize=${pageSize}&page=${page}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        totalResults = data.totalResults;
        bindData(data.articles);
        updatePagination();
    } catch (error) {
        console.error("Fetch error: ", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.textContent = article.title;
    newsDesc.textContent = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.textContent = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function updatePagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalResults / pageSize);

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.classList.add("page-button");
    if (currentPage === 1) {
        prevButton.classList.add("disabled");
        prevButton.disabled = true;
    } else {
        prevButton.addEventListener("click", () => {
            currentPage--;
            fetchNews(currentQuery, currentPage);
        });
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("page-button");
    if (currentPage === totalPages) {
        nextButton.classList.add("disabled");
        nextButton.disabled = true;
    } else {
        nextButton.addEventListener("click", () => {
            currentPage++;
            fetchNews(currentQuery, currentPage);
        });
    }

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
}

function onNavItemClick(id) {
    currentQuery = id;
    currentPage = 1;
    fetchNews(id);

    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function toggleNav() {
    const mainNav = document.querySelector('.main-nav');
    mainNav.classList.toggle('collapsed');
}
