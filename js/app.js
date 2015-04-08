$(function(){
//clone items to thumbnails
    $('.splash > div').clone().each(function(){
      $(this).addClass('hidden')
    }).appendTo('.thumbnails')


    //first selection
    $('.splash > div').on('click',function(){
      $(this).addClass('open').siblings().removeClass('open');
      $(this).siblings().removeClass('open');
      setTimeout(function(){
        $('.wrapper').addClass('active')
      },700);
      //fade em in
      var thumbQueue = [];
      var thumbSlideIn = function(i){
        $('.thumbnails > div').eq(i).removeClass('hidden').addClass(' slideInUp animated');
      }
      $('.thumbnails > div').each(function(i){
        thumbQueue[i] = setTimeout(thumbSlideIn, 1000 + i * 150, i)
      })
    });

    //subsequent selections
    $('.thumbnails > div').on('click',function(){
      $('.splash > div').removeClass('open');
      var thumbIndex = $(this).attr('data-index')
      console.log(thumbIndex)
      $('.splash > [data-index='+thumbIndex+']').addClass('open')
      $('.splash > [data-index='+thumbIndex+']').siblings().removeClass('open');
    })
})