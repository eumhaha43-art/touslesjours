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

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // translate-track slider with drag navigation + 5s autoplay
  // used by both the main visual and the event section
  function initDragSlider(options) {
    var swiper = document.getElementById(options.swiperId);
    var track = document.getElementById(options.trackId);
    var dotsWrap = document.getElementById(options.dotsId);
    if (!swiper || !track || !dotsWrap) {
      return;
    }

    var slides = Array.prototype.slice.call(track.querySelectorAll(options.slideSelector));
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
      var dot = createDot(index, options.label, index === currentIndex);
      dot.addEventListener("click", function () {
        handleGoToSlide(index);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    var autoplayTimerId = null;
    var isPointerDown = false;
    var hasDraggedPastThreshold = false;
    var startX = 0;
    var swiperWidth = 0;

    function applyTrackPosition() {
      track.style.transform = "translateX(" + -currentIndex * 100 + "%)";
    }

    function handleGoToSlide(nextIndex) {
      if (nextIndex < 0) {
        nextIndex = slides.length - 1;
      } else if (nextIndex >= slides.length) {
        nextIndex = 0;
      }

      slides[currentIndex].classList.remove("is_active");
      dots[currentIndex].classList.remove("is_active");
      dots[currentIndex].setAttribute("aria-selected", "false");

      currentIndex = nextIndex;

      slides[currentIndex].classList.add("is_active");
      dots[currentIndex].classList.add("is_active");
      dots[currentIndex].setAttribute("aria-selected", "true");

      applyTrackPosition();
    }

    function startAutoplay() {
      if (prefersReducedMotion()) {
        return;
      }
      stopAutoplay();
      autoplayTimerId = window.setInterval(function () {
        handleGoToSlide(currentIndex + 1);
      }, 2000);
    }

    function stopAutoplay() {
      if (autoplayTimerId) {
        window.clearInterval(autoplayTimerId);
        autoplayTimerId = null;
      }
    }

    function handlePointerDown(e) {
      isPointerDown = true;
      hasDraggedPastThreshold = false;
      startX = e.clientX;
      swiperWidth = swiper.getBoundingClientRect().width;
      track.classList.add("is_dragging");
      track.setPointerCapture(e.pointerId);
      stopAutoplay();
    }

    function handlePointerMove(e) {
      if (!isPointerDown) {
        return;
      }
      var deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > 5) {
        hasDraggedPastThreshold = true;
      }
      var basePercent = -currentIndex * 100;
      var dragPercent = swiperWidth ? (deltaX / swiperWidth) * 100 : 0;
      track.style.transform = "translateX(" + (basePercent + dragPercent) + "%)";
    }

    function handlePointerUp(e) {
      if (!isPointerDown) {
        return;
      }
      isPointerDown = false;
      track.classList.remove("is_dragging");

      var deltaX = e.clientX - startX;
      var threshold = swiperWidth * 0.15;

      if (deltaX <= -threshold) {
        handleGoToSlide(currentIndex + 1);
      } else if (deltaX >= threshold) {
        handleGoToSlide(currentIndex - 1);
      } else {
        applyTrackPosition();
      }
      startAutoplay();
    }

    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", handlePointerUp);
    track.addEventListener("pointercancel", handlePointerUp);

    track.addEventListener(
      "click",
      function (e) {
        if (hasDraggedPastThreshold) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    swiper.addEventListener("mouseenter", stopAutoplay);
    swiper.addEventListener("mouseleave", startAutoplay);

    applyTrackPosition();
    startAutoplay();
  }

  function handleGnbToggleClick() {
    var nav = document.getElementById("gnb_nav");
    if (!nav) {
      return;
    }

    var toggleButtons = ["gnb_toggle", "gnb_menu_toggle"]
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(function (btn) {
        return !!btn;
      });

    if (toggleButtons.length === 0) {
      return;
    }

    function handleToggleClick() {
      var isOpen = nav.classList.toggle("is_open");
      toggleButtons.forEach(function (btn) {
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    toggleButtons.forEach(function (btn) {
      btn.addEventListener("click", handleToggleClick);
    });
  }

  // menu carousel: nearest-to-center card gets enlarged via .is_center
  function updateCenterCard(track) {
    if (!track || track.hidden) {
      return;
    }
    var cards = Array.prototype.slice
      .call(track.querySelectorAll(".product_card"))
      .filter(function (card) {
        return !card.hidden;
      });
    if (cards.length === 0) {
      return;
    }

    var trackRect = track.getBoundingClientRect();
    var trackCenter = trackRect.left + trackRect.width / 2;
    var closestCard = null;
    var closestDistance = Infinity;

    cards.forEach(function (card) {
      var cardRect = card.getBoundingClientRect();
      var cardCenter = cardRect.left + cardRect.width / 2;
      var distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    cards.forEach(function (card) {
      card.classList.toggle("is_center", card === closestCard);
    });
  }

  function initDragScroll(track) {
    var isPointerDown = false;
    var hasDraggedPastThreshold = false;
    var startX = 0;
    var startScrollLeft = 0;

    function handlePointerDown(e) {
      isPointerDown = true;
      hasDraggedPastThreshold = false;
      startX = e.clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add("is_dragging");
      track.setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e) {
      if (!isPointerDown) {
        return;
      }
      var deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > 3) {
        hasDraggedPastThreshold = true;
      }
      track.scrollLeft = startScrollLeft - deltaX;
    }

    function handlePointerUp() {
      if (!isPointerDown) {
        return;
      }
      isPointerDown = false;
      track.classList.remove("is_dragging");
    }

    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", handlePointerUp);
    track.addEventListener("pointercancel", handlePointerUp);
    track.addEventListener("pointerleave", handlePointerUp);

    track.addEventListener(
      "click",
      function (e) {
        if (hasDraggedPastThreshold) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    track.addEventListener("scroll", function () {
      window.requestAnimationFrame(function () {
        updateCenterCard(track);
      });
    });
  }

  function handleMenuCarouselStep(direction) {
    var track = document.querySelector(".product_track:not([hidden])");
    if (!track) {
      return;
    }
    var visibleCard = track.querySelector(".product_card:not([hidden])");
    var cardWidth = visibleCard ? visibleCard.getBoundingClientRect().width + 20 : 300;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  }

  function initInfiniteMenuTrack(track) {
    var originalCards = Array.prototype.slice.call(track.querySelectorAll(".product_card"));
    if (originalCards.length === 0 || track.dataset.isInfinite === "true") {
      return;
    }

    var beforeFragment = document.createDocumentFragment();
    var afterFragment = document.createDocumentFragment();

    originalCards.forEach(function (card, index) {
      var beforeClone = card.cloneNode(true);
      var afterClone = card.cloneNode(true);

      [beforeClone, afterClone].forEach(function (clone) {
        clone.classList.add("is_clone");
        clone.setAttribute("aria-hidden", "true");
        Array.prototype.slice.call(clone.querySelectorAll("button, a")).forEach(function (control) {
          control.setAttribute("tabindex", "-1");
        });
      });

      if (index === 0) {
        card.dataset.carouselStart = "true";
        afterClone.dataset.carouselCloneStart = "true";
      }

      beforeFragment.appendChild(beforeClone);
      afterFragment.appendChild(afterClone);
    });

    track.insertBefore(beforeFragment, originalCards[0]);
    track.appendChild(afterFragment);
    track.dataset.isInfinite = "true";

    function getLoopPositions() {
      var originalStartCard = track.querySelector('[data-carousel-start="true"]');
      var cloneStartCard = track.querySelector('[data-carousel-clone-start="true"]');
      return {
        originalStart: originalStartCard ? originalStartCard.offsetLeft : 0,
        cloneStart: cloneStartCard ? cloneStartCard.offsetLeft : 0,
      };
    }

    function moveToOriginalSet() {
      if (track.hidden) {
        return;
      }
      track.scrollLeft = getLoopPositions().originalStart;
      updateCenterCard(track);
    }

    function normalizeLoopPosition() {
      var positions = getLoopPositions();
      var loopWidth = positions.cloneStart - positions.originalStart;
      if (loopWidth <= 0) {
        return;
      }

      if (track.scrollLeft >= positions.cloneStart - 2) {
        track.scrollLeft -= loopWidth;
      } else if (track.scrollLeft < positions.originalStart - 2) {
        track.scrollLeft += loopWidth;
      }
      updateCenterCard(track);
    }

    var scrollEndTimer = null;
    track.addEventListener("scroll", function () {
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(normalizeLoopPosition, 120);
    });

    track.moveToOriginalSet = moveToOriginalSet;
    window.requestAnimationFrame(moveToOriginalSet);
  }

  function initMenuCarousel() {
    var tracks = Array.prototype.slice.call(document.querySelectorAll(".product_track"));
    tracks.forEach(function (track) {
      initInfiniteMenuTrack(track);
      initDragScroll(track);
      updateCenterCard(track);
    });

    var prevBtn = document.getElementById("menu_prev");
    var nextBtn = document.getElementById("menu_next");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        handleMenuCarouselStep(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        handleMenuCarouselStep(1);
      });
    }

    window.addEventListener("resize", function () {
      tracks.forEach(function (track) {
        if (typeof track.moveToOriginalSet === "function") {
          track.moveToOriginalSet();
        }
        updateCenterCard(track);
      });
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

      if (typeof activePanel.moveToOriginalSet === "function") {
        activePanel.moveToOriginalSet();
      }
      updateCenterCard(activePanel);
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
        var bestProducts = Array.prototype.slice.call(panelBest.querySelectorAll(".product_card"));
        bestProducts.forEach(function (card) {
          card.hidden = !hasCategoryData;
        });
        emptyMessage.hidden = hasCategoryData;

        updateCenterCard(panelBest);
      });
    });
  }

  // sns event: arrow steps by one full page (1 card on mobile, 4 cards on tablet/desktop)
  function handleSnsCarouselStep(direction) {
    var list = document.getElementById("sns_list");
    if (!list) {
      return;
    }
    list.scrollBy({ left: direction * list.clientWidth, behavior: "smooth" });
  }

  function initSnsCarousel() {
    var prevBtn = document.getElementById("sns_prev");
    var nextBtn = document.getElementById("sns_next");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        handleSnsCarouselStep(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        handleSnsCarouselStep(1);
      });
    }
  }

  function handleFamilySiteToggle() {
    var toggleBtn = document.getElementById("family_site_toggle");
    var list = document.getElementById("family_site_list");
    if (!toggleBtn || !list) {
      return;
    }

    toggleBtn.addEventListener("click", function () {
      var isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      list.hidden = isExpanded;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    handleGnbToggleClick();
    initDragSlider({
      swiperId: "visual_swiper",
      trackId: "visual_track",
      slideSelector: ".visual_slide",
      dotsId: "visual_dots",
      label: "메인 비주얼 슬라이드",
    });
    initDragSlider({
      swiperId: "event_swiper",
      trackId: "event_track",
      slideSelector: ".event_slide",
      dotsId: "event_dots",
      label: "이벤트 슬라이드",
    });
    handleMenuTabs();
    handleCategoryTabs();
    initMenuCarousel();
    initSnsCarousel();
    handleFamilySiteToggle();
  });
})();
