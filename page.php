<?php

$page = $_GET['p'];

$allowed_pages = array("welcome", "history", "accommodations", "rates", "info", "photos");

$page_titles = array(
	"history" => "History",
	"accommodations" => "Accommodations",
	"rates" => "Rates & Reservations",
	"info" => "Visitor's Info",
	"photos" => "Photos",
	"welcome" => "Welcome"
);

if(!in_array($page, $allowed_pages)) {
	$page = "welcome";
}


function nav_class($active_page) {
	global $page;
	if($page === $active_page) {
		return " class='active'";
	}
}

include('header.php');

?>

<body>
	<div id="container">
		<div id="main">
			<header>
				<h1>
					<a href="history"><img src="images/header_logo.png" alt="Aldebaran Farm"/></a>
				</h1>
			</header>
			<article>
				<header>
					<h2>
						<span class="show-mobile-nav">&#9660;</span>
						<?= $page_titles[$page] ?>
					</h2>
					<ul class="mobile-nav">
					<?  foreach($allowed_pages as $allowed_page) { ?>
						<? if($allowed_page == $page) { continue; } ?>
						<li><h3><a href="<?= $allowed_page ?>"><?= $page_titles[$allowed_page] ?></a></h3></li>
					<? } ?>
					</ul>
				</header>
				<section>
<?php include("p_" . $page . '.php'); ?>
				</section>
			</article>
		</div>
		<aside id="sidebar">
			<img src="images/corner/corner<?=rand(1,9)?>.jpg"/>
			<nav>
				<ul>
					<li><a href="welcome"<?=nav_class("welcome")?>>Welcome</a></li>
					<li><a href="history"<?=nav_class("history")?>>History</a></li>
					<li><a href="accommodations"<?=nav_class("accommodations")?>>Accommodations</a></li>
					<li><a href="rates"<?=nav_class("rates")?>>Rates &amp; Reservations</a></li>
					<li><a href="info"<?=nav_class("info")?>>Visitors' Info</a></li>
					<li><a href="photos"<?=nav_class("photos")?>>Photos</a></li>
				</ul>
			</nav>
		</aside>
	</div>
	<footer></footer>
<?php include('footer.php'); ?>
