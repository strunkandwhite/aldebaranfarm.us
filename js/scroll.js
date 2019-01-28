$(document).on("ready", function() {
	var _window = $(window);
	var _pageHeader = $("div#main > header");
	var _articleHeader = $("article > header");
	var _menu = $("aside#sidebar > nav");

	if(_menu.length > 0 && _articleHeader.length > 0) {
		_window.on("scroll", _checkScroll);
	}

	function _checkScroll() {
		var scrolled = _window.scrollTop();
		var headerHeight = parseInt(_pageHeader.height(), 10);
		if(scrolled > headerHeight) {
			_menu.css({marginTop: scrolled - headerHeight});
		} else {
			_menu.css({marginTop: 0});
		}
	}
});

