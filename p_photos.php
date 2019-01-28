					<script type="text/javascript">
						$(document).ready(function() {
							$('.fancybox').fancybox({
								arrows: true,
								margin: [20, 60, 20, 60],
								helpers: {
									overlay: {
										locked: false
									}
								}
							});
						});
					</script>

<?php
	$photos = array(
		'gallery_20.jpg' => '',
		'gallery_14.jpg' => '',
		'gallery_15.jpg' =>  '',
		'gallery_4.jpg' =>  '',
		'gallery_11.jpg' =>  'Back porch/main entrance',
		'gallery_10.jpg' =>  '',
		'gallery_8.jpg' =>  'In the Great Room',
		'games.jpg' =>  'In the Great Room',
		'bedroom_1.jpg' => 'Downstairs bedroom 1',
		'bedroom_2.jpg' => 'Downstairs bedroom 2',
		'desk.jpg' => 'Bedroom 2 workspace',
		'table.jpg' => 'Dining table seats 10 comfortably, 12 if you squeeze',
		'hearth(3).jpg' => 'Hearth',
		'kitchen.jpg' => 'Fully equipped kitchen',
		'kitchen_table.jpg' => '',
		'bath_1.jpg' => 'Downstairs bathroom',
		'bath_2.jpg' => 'Downstairs bathroom',
		'gallery_19.jpg' => 'Upstairs loft',
		'upbath2.jpg' =>  'Upstairs  bathroom',
		'upbath1.jpg' => 'Upstairs bathroom has tub and separate shower stall. And (next picture) a blue velvet chaise longue.',
		'chaise.jpg' => 'There it is!',
		'gallery_28.jpg' => '',
		'gallery_30.jpg' =>  '',
		'gallery_31.jpg' =>  '',
		'gallery_27.jpg' =>  'Unity Chapel',
		'gallery_21.jpg' =>  ''
	);
	foreach ($photos as $src => $caption) {
?>
<a href='images/gallery/<?=$src?>' rel='gallery' class='galleryThumb fancybox' title='<?=$caption?>'><img src='images/gallery/thumbs/<?=$src?>' alt=''/></a>
<?php 
	}
?>