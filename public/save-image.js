(function() {
  const socket = io.connect();

  const canvas = document.getElementById('drawing');

  const $saveImageTemplate = $('.save-image-template');
  const $sideImages = $('.side-images');
  const $sideImagesContent = $('.side-images-content');

  const $showSide = $('.show-side');
  const $hideSide = $('.hide-side');

  const $save = $('#save');

  const addEvent = $image => {
    $image.find('.like').click(() => {
      socket.emit('like', $image.attr('id'));
    });

    $image.find('.dislike').click(() => {
      socket.emit('dislike', $image.attr('id'));
    });
  };

  $save.click(() => {
    const imageUrl = canvas.toDataURL();
    socket.emit('saveImage', imageUrl);
  });

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

  socket.on('like', image => {
    const $image = $(`#${image.id}`);
    likeImage($image);
  });

  socket.on('dislike', image => {
    const $image = $(`#${image.id}`);
    dislikeImage($image);
  });

  socket.on('saveImage', image => {
    const $saveImage = $saveImageTemplate.clone();
    $saveImage.find('img').attr('src', image.url);
    $saveImage.attr('id', image.id);
    $saveImage.find('.like-number').text(image.like);
    $saveImage.find('.dislike-number').text(image.dislike);
    $sideImagesContent.append($saveImage);
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
})();
