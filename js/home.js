$(document).on("ready", function() {
	var _body = $("body.home");

	_body.on("click", function() {
		window.location.assign('/welcome');
	});
});

