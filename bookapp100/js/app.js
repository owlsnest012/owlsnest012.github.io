/**
 * ==================================================
 * 100 Books App
 * app.js
 * ==================================================
 *
 * books.js
 *   → booksData
 *
 * lists.js
 *   → listsData
 *
 * 本の情報：
 *   booksData で一元管理
 *
 * リスト：
 *   listsData.books に
 *   { bookId, number } を持つ
 *
 * --------------------------------------------------
 *
 * 本棚表示について
 *
 * bookshelf は左右に2つ描画する。
 *
 * 左：
 *   .left-window .bookshelf
 *
 * 右：
 *   .right-window .bookshelf
 *
 * 同じ本棚データを左右両方に描画し、
 * CSSのwindowで見える部分を分ける。
 *
 * ==================================================
 */


/* ==================================================
   1. DATA
   ================================================== */

   const booksData = window.booksData;
   const listsData = window.listsData;
   
   
   /* ==================================================
      2. DOM
      ================================================== */
   
   const listSelect =
     document.getElementById("list-select");
   
   const clearBtn =
     document.getElementById("clear-btn");
   
   const themeMenuBtn =
     document.getElementById("theme-menu-btn");
   
   const themeDropdown =
     document.getElementById("theme-dropdown");
   
   const themeDefaultBtn =
     document.getElementById("theme-default");
   
   const themeBlueBtn =
     document.getElementById("theme-blue");
   
   const themeGreenBtn =
     document.getElementById("theme-green");

   const languageBtn =
     document.getElementById("language-btn");
   
   const sortMenuBtn =
     document.getElementById("sort-menu-btn");
   
   const sortDropdown =
     document.getElementById("sort-dropdown");
   
   const sortListOrderBtn =
     document.getElementById("sort-list-order");
   
   const sortAlphabetBtn =
     document.getElementById("sort-alphabet");
   
   const sortStatusBtn =
     document.getElementById("sort-status");
   
   const sortRandomBtn =
     document.getElementById("sort-random");
   
   const modeBtn =
     document.getElementById("mode-btn");
   
   const mainContainer =
     document.getElementById("main-container");
   
   
   /*
    * 本棚は2つ存在する。
    */
   
   const bookshelves =
     document.querySelectorAll(".bookshelf");
   
   
   const detailPanel =
     document.getElementById("detail-panel");
   
   const detailBookIcon =
     document.getElementById("detail-book-icon");
   
   const detailBookTitle =
     document.getElementById("detail-book-title");
   
   const ratingStars =
     document.querySelectorAll(".rating-star");
   
   const detailTitle =
     document.getElementById("detail-title");
   
   const detailAuthor =
     document.getElementById("detail-author");
   
   const detailMemo =
     document.getElementById("detail-memo");

   const listPanelBtn =
     document.getElementById("list-panel-btn");

   const listPanel =
     document.getElementById("list-panel");
   
   const readCount =
     document.getElementById("read-count");
   
   
   /* ==================================================
      3. APP STATE
      ================================================== */
   
   let currentListId = null;
   
   let selectedBookId = null;
   
   
   /*
    * 現在の本棚の表示順。
    *
    * Default：
    *   listsData の number 順
    *
    * ソート後：
    *   この配列だけを変更する。
    *
    * listsData 自体は変更しない。
    */
   
   let currentBookIds = [];
   
   
   /*
    * 現在の言語。
    *
    * JP：
    *   titleJP / authorJP
    *
    * EN：
    *   titleEN / authorEN
    */
   
   let currentLanguage = "JP";
   
   
   /*
    * 現在のソート状態。
    *
    * listOrder
    * alphabet
    * status
    * random
    */
   
   let currentSort = "listOrder";
   
   
   /*
    * 操作モードかどうか
    */
   
   let isEditMode = false;

   
/* ==================================================
   4a. BOOK USER DATA
   ================================================== */

   let bookUserData = {};


   /*
    * LocalStorageからユーザー情報を読み込む。
    *
    * bookUserDataが存在しない場合は、
    * booksDataの初期値から全冊分を作成する。
    */
   function loadBookUserData() {
   
     const savedData =
       localStorage.getItem("bookUserData");
   
     /*
      * すでに保存データがある場合
      */
     if (savedData) {
   
       try {
   
         bookUserData =
           JSON.parse(savedData);
   
         return;
   
       } catch (error) {
   
         console.error(
           "bookUserDataの読み込みに失敗しました。",
           error
         );
   
       }
   
     }
   
   
     /*
      * LocalStorageにデータがない場合
      *
      * books.jsの初期値から
      * 全冊分のユーザー情報を作る。
      */
     booksData.forEach(book => {
   
       bookUserData[book.id] = {
         status: book.status,
         rating: book.rating,
         memo: book.memo
       };
   
     });
   
   
     saveBookUserData();
   }
   
   
   /*
    * bookUserDataをLocalStorageへ保存する。
    */
   function saveBookUserData() {
   
     localStorage.setItem(
       "bookUserData",
       JSON.stringify(bookUserData)
     );
   
   }
   
   
   /*
    * 指定した本のユーザー情報を取得する。
    */
   function getBookUserData(bookId) {
   
     return bookUserData[bookId];
   
   }

  /* ==================================================
   4b. THEME
   ================================================== */

let currentTheme = "default";


/*
 * LocalStorageからテーマを読み込む。
 */
function loadTheme() {

  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme) {
    currentTheme = savedTheme;
  }

  setTheme(currentTheme);
}


/*
 * テーマをLocalStorageへ保存する。
 */
function saveTheme() {

  localStorage.setItem(
    "theme",
    currentTheme
  );

} 

   /* ==================================================
      4c. INITIALIZE
      ================================================== */
   
   function init() {
   
     /*
      * データが存在するか確認
      */
   
     if (!Array.isArray(booksData)) {
       console.error("booksData が読み込まれていません。");
       return;
     }
   
     if (!Array.isArray(listsData)) {
       console.error("listsData が読み込まれていません。");
       return;
     }
   
      /*
      * ユーザー情報を読み込む
      */

      loadBookUserData();
      loadTheme();
  
     /*
      * 最初のリストを選択
      */
   
     if (listsData.length > 0) {
       currentListId =
         listsData[0].id;
     }
   
   
     /*
      * リスト選択肢
      */
   
     renderListSelect();
   
   
     /*
      * 本棚
      */
   
     renderBookshelves();
   
   
     /*
      * 読破数
      */
   
     updateReadCount();

     /*
      * 選択中の言語
      */
   
     updateLanguageButton();   
   
     /*
      * イベント
      */
   
     setupEvents();
   }
   
   
   /* ==================================================
      5. LIST
      ================================================== */
   
   function renderListSelect() {
   
     listSelect.innerHTML = "";
   
   
     listsData.forEach(list => {
   
       const option =
         document.createElement("option");
   
       option.value =
         list.id;
   
   
       /*
        * 言語に応じて
        * リスト名を切り替える。
        */
   
       option.textContent =
         currentLanguage === "JP"
           ? list.nameJP
           : list.nameEN;
   
   
       listSelect.appendChild(option);
     });
   
   
     listSelect.value =
       currentListId;
   }
   
   
   /* ==================================================
      6. CURRENT LIST
      ================================================== */
   
   function getCurrentList() {
   
     return listsData.find(
       list =>
         list.id === currentListId
     );
   }
   
   
   /* ==================================================
      7. CURRENT LIST BOOKS
      ================================================== */
   
   /*
    * 現在のリストに登録されている
    * 本の情報を取得。
    *
    * 例：
    *
    * [
    *   { bookId: 1, number: 1 },
    *   { bookId: 2, number: 2 }
    * ]
    */
   
   function getCurrentListBooks() {
   
     const currentList =
       getCurrentList();
   
     if (!currentList) {
       return [];
     }
   
     return currentList.books || [];
   }
   
   
   /* ==================================================
      8. DEFAULT BOOK ORDER
      ================================================== */
   
   /*
    * リストの number 順に
    * bookIdだけを取り出す。
    */
   
   function getListOrderBookIds() {
   
     const listBooks =
       getCurrentListBooks();
   
   
     return [...listBooks]
       .sort(
         (a, b) =>
           a.number - b.number
       )
       .map(
         item =>
           item.bookId
       );
   }
   
   
   /* ==================================================
      9. BOOK
      ================================================== */
   
   function getBook(bookId) {
   
     return booksData.find(
       book =>
         book.id === bookId
     );
   }
   
   
   /* ==================================================
      10. BOOK TITLE
      ================================================== */
   
   function getBookTitle(book) {
   
     if (currentLanguage === "JP") {
       return book.titleJP;
     }
   
     return book.titleEN;
   }
   
   
   /* ==================================================
      11. BOOK AUTHOR
      ================================================== */
   
   function getBookAuthor(book) {
   
     if (currentLanguage === "JP") {
       return book.authorJP;
     }
   
     return book.authorEN;
   }
   
   
   /* ==================================================
      12. RENDER BOOKSHELVES
      ================================================== */
   
   function renderBookshelves() {
   
     /*
      * 現在のリストの
      * Default順を取得。
      */
   
     const defaultBookIds =
       getListOrderBookIds();
   
   
     /*
      * 現在のソート状態に応じて
      * 表示順を決める。
      */
   
     if (currentSort === "listOrder") {
   
       currentBookIds =
         defaultBookIds;
   
     } else {
   
       /*
        * ソート処理は
        * Default順を基準にする。
        */
   
       currentBookIds =
         [...defaultBookIds];
   
   
       if (currentSort === "alphabet") {
         sortBookIdsAlphabetically();
       }
   
       if (currentSort === "status") {
         sortBookIdsByStatus();
       }
   
       if (currentSort === "random") {
         shuffleBookIds();
       }
     }
   
   
     /*
      * 左右両方に描画。
      */
   
     bookshelves.forEach(
       bookshelf => {
   
         renderBookshelf(
           bookshelf,
           currentBookIds
         );
       }
     );

     refitVisibleBookshelves();

   }
   
/* ==================================================
   BOOK TITLE SIZE
   ================================================== */


   function fitBookTitle(
    bookElement,
    titleElement
  ) {
  
    const baseSize = 11;
    const minSize = 8.5;
    const step = 0.5;
  
    /*
     * 再計測に備えて
     * 前回の2列設定をリセット
     */
    titleElement.classList.remove("multicolumn");
  
    titleElement.style.maxHeight = "";
    titleElement.style.maxWidth = "";
  
    /*
     * 本とタイトルの余白を取得
     */
    const bookStyle =
      getComputedStyle(bookElement);
  
    const titleStyle =
      getComputedStyle(titleElement);
  
    const availableHeight =
      bookElement.clientHeight
      - parseFloat(bookStyle.paddingTop)
      - parseFloat(bookStyle.paddingBottom)
      - parseFloat(titleStyle.marginTop)
      - parseFloat(titleStyle.marginBottom);
  
    /*
     * フォントを段階的に縮小
     */
    let fontSize = baseSize;
  
    titleElement.style.fontSize =
      `${fontSize}px`;
  
    while (
      titleElement.offsetHeight
        > availableHeight
      && fontSize > minSize
    ) {
  
      fontSize -= step;
  
      titleElement.style.fontSize =
        `${fontSize}px`;
    }
  
    /*
     * 最小サイズでも収まらない場合
     * 2列表示
     */
    if (
      titleElement.offsetHeight
        > availableHeight
    ) {
  
      titleElement.classList.add("multicolumn");
  
      titleElement.style.maxHeight =
        `${availableHeight}px`;
  
      titleElement.style.maxWidth =
        `${fontSize * 2.4}px`;
    }
  }
  

  /*
  * 表示されている本棚のタイトルを再計測
  */
  function refitVisibleBookshelves() {

    requestAnimationFrame(() => {

      bookshelves.forEach(bookshelf => {

        /*
        * 非表示の本棚はスキップ
        */
        if (
          bookshelf.getBoundingClientRect().height === 0
        ) {
          return;
        }

        const books =
          bookshelf.querySelectorAll(".book");

        books.forEach(bookElement => {

          const titleElement =
            bookElement.querySelector(".book-title");

          if (!titleElement) {
            return;
          }

          fitBookTitle(
            bookElement,
            titleElement
          );
        });
      });
    });
  }


   /* ==================================================
      13. RENDER ONE BOOKSHELF
      ================================================== */
   
   function renderBookshelf(
     bookshelf,
     bookIds
   ) {
   
     bookshelf.innerHTML = "";
   
   
     bookIds.forEach(bookId => {
   
       const book =
         getBook(bookId);
   
       if (!book) {
         return;
       }
   
   
       /*
        * 本要素
        */
   
       const bookElement =
         document.createElement("button");
   
       bookElement.type =
         "button";
   
   
       /*
        * status
        */
   
       const userData =
       getBookUserData(book.id);
     
       bookElement.className =
       `book ${userData.status}`;
   
        /*
        * タイトル
        */
        const titleElement =
          document.createElement("span");

        titleElement.className =
          "book-title";

        titleElement.textContent =
          getBookTitle(book);

        bookElement.appendChild(
          titleElement
        );   

        
       /*
        * book ID
        */
   
       bookElement.dataset.bookId =
         book.id;
   
   
       /*
        * 本の高さ
        *
        * length
        *
        * 1 = 短い
        * 5 = 長い
        */
   
       bookElement.style.height =
         `${130 + book.length * 10}px`;
   
   
       /*
        * 本をタップ
        */
   
       bookElement.addEventListener(
         "click",
         () => {
   
           if (!isEditMode) {
             return;
           }
   
           selectBook(book.id);
         }
       );
   
   
       bookshelf.appendChild(
        bookElement
      );
      
     });
   }
   
   
   /* ==================================================
      14. SELECT BOOK
      ================================================== */
   
   function selectBook(bookId) {
   
     const book =
       getBook(bookId);
   
     if (!book) {
       return;
     }
   
   
     selectedBookId =
       bookId;
   
   
     /*
      * 詳細パネル更新
      */
   
     updateDetailPanel(book);

     if (!listPanel.classList.contains("hidden")) {
       renderListPanel();
     }
   
   
     /*
      * 表示
      */
   
     showDetailPanel();
   }
   
   
   /* ==================================================
      15. DETAIL PANEL SHOW
      ================================================== */
   
   function showDetailPanel() {
   
     detailPanel.classList.remove(
       "hidden"
     );
   }
   
   
   /* ==================================================
      16. DETAIL PANEL HIDE
      ================================================== */
   
      function hideDetailPanel() {
        detailPanel.classList.add("hidden");
      }

      function clearSelectedBook() {
        selectedBookId = null;
      }

      /* DETAL PANEL RESET */ 
         
      function clearDetailPanel() {

        detailBookIcon.classList.remove(
          "unread",
          "read",
          "reading"
        );
      
        detailBookTitle.textContent = "";
        detailTitle.textContent = "";
        detailAuthor.textContent = "";
        detailMemo.value = "";
      
        updateRating(0);
      }

      function resetDetailPanel() {

        selectedBookId = null;
        clearDetailPanel();
      
      }
   
   /* ==================================================
      17. DETAIL PANEL UPDATE
      ================================================== */
   
   function updateDetailPanel(book) {
  
     const userData =
      getBookUserData(book.id);

      /*
      * 本アイコンの状態
      */
   
     detailBookIcon.classList.remove(
       "unread",
       "read",
       "reading"
     );
   
     detailBookIcon.classList.add(
       userData.status
     );
   
     /*
      * アイコン内タイトル
      */
   
     detailBookTitle.textContent =
       getBookTitle(book);
   
   
     /*
      * タイトル
      */
   
     detailTitle.textContent =
       getBookTitle(book);
   
   
     /*
      * 著者
      */
   
     detailAuthor.textContent =
       getBookAuthor(book);
   
   
     /*
      * 評価
      */
   
     updateRating(
       userData.rating
     );   
   
     /*
      * メモ
      */
   
     detailMemo.value =
       userData.memo || "";
   }
   
   
   /* ==================================================
      18. STATUS
      ================================================== */
   
   /*
    * 未読
    * ↓
    * 読書中
    * ↓
    * 既読
    * ↓
    * 未読
    */
   
   function toggleBookStatus() {
   
     if (selectedBookId === null) {
       return;
     }
   
   
     const book =
       getBook(selectedBookId);
     const userData =
       getBookUserData(selectedBookId);

     if (!book) {
       return;
     }
   
     if (userData.status === "unread") {

      userData.status =
        "read";
    
      } else if (
      userData.status === "read"
      ) {
    
      userData.status =
        "reading";
    
      } else {
    
      userData.status =
        "unread";
      }      

      saveBookUserData();

     /*
      * 詳細パネル
      */
   
     updateDetailPanel(book);
   
   
     /*
      * 本棚
      */
   
     updateBookshelfBooks(book);

     if (!listPanel.classList.contains("hidden")) {
       renderListPanel();
     }
   
   
     /*
      * 読破数
      */
   
     updateReadCount();
   }
   
   
   /* ==================================================
      19. UPDATE BOOKSHELVES
      ================================================== */
   
   function updateBookshelfBooks(book) {
   
     bookshelves.forEach(
       bookshelf => {
   
         const element =
           bookshelf.querySelector(
             `[data-book-id="${book.id}"]`
           );
   
         if (!element) {
           return;
         }
   
   
         element.classList.remove(
           "unread",
           "read",
           "reading"
         );

         const userData = getBookUserData(book.id);

          element.classList.add(
           userData.status
         );
       }
     );
   }
   
   
   /* ==================================================
      20. LIST PANEL
      ================================================== */

   function toggleListPanel() {

     if (!isEditMode === null) {
       return;
     }

     if (listPanel.classList.contains("hidden")) {
       renderListPanel();
       listPanel.classList.remove("hidden");
       listPanelBtn.textContent = "Close Panel";
     } else {
       closeListPanel();
     }
   }


   function closeListPanel() {
     listPanel.classList.add("hidden");
     listPanelBtn.textContent = "List Panel";
   }


   function renderListPanel() {

     listPanel.innerHTML = "";

     currentBookIds.forEach(bookId => {

       const book = getBook(bookId);
       if (!book) return;

       const userData = getBookUserData(book.id);

       const row = document.createElement("div");
       row.className = "list-panel-row";
       row.dataset.bookId = book.id;

       const statusButton = document.createElement("button");
       statusButton.type = "button";
       statusButton.className = `list-panel-status ${userData.status}`;
       statusButton.setAttribute("aria-label", "Reading status");
       statusButton.addEventListener("click", event => {
         event.stopPropagation();
         selectedBookId = book.id;
         toggleBookStatus();
       });
       row.appendChild(statusButton);

       const info = document.createElement("button");
       info.type = "button";
       info.className = "list-panel-book-info";

       const title = document.createElement("span");
       title.className = "list-panel-book-title";
       title.textContent = getBookTitle(book);

       const author = document.createElement("span");
       author.className = "list-panel-book-author";
       author.textContent = getBookAuthor(book);

       info.appendChild(title);
       info.appendChild(author);
       info.addEventListener("click", () => selectBook(book.id));
       row.appendChild(info);

       const rating = document.createElement("div");
       rating.className = "list-panel-rating";

       for (let i = 1; i <= 5; i++) {
         const star = document.createElement("button");
         star.type = "button";
         star.className = "list-panel-star";
         star.dataset.rating = i;
         star.textContent = "★";

         if (i <= userData.rating) {
           star.classList.add("active");
         }

         star.addEventListener("click", event => {
          event.stopPropagation();
          setRating(i, book.id);
        });

         rating.appendChild(star);
       }

       row.appendChild(rating);
       listPanel.appendChild(row);
     });
   }


   /* ==================================================
      21. RATING DISPLAY
      ================================================== */
   
   function updateRating(rating) {
   
     ratingStars.forEach(star => {
   
       const starRating =
         Number(
           star.dataset.rating
         );
   
   
       if (starRating <= rating) {
   
         star.classList.add(
           "active"
         );
   
       } else {
   
         star.classList.remove(
           "active"
         );
       }
     });
   }
   
   
   /* ==================================================
      21. RATING CHANGE
      ================================================== */
   
      function setRating(rating, bookId = selectedBookId) {

        if (bookId === null) {
          return;
        }
      
        const book = getBook(bookId);
      
        if (!book) {
          return;
        }

        const userData = getBookUserData(bookId);

        if (userData.rating === rating) {
          userData.rating = 0;
        } else {
          userData.rating = rating;
        }
      
        saveBookUserData();

        // Detail Panelの表示は、
        // 現在選択中の本を変更した場合だけ更新
        if (bookId === selectedBookId) {
          updateRating(userData.rating);
        }
      
        if (!listPanel.classList.contains("hidden")) {
          renderListPanel();
        }
      }
   
   
   /* ==================================================
      24. MEMO
      ================================================== */
   
   function saveMemo() {
   
     if (selectedBookId === null) {
       return;
     }
   
   
     const book =
       getBook(selectedBookId);
   
     if (!book) {
       return;
     }

     const userData = getBookUserData(selectedBookId);
   
     userData.memo =
       detailMemo.value;

       saveBookUserData();
   }
   
   
   /* ==================================================
      23. READ COUNT
      ================================================== */
   
   function updateReadCount() {
   
     const currentList =
       getCurrentList();
   
     if (!currentList) {
       return;
     }
   
   
     const count =
       currentList.books
         .map(
           item =>
             getBook(item.bookId)
         )
         .filter(
          book => {
        
            if (!book) {
              return false;
            }
        
            const userData =
              getBookUserData(book.id);
        
            return userData.status === "read";
          }
        )
         .length;
   
   
     readCount.textContent =
       count;
   }
   
   
   /* ==================================================
      24. MODE
      ================================================== */
   
   function toggleMode() {
   
     isEditMode =
       !isEditMode;
   
   
     if (isEditMode) {
   
       /*
        * 閲覧
        * ↓
        * 操作
        */
   
       mainContainer.classList.remove(
         "view-mode"
       );
   
       mainContainer.classList.add(
         "edit-mode"
       );
   
      } else {

        mainContainer.classList.remove(
          "edit-mode"
        );
      
        mainContainer.classList.add(
          "view-mode"
        );
      
        resetDetailPanel();
        hideDetailPanel();
        closeListPanel();
      }

     refitVisibleBookshelves();
     
   }
   
   
   /* ==================================================
      25. SORT : DEFAULT
      ================================================== */
   
   function sortByListOrder() {
   
     currentSort =
       "listOrder";
   
     currentBookIds =
       getListOrderBookIds();
   
     renderSortedBookshelves();
   }
   
   
   /* ==================================================
      26. SORT : A → Z
      ================================================== */
   
   function sortAlphabetically() {
   
     currentSort =
       "alphabet";
   
   
     currentBookIds =
       getListOrderBookIds();
   
   
     sortBookIdsAlphabetically();
   
   
     renderSortedBookshelves();
   }
   
   
   /*
    * 実際のアルファベット順処理。
    */
   
   function sortBookIdsAlphabetically() {
   
     currentBookIds.sort(
       (a, b) => {
   
         const bookA =
           getBook(a);
   
         const bookB =
           getBook(b);
   
         if (!bookA || !bookB) {
           return 0;
         }
   
   
         /*
          * JPでは読み仮名、
          * ENでは英語タイトル。
          */
   
         if (currentLanguage === "JP") {
   
           return (
             bookA.titleReading || ""
           ).localeCompare(
             bookB.titleReading || "",
             "ja"
           );
   
         } else {
   
           return (
             bookA.titleEN || ""
           ).localeCompare(
             bookB.titleEN || "",
             "en"
           );
         }
       }
     );
   }
   
   
   /* ==================================================
      27. SORT : READ
      ================================================== */
   
   function sortByStatus() {
   
     currentSort =
       "status";
   
   
     currentBookIds =
       getListOrderBookIds();
   
   
     sortBookIdsByStatus();
   
   
     renderSortedBookshelves();
   }
   
   
   /*
    * 実際のステータス順処理。
    */
   
   function sortBookIdsByStatus() {
   
     const statusOrder = {
   
       read: 0,
   
       reading: 1,
   
       unread: 2
     };
   
   
     currentBookIds.sort(
       (a, b) => {
   
         const bookA =
           getBook(a);
   
         const bookB =
           getBook(b);
   
         if (!bookA || !bookB) {
           return 0;
         }
   
         const userDataA =
           getBookUserData(bookA.id);
       
         const userDataB =
           getBookUserData(bookB.id);
       
       return (
         statusOrder[userDataA.status] -
         statusOrder[userDataB.status]
       );
       }
     );
   }
   
   
   /* ==================================================
      28. SORT : RANDOM
      ================================================== */
   
   function sortRandom() {
   
     currentSort =
       "random";
   
   
     currentBookIds =
       getListOrderBookIds();
   
   
     shuffleBookIds();
   
   
     renderSortedBookshelves();
   }
   
   
   /*
    * Fisher-Yates shuffle
    */
   
   function shuffleBookIds() {
   
     for (
       let i = currentBookIds.length - 1;
       i > 0;
       i--
     ) {
       const j =
         Math.floor(
           Math.random() * (i + 1)
         );
   
       [
         currentBookIds[i],
         currentBookIds[j]
       ] =
       [
         currentBookIds[j],
         currentBookIds[i]
       ];
     }
   }
   
   
   /* ==================================================
      29. SORTED BOOKSHELF
      ================================================== */
   
   function renderSortedBookshelves() {
   
     bookshelves.forEach(
       bookshelf => {
         renderBookshelf(
           bookshelf,
           currentBookIds
         );
       }
     );

     refitVisibleBookshelves();

     if (!listPanel.classList.contains("hidden")) {
       renderListPanel();
     }

   }
   
   
   /* ==================================================
      30. CLEAR
      ================================================== */
   
   function clearBooks() {
   
     const confirmed =
       window.confirm(
         "読書状態・評価・メモをすべてリセットしますか？"
       );
   
     if (!confirmed) {
       return;
     }
   
   
     /*
      * 全冊リセット。
      *
      * booksDataを直接変更するので、
      * すべてのリストで共有される。
      */
   
     booksData.forEach(book => {

      bookUserData[book.id] = {
        status: "unread",
        rating: 0,
        memo: ""
      };
    
    });
    
    saveBookUserData();
   
   
     /*
      * Default順に戻す。
      */
   
     currentSort =
       "listOrder";
   
   
     /*
      * 本棚再描画。
      */
   
     renderBookshelves();
   
   
     /*
      * 選択中の本。
      */
   
     if (selectedBookId !== null) {
       const book =
         getBook(selectedBookId);
   
       if (book) {
         updateDetailPanel(book);
       }
     }
   
   
     /*
      * 読破数。
      */
   
     updateReadCount();

     if (!listPanel.classList.contains("hidden")) {
       renderListPanel();
     }
   }
   
   
   /* ==================================================
      31. LANGUAGE
      ================================================== */
   
   function toggleLanguage() {
   
     if (currentLanguage === "JP") {
       currentLanguage =
         "EN";
   
     } else {
       currentLanguage =
         "JP";
     }
   
   
     /*
      * リスト名更新
      */
   
     renderListSelect();
   
   
     /*
      * 本棚更新
      */
   
     renderBookshelves();
   
   
     /*
      * 選択中の本
      */
   
     if (selectedBookId !== null) {
       const book =
         getBook(selectedBookId);
   
       if (book) {
         updateDetailPanel(book);
       }
     }

     if (!listPanel.classList.contains("hidden")) {
       renderListPanel();
     }

     updateLanguageButton();

   }
 
   /* 選択中の言語　*/
   
   function updateLanguageButton() {

    languageBtn.innerHTML =
      currentLanguage === "JP"
        ? `<span class="language-active">JP</span> / EN`
        : `JP / <span class="language-active">EN</span>`;
   }

   
   /* ==================================================
      32. THEME
      ================================================== */

      function setTheme(theme) {

        currentTheme = theme;
      
        document.documentElement.dataset.theme =
          theme;
      
        saveTheme();
      
      }
   
   
   /* ==================================================
      33. EVENTS
      ================================================== */
   
   function setupEvents() {
   
   
     /* --------------------------------------------------
        リスト変更
        -------------------------------------------------- */
   
     listSelect.addEventListener(
       "change",
       () => {
         currentListId =
           listSelect.value;
   
         /*
          * 新しいリストを選んだら
          * Default順に戻す。
          */
   
         currentSort =
           "listOrder";
   
         /*
          * 詳細ビューを閉じる。
          */

         resetDetailPanel();
         closeListPanel();
         
         if (!isEditMode) {
           hideDetailPanel();
         }   

         /*
          * 本棚更新。
          */
   
         renderBookshelves();
   
         /*
          * 読破数。
          */
   
         updateReadCount();
       }
     );
   
   
     /* --------------------------------------------------
        CLEAR
        -------------------------------------------------- */
   
     clearBtn.addEventListener(
       "click",
       clearBooks
     );
   
   
    /* --------------------------------------------------
      THEME MENU
      -------------------------------------------------- */

      themeMenuBtn.addEventListener(
        "click",
        event => {
          event.stopPropagation();
      
          themeDropdown.classList.toggle(
            "hidden"
          );
        }
      );
      
      
      /* --------------------------------------------------
        ORANGE
        -------------------------------------------------- */
      
      themeDefaultBtn.addEventListener(
        "click",
        () => {
          setTheme("default");
      
          themeDropdown.classList.add(
            "hidden"
          );
        }
      );
      
      
      /* --------------------------------------------------
        BLUE
        -------------------------------------------------- */
      
      themeBlueBtn.addEventListener(
        "click",
        () => {
          setTheme("blue");
      
          themeDropdown.classList.add(
            "hidden"
          );
        }
      );
      
      
      /* --------------------------------------------------
        GREEN
        -------------------------------------------------- */
      
      themeGreenBtn.addEventListener(
        "click",
        () => {
          setTheme("green");
      
          themeDropdown.classList.add(
            "hidden"
          );
        }
      );


     /* --------------------------------------------------
        JP / EN
        -------------------------------------------------- */
   
     languageBtn.addEventListener(
       "click",
       toggleLanguage
     );
   
   
     /* --------------------------------------------------
        MODE
        -------------------------------------------------- */
   
     modeBtn.addEventListener(
       "click",
       toggleMode
     );


     /* --------------------------------------------------
        LIST PANEL
        -------------------------------------------------- */

     listPanelBtn.addEventListener(
       "click",
       toggleListPanel
     );
   
   
     /* --------------------------------------------------
        ステータス変更
        -------------------------------------------------- */
   
     detailBookIcon.addEventListener(
       "click",
       toggleBookStatus
     );
   
   
     /* --------------------------------------------------
        星評価
        -------------------------------------------------- */
   
     ratingStars.forEach(
       star => {
         star.addEventListener(
           "click",
           () => {
             const rating =
               Number(
                 star.dataset.rating
               );
             setRating(rating);
           }
         );
       }
     );
   
   
     /* --------------------------------------------------
        メモ
        -------------------------------------------------- */
   
     detailMemo.addEventListener(
       "input",
       saveMemo
     );
   
   
     /* --------------------------------------------------
        SORT MENU
        -------------------------------------------------- */
   
     sortMenuBtn.addEventListener(
       "click",
       event => {
         event.stopPropagation();
         sortDropdown.classList.toggle(
           "hidden"
         );
       }
     );
   
   
     /* --------------------------------------------------
        DEFAULT
        -------------------------------------------------- */
   
     sortListOrderBtn.addEventListener(
       "click",
       () => {
         sortByListOrder();
         sortDropdown.classList.add(
           "hidden"
         );
       }
     );
   
   
     /* --------------------------------------------------
        A → Z
        -------------------------------------------------- */
   
     sortAlphabetBtn.addEventListener(
       "click",
       () => {
         sortAlphabetically();
         sortDropdown.classList.add(
           "hidden"
         );
       }
     );
   
   
     /* --------------------------------------------------
        READ
        -------------------------------------------------- */
   
     sortStatusBtn.addEventListener(
       "click",
       () => {
         sortByStatus();
         sortDropdown.classList.add(
           "hidden"
         );
       }
     );
   
   
     /* --------------------------------------------------
        RANDOM
        -------------------------------------------------- */
   
     sortRandomBtn.addEventListener(
       "click",
       () => {
         sortRandom();
         sortDropdown.classList.add(
           "hidden"
         );
       }
     );
   
   
     /* --------------------------------------------------
        SORT MENU 外をタップ
        -------------------------------------------------- */
   
        document.addEventListener(
          "click",
          () => {
            sortDropdown.classList.add(
              "hidden"
            );
        
            themeDropdown.classList.add(
              "hidden"
            );
          }
        );
      } 
   
   /* ==================================================
      34. START
      ================================================== */
   
      function updateScale() {
        const app = document.getElementById("app");
        if (!app) return;
      
        const scaleX = window.innerWidth / 1440;
        const scaleY = window.innerHeight / 1018;
      
        const scale = Math.min(scaleX, scaleY);
      
        app.style.transform =
          `translate(-50%, -50%) scale(${scale})`;
      }
      
      
      // ウィンドウサイズ変更時
      window.addEventListener("resize", () => {
        updateScale();
        refitVisibleBookshelves();
      });
      
      
      // 初回表示時
      updateScale();
      init();
      
      
      // HTML・CSSなどの読み込み完了後に再調整
      window.addEventListener("load", () => {
        updateScale();
        refitVisibleBookshelves();
      });
      
      
      // ページが再表示された場合にも調整
      window.addEventListener("pageshow", () => {
        updateScale();
        refitVisibleBookshelves();
      });
