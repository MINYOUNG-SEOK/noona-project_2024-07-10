const API_KEY = ``;
let newsList = [];

// 최신 뉴스를 가져오는 비동기 함수
const getLatestNews = async (category = "") => {
  try {
    const url = new URL(
      `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
    );
    const response = await fetch(url); // url로 부터 데이터를 fetch
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // JSON 형식으로 응답 데이터를 변환
    newsList = data.articles;
    render();
    console.log("News List", newsList);
  } catch (error) {
    console.error("Failed to fetch news:", error);
  }
};

// 기사를 화면에 렌더링하는 함수
const render = () => {
  // 각 기사를 HTML 문자열로 변환하여 배열에 저장
  const newsHTML = newsList
    .map((news) => {
      //  기사 HTML 템플릿
      return `<div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${
        news.urlToImage ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
      }" alt="${news.title}">
            </div>
                <div class="col-lg-6">
                    <h2>${news.title}</h2>
                    <p>${
        news.description == null || news.description == ""
          ? "내용없음"
          : news.description.length > 200
          ? news.description.substring(0, 200) + "..."
          : news.description
      }</p>
                     <div class="news-source">${
        news.source.name || "no source"
      } ${moment(news.publishedAt).fromNow()}</div>
                </div>
            </div>`;
    })
    .join(""); // 배열을 문자열로 변환하여 할당 // news-board 요소에 HTML 문자열을 삽입하여 기사를 화면에 표시

  document.getElementById("news-board").innerHTML = newsHTML;
};

// 카테고리 버튼 클릭 이벤트 핸들러 추가
const categoryButtons = document.querySelectorAll(".menus button");
categoryButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const category = event.target.dataset.category;
    getLatestNews(category);
  });
});

// 최신 뉴스를 가져오는 함수 호출
getLatestNews();
