(function() {
  const canvas = document.getElementById('drawing');

  const $saveImageTemplate = $('.save-image-template');
  const $sideImages = $('.side-images');
  const $sideImagesContent = $('.side-images-content');

  const $showSide = $('.show-side');
  const $hideSide = $('.hide-side');

  const $save = $('#save');

  const setLikeAndDislike = ($image, image) => {
    $image.find('.like-number').text(image.like);
    if (image.likeUsers.length > 0) {
      $image
        .find('.like-number')
        .attr('data-tooltip', image.likeUsers.toString());
    }
    if (image.likeUsers.indexOf(username) >= 0) {
      $image
        .find('.like .color-item')
        .removeClass('grey')
        .addClass('red');
    } else {
      $image
        .find('.like .color-item')
        .removeClass('red')
        .addClass('grey');
    }

    $image.find('.dislike-number').text(image.dislike);
    if (image.dislikeUsers.length > 0) {
      $image
        .find('.dislike-number')
        .attr('data-tooltip', image.dislikeUsers.toString());
    }
    if (image.dislikeUsers.indexOf(username) >= 0) {
      $image
        .find('.dislike .color-item')
        .removeClass('grey')
        .addClass('blue');
    } else {
      $image
        .find('.dislike .color-item')
        .removeClass('blue')
        .addClass('grey');
    }
  };

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

  socket.on('like', image => {
    const $image = $(`#${image.id}`);
    setLikeAndDislike($image, image);
  });

  socket.on('dislike', image => {
    const $image = $(`#${image.id}`);
    setLikeAndDislike($image, image);
  });

  socket.on('saveImage', image => {
    const $saveImage = $saveImageTemplate.clone();
    $saveImage.find('img').attr('src', image.url);
    $saveImage.attr('id', image.id);
    setLikeAndDislike($saveImage, image);
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
