if(!GSA){
    var GSA = {}
}

GSA.indexTracker;
GSA.thumbNav = new function () {
    var blockItem = $('#landing .row > div'),
        wrapperWidth = $('#landing > .row').width(),
        thumbBlocks = wrapperWidth / 8,
        thumbNav = '#thumb-nav';

    this.populateThumbNav = function() {
        var spacePadding = 6; // padding between thumbs
        blockItem.clone().each(function(i) {
            $(this).appendTo(thumbNav).css('width', thumbBlocks - spacePadding).removeClass();
            $(this).find('.block').toggleClass('thumb block');
            if(i == 0) {
                $(this).css('width', (thumbBlocks*2)-spacePadding);
            }
        });
    };

    this.displayThumbs = function() {
        $(thumbNav).children('div').each(function(i) {
            if(i == GSA.indexTracker) {
                $(this).addClass('active-thumb');
            }
            $(this).delay(i * 100).slideDown(600);
        });
    }

};

GSA.activateBlocks = new function() {
    $('#landing').on('click','.block',function(e) {
        e.preventDefault();
        //maintain height of display area and get index number of clicked block
        var wrapper = $(this).closest('.row');
            wrapper.height(wrapper.height());
            GSA.indexTracker = $(this).parent('div').index();

        // populate thumb navigation
        GSA.thumbNav.populateThumbNav();

        //assign the active block and create some variables
        $(this).addClass('active-block');
        var activeBlock = $('.active-block'),
            activeBlockWrapper = activeBlock.parent('div');
            headerText = activeBlock.find('header').text(),
            asideText = activeBlock.find('aside').text(),
            content = activeBlock.find('.full-display-content').html(),
            offsetLeft = activeBlock.parent('div').position().left,
            offsetTop = activeBlock.parent('div').position().top;

            // position all the NON ACTIVE blocks
            $('.block').parent('div').not(activeBlockWrapper).css({opacity: 0, position : 'absolute', left: 0, top: 0, margin: 0, width: '100%',height: '100%'}).removeClass();

            // position the ACTIVE block
            activeBlockWrapper.css({position : 'absolute', left: offsetLeft, top: offsetTop});
            activeBlockWrapper.animate({left : 0 , top: 0, width: '100%', height: '100%'},800).removeClass();
            activeBlock.animate({height : '100%'},800, function() {
                // display the thumb navigation
                GSA.thumbNav.displayThumbs();
                $("html, body").animate({ scrollTop: $('#thumb-nav').offset().top }, 500);
            });

            //change the styles and layout of the active block
            activeBlock.toggleClass('activated block');
            $('.activated').html('<aside>'+asideText+'</aside><header>'+headerText+'</header><article>'+content+'</article>');

            // apply template and style to each of the blocks hidden behind the active block
            $('.block').not(activeBlock).each(function() {
                var title = $(this).find('header').text(),
                    label = $(this).find('aside').text(),
                    text = $(this).find('.full-display-content').html();
                $(this).html('<aside>'+title+'</aside><header>'+label+'</header><article>'+text+'</article>');
                $(this).toggleClass('activated block');
                $(this).css({height : '100%'});
            });
    });
};

GSA.blockHover = function() {
    $('.block').hover(function() {
        $(this).find('.rollover').stop().fadeIn(500);
    }, function() {
        $(this).find('.rollover').stop().fadeOut(300);
    })
};

GSA.toggleActiveBlocks = function() {
    var thumbBlock = '#thumb-nav > div';
    var displayBlock = $('#landing > .row > div');
    $('#landing').on('click',thumbBlock,function(e) {
        e.preventDefault();
        var thumbIndex = $(this).index();
        $(thumbBlock).removeClass('active-thumb');
        $(this).addClass('active-thumb');
        $('.active-block').parent('div').animate({opacity: 0},300).removeClass('active-block');
        displayBlock.eq(thumbIndex).animate({opacity : 1},400);
        displayBlock.eq(thumbIndex).find('.activated').addClass('active-block');
    })
};


GSA.mobileMenu = new function() {

    this.toggleMenu = function() {
        "use strict";
        var toggles = document.querySelectorAll(".cmn-toggle-switch");

        for (var i = toggles.length - 1; i >= 0; i--) {
            var toggle = toggles[i];
            toggleHandler(toggle);
        };

        function toggleHandler(toggle) {
            toggle.addEventListener( "click", function(e) {
                e.preventDefault();
                (this.classList.contains("active") === true) ? this.classList.remove("active") : this.classList.add("active");
            });
        }

        $('#header').on('click','#hamburger-toggle',function() {
            $(this).addClass('toggled');
            var windowHeight = $(window).height();
            if($(this).hasClass('toggled-off')) {
                $(this).toggleClass('toggled-on toggled-off');
                $('body').animate({'margin-left': '-250px', 'margin-right': '250px'}, 500);
                $('#slideout-menu').height(windowHeight).animate({right: 0}, 500);
            } else if($(this).hasClass('toggled-on')) {
                $(this).toggleClass('toggled-off toggled-on');
                $('body').animate({'margin-left': '0', 'margin-right': '0'}, 500)
                $('#slideout-menu').height(windowHeight).animate({right: '-250px'}, 500);
            }
        })
    }
};

/* /////////////////////////
    DOCUMENT READY        ///
/////////////////////////*/

$(function(){

    GSA.mobileMenu.toggleMenu();
    GSA.activateBlocks;
    GSA.toggleActiveBlocks();
    GSA.blockHover();
});