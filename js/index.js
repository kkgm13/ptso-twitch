$().get('https://www.twitch.tv/'+ 'KKGM13', function(data) {
    var imgs = $("figure[aria-label=" + "'KKGM13'"+"]").html();
    imgs.each(function(i, img) {
        alert(img.src); // show a dialog containing the url of image
    });
});