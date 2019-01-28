$(document).ready(function() {
  var _body = $("body.home");
  var _window = $(window);
  var _pageHeader = $("div#main > header");
  var _articleHeader = $("article > header");
  var _sidebarMenu = $("aside#sidebar > nav");
  var _pageTitle = $("#main article header h2");
  var _mobileMenu = $("#main article header ul.mobile-nav");

  _body.on("click", function() {
    window.location.assign("/welcome");
  });

  $(".fancybox").fancybox({
    arrows: true,
    margin: [20, 60, 20, 60],
    helpers: {
      overlay: {
        locked: false
      }
    }
  });

  _checkSize();
  _window.on("resize", _checkSize);

  if (_sidebarMenu.length > 0 && _articleHeader.length > 0) {
    _window.on("scroll", _checkScroll);
  }

  function _checkScroll() {
    var scrolled = _window.scrollTop();
    console.log("scrolled");
    var headerHeight = parseInt(_pageHeader.height(), 10);
    if (scrolled > headerHeight) {
      _sidebarMenu.css({ marginTop: scrolled - headerHeight });
    } else {
      _sidebarMenu.css({ marginTop: 0 });
    }
  }

  function _checkSize() {
    if (_window.width() < 801) {
      _pageTitle.off("click");
      _pageTitle.on("click", _openMenu);
    } else {
      _pageTitle.off("click");
      _mobileMenu.hide();
    }

    function _openMenu() {
      _mobileMenu.slideToggle();
    }
  }
});
