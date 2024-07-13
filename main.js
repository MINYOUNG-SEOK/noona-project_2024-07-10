document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = ``; // 뉴스 API 키
  const placeholderImage = "https://via.placeholder.com/250?text=No+Image"; // 이미지가 없을 때 사용할 기본 이미지
  let totalResults = 0; // 전체 뉴스 기사 수
  let page = 1; // 현재 페이지
  let selectedCategory = ""; // 선택된 카테고리
  let selectedKeyword = ""; // 선택된 키워드
  const pageSize = 10; // 한 페이지당 뉴스 기사 수
  const groupSize = 5; // 페이지 그룹 크기

  // 최신 뉴스를 가져오는 비동기 함수
  const getLatestNews = async (
    category = selectedCategory,
    keyword = selectedKeyword,
    page = 1
  ) => {
    try {
      const url = new URL(
        "https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines"
      );
      url.searchParams.append("country", "kr");
      url.searchParams.append("apiKey", API_KEY);
      url.searchParams.append("page", page);
      url.searchParams.append("pageSize", pageSize);
      if (category) url.searchParams.append("category", category); // 카테고리가 선택된 경우 추가
      if (keyword) url.searchParams.append("q", keyword); // 키워드가 입력된 경우 추가

      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      totalResults = data.totalResults; // 전체 뉴스 기사 수 업데이트
      renderNews(data.articles); // 뉴스 기사 렌더링
      renderPagination(); // 페이지네이션 렌더링
    } catch (error) {
      console.error("Failed to fetch news:", error); // 오류 처리
    }
  };

  // 기사를 화면에 렌더링하는 함수
  const renderNews = (newsList) => {
    const newsHTML = newsList
      .map((news) => {
        const imageUrl = news.urlToImage || placeholderImage; // 이미지 URL이 없는 경우 기본 이미지 사용
        const altText = news.title || "뉴스 이미지"; // 이미지 대체 텍스트

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

    document.getElementById("news-board").innerHTML = newsHTML; // 뉴스 기사를 화면에 렌더링
  };

  // 페이지네이션을 렌더링하는 함수
  const renderPagination = () => {
    const totalPages = Math.ceil(totalResults / pageSize); // 전체 페이지 수
    const pageGroup = Math.ceil(page / groupSize); // 현재 페이지 그룹
    const lastPage = Math.min(pageGroup * groupSize, totalPages); // 페이지 그룹의 마지막 페이지
    const firstPage = Math.max(lastPage - (groupSize - 1), 1); // 페이지 그룹의 첫 번째 페이지
    let paginationHTML = "";

    if (page > 1) {
      paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${
        page - 1
      }">Previous</a></li>`; // 이전 페이지 버튼 추가
    }

    for (let i = firstPage; i <= lastPage; i++) {
      paginationHTML += `<li class="page-item ${
        i === page ? "active" : ""
      }"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`; // 페이지 번호 버튼 추가
    }

    if (page < totalPages) {
      paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${
        page + 1
      }">Next</a></li>`; // 다음 페이지 버튼 추가
    }

    document.querySelector(".pagination").innerHTML = paginationHTML; // 페이지네이션을 화면에 렌더링

    document.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault(); // 기본 동작 방지 (페이지 이동 방지)
        const selectedPage = parseInt(event.target.dataset.page);
        if (selectedPage !== page) {
          page = selectedPage;
          getLatestNews(selectedCategory, selectedKeyword, page); // 선택된 페이지로 뉴스 데이터 가져오기
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          }); // 페이지네이션 클릭 시 상단으로 이동
        }
      });
    });
  };

  // 카테고리 버튼 클릭 이벤트 핸들러 추가
  const handleCategoryClick = async (event) => {
    selectedCategory = event.target.dataset.category; // 선택된 카테고리를 설정
    selectedKeyword = ""; // 검색 키워드를 초기화
    page = 1;
    await getLatestNews(selectedCategory); // 선택된 카테고리로 뉴스 데이터 가져오기
    closeMenu();
  };

  // 검색 버튼 클릭 이벤트 핸들러 추가
  const handleSearch = async () => {
    selectedKeyword = document.getElementById("search-bar").value; // 선택된 키워드를 설정
    page = 1;
    await getLatestNews(selectedCategory, selectedKeyword); // 선택된 카테고리 및 키워드를 유지하며 검색
    document.getElementById("search-bar").value = ""; // 검색창 초기화
  };

  // 카테고리 버튼 클릭 이벤트 핸들러 추가
  document.querySelectorAll(".menus button").forEach((button) => {
    button.addEventListener("click", handleCategoryClick);
  });

  // 검색 버튼 클릭 이벤트 핸들러 추가
  document
    .getElementById("search-button")
    .addEventListener("click", handleSearch);

  // 검색 창에서 엔터 키 입력 이벤트 핸들러 추가
  document
    .getElementById("search-bar")
    .addEventListener("keyup", async (event) => {
      if (event.key === "Enter") {
        await handleSearch();
      }
    });

  // 페이지 로드 시 최신 뉴스 데이터를 가져오는 함수 호출
  getLatestNews();
});

// 메뉴 토글 함수
function toggleMenu() {
  document.querySelector(".side-menu").classList.toggle("active");
}

// 메뉴 닫기 함수
function closeMenu() {
  document.querySelector(".side-menu").classList.remove("active");
}

// 검색창 토글 함수
function toggleSearch() {
  document.getElementById("search-bar").classList.toggle("active");
  document.getElementById("search-button").classList.toggle("active");
}
