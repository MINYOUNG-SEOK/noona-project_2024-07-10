document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = ``;
  const placeholderImage = "https://via.placeholder.com/250?text=No+Image";

  // 최신 뉴스를 가져오는 비동기 함수
  const getLatestNews = async (category = "", keyword = "") => {
    let newsList = [];
    try {
      const url = keyword
        ? `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
        : `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      newsList = data.articles;
      render(newsList);
      console.log("News List", newsList);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  };

  // 기사를 화면에 렌더링하는 함수
  const render = (newsList) => {
    const newsHTML = newsList
      .map((news) => {
        const imageUrl = news.urlToImage || placeholderImage;
        const altText = news.title || "뉴스 이미지";

        return `<div class="row news">
                  <div class="col-lg-4">
                      <img class="news-img-size" src="${imageUrl}" alt="${altText}" onerror="this.onerror=null;this.src='${placeholderImage}';">
                  </div>
                  <div class="col-lg-8">
                      <h2>${news.title}</h2>
                      <p>${
                        news.description
                          ? news.description.length > 200
                            ? news.description.substring(0, 200) + "..."
                            : news.description
                          : "내용없음"
                      }</p>
                      <div class="news-source">${
                        news.source.name || "no source"
                      } ${moment(news.publishedAt).fromNow()}</div>
                  </div>
              </div>`;
      })
      .join("");

    document.getElementById("news-board").innerHTML = newsHTML;
  };

  // 카테고리 버튼 클릭 이벤트 핸들러 추가
  const categoryButtons = document.querySelectorAll(".menus button");
  categoryButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const category = event.target.dataset.category;
      getLatestNews(category);
      closeMenu();
    });
  });

  // 검색 버튼 클릭 이벤트 핸들러 추가
  document.getElementById("search-button").addEventListener("click", () => {
    const keyword = document.getElementById("search-bar").value;
    getLatestNews("", keyword).then(() => {
      document.getElementById("search-bar").value = "";
    });
  });

  // 엔터 키 입력 이벤트 핸들러 추가
  document.getElementById("search-bar").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const keyword = event.target.value;
      getLatestNews("", keyword).then(() => {
        event.target.value = "";
      });
    }
  });

  // 최신 뉴스를 가져오는 함수 호출
  getLatestNews();
});

function toggleMenu() {
  const sideMenu = document.querySelector(".side-menu");
  sideMenu.classList.toggle("active");
}

function closeMenu() {
  const sideMenu = document.querySelector(".side-menu");
  sideMenu.classList.remove("active");
}

function toggleSearch() {
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.getElementById("search-button");
  searchBar.classList.toggle("active");
  searchButton.classList.toggle("active");
}
