var streamer = "KKGM13";

$().get('https://www.twitch.tv/'+ streamer , function(data) {
    var imgs = $("figure[aria-label=" + streamer +"]").html().find("figure[aria-label='"+streamer+"']");
    // imgs.each(function(i, img) {
    //     alert(img.src); // show a dialog containing the url of image
    // });
});