$(document).on("ready", function() {
	var _window = $(window);
	var _pageTitle = $("#main article header h2");
	var _menu = $("#main article header ul.mobile-nav");

	_checkSize();
	_window.on("resize", _checkSize);

	function _checkSize() {
		if(_window.width() < 801) {
			_pageTitle.off("click");
			_pageTitle.on("click", _openMenu);
		} else {
			_pageTitle.off("click");
			_menu.hide();
		}

		function _openMenu() {
			_menu.slideToggle();
		}
	}
});

