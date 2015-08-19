if(!GSA){
    var GSA = {}
}

$(function(){
    var router = new Grapnel({root : '/git/sustainable-gsa/'  }); // change root for production / dev /OGILVY/sustainable-gsa/

    GSA.initState = true;
    GSA.indexTracker;
    GSA.CIDs =   {
        1: 'strategically-sustainable',
        2: 'buildings',
        3: 'products-services',
        4: 'fleet',
        5: 'workplaces',
        6: 'policy',
        7: 'results'
    };
    GSA.retrieveContent = function() {
        $('<div></div>').attr('id','loader').appendTo('#landing');
        $.each(GSA.CIDs, function(key, value) {
            $.ajax({
                url: 'CID/' + value + '.php',
                success: function(data) {
                    GSA.initialDisplay(data, key);
                    GSA.populateThumbs(data, key);
                },
                error : function() {
                    // errorFunction();
                }
            });
        });
        setTimeout(function() {
            $('#loader').fadeOut(500, function() {$(this).remove()});
            sortDivs('.blocks-container', '.block-wrap');
            $('.block-wrap').fadeIn(500);
        },2000);
    };

    GSA.routerPage = function() {
        GSA.initState = false;
        $('<div></div>').attr('id','loader').appendTo('#landing');
        $.each(GSA.CIDs, function(key, value) {
            $.ajax({
                url: 'CID/' + value + '.php',
                success: function(data) {
                    GSA.initialDisplay(data, key);
                    GSA.populateThumbs(data, key);
                },
                error : function() {
                    // errorFunction();
                }
            });
        });
        setTimeout(function() {
            $('#loader').fadeOut(500, function() {$(this).remove()});
            sortDivs('.blocks-container', '.block-wrap');
            GSA.displayThumbs();
            //
            var currentBlockItem = $('.block-wrap').eq(GSA.indexTracker);
            var header = currentBlockItem.find('aside').text();

            //assign the active block and create some variables
            var offsetLeft = currentBlockItem.position().left,
                offsetTop = currentBlockItem.position().top;

            // position the ACTIVE block
            currentBlockItem.addClass('current');
            currentBlockItem.css({position: 'absolute', display: 'block', left: offsetLeft, top: offsetTop});
            currentBlockItem.animate({left: 0, top: 0, width: '100%', height: '100%'}, 500, function () {
                // display the thumb navigation
                GSA.displayThumbs();
                $("html, body").animate({scrollTop: $('#thumb-nav').offset().top}, 500);
                // display left/right navigation
                $('.slide-section').fadeIn(500);
            });
            // apply template and style to each of the blocks hidden behind the active block
            $('.block-wrap').each(function() {
                var title = $(this).find('header').text(),
                    label = $(this).find('aside').text(),
                    text = $(this).find('.full-display-content').html();
                image = $(this).children('.block').css('background-image');
                $(this).removeClass('block-wrap col-sm-3 col-sm-6').addClass('slide').html("<div class='inner-block' style='background-color:#f6f6f6;'><aside>"+title+"</aside><header>"+label+"</header><article>"+text+"</article></div>").css({height : '100%'});
            });
            setTimeout(function() {
                var wrapper = $('.blocks-container');
                var heightofActiveBlock = parseInt($('.current .inner-block > article').height() + 75);
                wrapper.height(heightofActiveBlock);
            },200);
        },2000);
    };

    GSA.initialDisplay = function(data, key) {
        var response = $(data);
        var contentBlock = response.filter('#data-block').html(),
                size = $(contentBlock).find('#size').html(),
                image = $(contentBlock).find('#image').html(),
                tag = $(contentBlock).find('#tag').html(),
                title = $(contentBlock).find('#title').html(),
                excerpt = $(contentBlock).find('#excerpt').html();
                content = $(contentBlock).find('#content').html();
        var template = '<div class="col-sm-'+size+' block-wrap" data-sort="'+key+'">'+
                            '<div class="block" style="background-image: url(images/'+image+')">'+
                                '<a data-content="ajax">'+
                                    '<aside><span>'+title+'</span></aside>'+
                                    '<header>'+tag+'</header>'+
                                    '<article class="rollover">'+
                                        '<span class="arrow"><i class="icon-arrow-right"></i></span>'+
                                        excerpt +
                                    '</article>'+
                                '</a>'+
                            '</div>'+
                            '<div class="full-display-content">'+
                               content +
                            '</div>'+
                        '</div>';
        //maintain height of display area and get index number of clicked block
        var wrapper = $('.blocks-container');
        wrapper.height('500px');
        wrapper.append(template);
    };

    GSA.blockHover = function() {
        $("#landing").on({
            mouseenter: function () {
                $(this).find('.rollover').stop().fadeIn(500);
            },
            mouseleave: function () {
                $(this).find('.rollover').stop().fadeOut(300);
            }
        },'.block-wrap:not(:first-child)');
    };

    GSA.populateThumbs = function(data, key) {
        var response = $(data);
        var contentBlock = response.filter('#data-block').html(),
            image = $(contentBlock).find('#image').html(),
            title = $(contentBlock).find('#title').html();
        var wrapperWidth = $('.blocks-container').width(),
            thumbBlocks = wrapperWidth / 8,
            spacePadding = 6,
            blockWidth = thumbBlocks - spacePadding;

        var template = '<div class="thumb-wrap" style="width:'+blockWidth+'px" data-sort="'+key+'">'+
            '<div class="thumb" style="background-image: url(images/'+image+')">'+
            '<header>'+title+'</header>'+
            '</div>'+
            '</div>';

        $('#thumb-nav').append(template);

    };

    GSA.displayThumbs = function() {
        var wrapperWidth = $('.blocks-container').width(),
            thumbBlocks = wrapperWidth / 8,
            spacePadding = 6;
        sortDivs('#thumb-nav', '.thumb-wrap');
        $('#thumb-nav > div:first-child').css('width', (thumbBlocks*2)-spacePadding);
        $('#thumb-nav').children('div').each(function(i) {
            if(i == GSA.indexTracker) {
                $(this).addClass('active-thumb');
            }
           $(this).delay(i * 100).slideDown(600);
        });
    };

    GSA.hoverThumbs = function() {
        $('.thumb-wrap').hover(function() {
            $(this).find('.thumb').animate({opacity: 0.5},200);
        });
    };

    GSA.activateBlocks = new function() {
        //disable functionality for first block click
        $('#landing').on('click','.block',function(e) {
            var header = $(this).find('aside').text();
            var indexValue = $(this).parent('div').index() + 1;
            if($(this).parent('div').index() === 0) {
                e.preventDefault();
            } else {
                e.preventDefault();
                //maintain height of display area and get index number of clicked block
                var wrapper = $('.blocks-container');
                wrapper.height(wrapper.height());
                GSA.indexTracker = $(this).parent('div').index();

                //assign the active block and create some variables
                var activeBlock = $(this).parent('.block-wrap'),
                offsetLeft = activeBlock.position().left,
                offsetTop = activeBlock.position().top;

                // position the ACTIVE block
                activeBlock.addClass('current');
                activeBlock.css({position: 'absolute', display: 'block', left: offsetLeft, top: offsetTop});
                activeBlock.animate({left: 0, top: 0, width: '100%', height: '100%'}, 500, function () {
                    // display the thumb navigation
                    GSA.displayThumbs();
                    $("html, body").animate({scrollTop: $('#thumb-nav').offset().top}, 500);
                    // display left/right navigation
                    $('.slide-section').fadeIn(500);
                });
                // apply template and style to each of the blocks hidden behind the active block
                $('.block-wrap').each(function() {
                     var title = $(this).find('header').text(),
                     label = $(this).find('aside').text(),
                     text = $(this).find('.full-display-content').html();
                     image = $(this).children('.block').css('background-image');
                     $(this).removeClass('block-wrap col-sm-3 col-sm-6').addClass('slide').html("<div class='inner-block' style='background: #f6f6f6;'><aside>"+label+"</aside><header>"+title+"</header><article>"+text+"</article></div>").css({height : '100%'});
                });
                setTimeout(function() {
                    var heightofActiveBlock = parseInt($('.current .inner-block > article').height() + 75);
                    wrapper.height(heightofActiveBlock);
                },200);

                // router
                router.navigate('#/'+GSA.CIDs[indexValue]);
            }
        });
    };


    GSA.toggleActiveBlocks = function() {
        var thumbBlock = '#thumb-nav > div';
        var wrapper = $('.blocks-container');
        $('#landing').on('click',thumbBlock,function(e) {
            var thumbIndex = $(this).index();
            if(thumbIndex == 0) {
                router.navigate('');
            } else {
                e.preventDefault();
                $(thumbBlock).removeClass('active-thumb');
                $(this).addClass('active-thumb');
                var currentSlide = $('.blocks-container > div').eq(thumbIndex);
                currentSlide.addClass('current').fadeIn(500,function() {
                    $('.current').not(currentSlide).fadeOut(300).delay(300).removeClass('current');
                    var heightofActiveBlock = parseInt($('.current .inner-block > article').height() + 175);
                    wrapper.height(heightofActiveBlock);
                });
                GSA.indexTracker = thumbIndex;
                //router

                router.navigate('#/'+GSA.CIDs[thumbIndex+1]);
            }
        })
    };

    GSA.updateThumbIndex = function() {
        $('#thumb-nav > div').removeClass('active-thumb');
        $('#thumb-nav > div').eq(GSA.indexTracker).addClass('active-thumb');
    };

    GSA.nextSlide = function() {
        $('#landing').on('click','.slide-right', function() {
            $('.current').next('.slide').addClass('current').fadeIn(1, function() {
                $('.current').prev('.slide').removeClass('current').fadeOut(500);
            });
            GSA.indexTracker++;
            if(GSA.indexTracker == ($('.slide').length - 1)) {
                $('.slide-right').fadeOut(300);
            }
            GSA.updateThumbIndex();
            //router
            router.navigate('#/'+GSA.CIDs[GSA.indexTracker+1]);
        })
    };

    GSA.prevSlide = function() {
        $('#landing').on('click','.slide-left', function() {
            if(GSA.indexTracker == 1) {
                GSA.resetBlocks();
            } else {
                $('.current').prev('.slide').addClass('current').fadeIn(1, function () {
                    $('.current').next('.slide').removeClass('current').fadeOut(500);
                });
                GSA.indexTracker--;
                if (GSA.indexTracker == ($('.slide').length - 1)) {
                    $('.slide-left').fadeOut(300);
                }
                GSA.updateThumbIndex();
                //router
                router.navigate('#/'+GSA.CIDs[GSA.indexTracker+1]);
            }
        })
    };

    GSA.resetBlocks = function() {
        var thumbs = $('#thumb-nav').children('div');
        thumbs.slideUp(500,function() {
            $(this).remove();
            // display left/right navigation
            $('.slide-section').fadeOut(500);
            // fade out and remove existing slides
            $('.blocks-container > *').fadeOut(500,function() {
                $(this).remove();
            });
        });
        setTimeout(function() {
            GSA.retrieveContent();
        },900);
    };

    GSA.blockHover();
    GSA.toggleActiveBlocks();

    //Routes
    router.get('', function(req) {
        GSA.resetBlocks();
        GSA.initState = false;
    });
    router.get('/buildings', function(req) {
        if(GSA.initState == true) {
            GSA.indexTracker = 1;
            GSA.routerPage();
            GSA.updateThumbIndex();
        }
    });
    router.get('/products-services', function(req) {
        if(GSA.initState == true) {
            GSA.indexTracker = 2;
            GSA.routerPage();
            GSA.updateThumbIndex();
        }
    });
    router.get('/fleet', function(req) {
        if(GSA.initState == true) {
            GSA.indexTracker = 3;
            GSA.routerPage();
            GSA.updateThumbIndex();
        }
    });
    router.get('/workplaces', function(req) {
        if(GSA.initState == true) {
            GSA.indexTracker = 4;
            GSA.routerPage();
            GSA.updateThumbIndex();
        }
    });
    router.get('/policy', function(req) {
        if(GSA.initState == true) {
            GSA.indexTracker = 5;
            GSA.routerPage();
            GSA.updateThumbIndex();
        }
    });
    router.get('/results', function(req) {
        if(GSA.initState == true) {
            GSA.indexTracker = 6;
            GSA.routerPage();
            GSA.updateThumbIndex();
        }
    });


});

function sortDivs(wrapper,item) {
    var $wrapper = $(wrapper);
    $wrapper.find(item).sort(function (a, b) {
        return +a.getAttribute('data-sort') - +b.getAttribute('data-sort');
    }).appendTo( $wrapper );
};



