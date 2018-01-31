const canvas = document.getElementById('drawing');

const $saveImageTemplate = $('.save-image-template');
const $sideImages = $('.side-images');
const $sideImagesContent = $('.side-images-content');

const $showSide = $('.show-side');
const $hideSide = $('.hide-side');

const $save = $('#save');

$save.click(() => {
  const imageUrl = canvas.toDataURL();

  const $saveImage = $saveImageTemplate.clone();

  $saveImage.find('img').attr('src', imageUrl);

  $sideImagesContent.append($saveImage);
  // save.href = canvas.toDataURL();
  // save.download = 'image.png';
});

$showSide.click(() => {
  $sideImages.addClass('show');
  $showSide.hide();
  $hideSide.show();
});

$hideSide.click(() => {
  $sideImages.removeClass('show');
  $showSide.show();
  $hideSide.hide();
});
