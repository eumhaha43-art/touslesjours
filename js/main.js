(function () {
  "use strict";

  function createDot(index, label, isActive) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", label + " " + (index + 1) + "번");
    dot.setAttribute("aria-selected", isActive ? "true" : "false");
    if (isActive) {
      dot.classList.add("is_active");
    }
    return dot;
  }

  function setupSlider(rootId, slideSelector, dotsId, label) {
    var root = document.getElementById(rootId);
    var dotsWrap = document.getElementById(dotsId);
    if (!root || !dotsWrap) {
      return;
    }

    var slides = Array.prototype.slice.call(root.querySelectorAll(slideSelector));
    if (slides.length === 0) {
      return;
    }

    var currentIndex = slides.findIndex(function (slide) {
      return slide.classList.contains("is_active");
    });
    if (currentIndex < 0) {
      currentIndex = 0;
    }

    var dots = slides.map(function (slide, index) {
      var dot = createDot(index, label, index === currentIndex);
      dot.addEventListener("click", function () {
        handleSlideChange(index);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function handleSlideChange(nextIndex) {
      slides[currentIndex].classList.remove("is_active");
      dots[currentIndex].classList.remove("is_active");
      dots[currentIndex].setAttribute("aria-selected", "false");

      currentIndex = nextIndex;

      slides[currentIndex].classList.add("is_active");
      dots[currentIndex].classList.add("is_active");
      dots[currentIndex].setAttribute("aria-selected", "true");
    }
  }

  function handleGnbToggleClick() {
    var toggleBtn = document.getElementById("gnb_toggle");
    var nav = document.getElementById("gnb_nav");
    if (!toggleBtn || !nav) {
      return;
    }

    toggleBtn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is_open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function handleMenuTabs() {
    var tabBest = document.getElementById("tab_best");
    var tabNew = document.getElementById("tab_new");
    var panelBest = document.getElementById("panel_best");
    var panelNew = document.getElementById("panel_new");

    if (!tabBest || !tabNew || !panelBest || !panelNew) {
      return;
    }

    function selectTab(activeTab, inactiveTab, activePanel, inactivePanel) {
      activeTab.classList.add("is_active");
      activeTab.setAttribute("aria-selected", "true");
      inactiveTab.classList.remove("is_active");
      inactiveTab.setAttribute("aria-selected", "false");

      activePanel.hidden = false;
      inactivePanel.hidden = true;
    }

    tabBest.addEventListener("click", function () {
      selectTab(tabBest, tabNew, panelBest, panelNew);
    });

    tabNew.addEventListener("click", function () {
      selectTab(tabNew, tabBest, panelNew, panelBest);
    });
  }

  function handleCategoryTabs() {
    var categoryTabs = Array.prototype.slice.call(document.querySelectorAll(".category_tab"));
    var panelBest = document.getElementById("panel_best");
    if (categoryTabs.length === 0 || !panelBest) {
      return;
    }

    var bestProducts = Array.prototype.slice.call(panelBest.querySelectorAll(".product_card"));
    var emptyMessage = document.createElement("p");
    emptyMessage.className = "product_empty";
    emptyMessage.hidden = true;
    emptyMessage.textContent = "준비 중입니다. 해당 카테고리 제품은 곧 만나보실 수 있어요.";
    panelBest.appendChild(emptyMessage);

    categoryTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        categoryTabs.forEach(function (otherTab) {
          otherTab.classList.remove("is_active");
        });
        tab.classList.add("is_active");

        var hasCategoryData = tab.dataset.category === "bread";
        bestProducts.forEach(function (card) {
          card.hidden = !hasCategoryData;
        });
        emptyMessage.hidden = hasCategoryData;
      });
    });
  }

  function handleCarouselScroll(prevId, nextId, trackSelector) {
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    var track = document.querySelector(trackSelector);
    if (!prevBtn || !nextBtn || !track) {
      return;
    }

    function scrollByCard(direction) {
      var card = track.querySelector(":scope > *");
      var cardWidth = card ? card.getBoundingClientRect().width + 20 : 300;
      track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }

    prevBtn.addEventListener("click", function () {
      scrollByCard(-1);
    });

    nextBtn.addEventListener("click", function () {
      scrollByCard(1);
    });
  }

  function handleFamilySiteToggle() {
    var toggleBtn = document.getElementById("family_site_toggle");
    if (!toggleBtn) {
      return;
    }

    toggleBtn.addEventListener("click", function () {
      var isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    handleGnbToggleClick();
    setupSlider("visual_swiper", ".visual_slide", "visual_dots", "메인 비주얼 슬라이드");
    setupSlider("event_swiper", ".event_slide", "event_dots", "이벤트 슬라이드");
    handleMenuTabs();
    handleCategoryTabs();
    handleCarouselScroll("menu_prev", "menu_next", "#panel_best");
    handleCarouselScroll("sns_prev", "sns_next", "#sns_list");
    handleFamilySiteToggle();
  });
})();
