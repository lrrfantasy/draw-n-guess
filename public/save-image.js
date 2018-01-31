const canvas = document.getElementById('drawing');

const $saveImageTemplate = $('.save-image-template');
const $sideImages = $('.side-images');
const $sideImagesContent = $('.side-images-content');

const $showSide = $('.show-side');
const $hideSide = $('.hide-side');

const $save = $('#save');

const likeImage = $image => {
  const $likeNumberElement = $image.find('.like-number');
  let likeNumber = parseInt($likeNumberElement.text());
  likeNumber++;
  $likeNumberElement.text(likeNumber);
};

const dislikeImage = $image => {
  const $dislikeNumberElement = $image.find('.dislike-number');
  let likeNumber = parseInt($dislikeNumberElement.text());
  likeNumber++;
  $dislikeNumberElement.text(likeNumber);
};

const addEvent = $image => {
  $image.find('.like').click(() => {
    likeImage($image);
  });

  $image.find('.dislike').click(() => {
    dislikeImage($image);
  });
};

$save.click(() => {
  const imageUrl = canvas.toDataURL();

  const $saveImage = $saveImageTemplate.clone();

  $saveImage.find('img').attr('src', imageUrl);

  $sideImagesContent.append($saveImage);
  // save.href = canvas.toDataURL();
  // save.download = 'image.png';

  addEvent($saveImage);
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
