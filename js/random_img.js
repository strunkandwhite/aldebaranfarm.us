// JavaScript Document


function random_img() {
	NumberOfImagesToRotate = 9;
FirstPart = '<img src="images/corner';
LastPart = '.jpg" alt="">';
var r = Math.ceil(Math.random() * NumberOfImagesToRotate);
document.write(FirstPart + r + LastPart);
}