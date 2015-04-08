var router;

$(function() {

    var router = new Grapnel();

    router.get('', function(req) {
        resetSections()
            //ga('send', 'pageview', 'http://gsa.gov/sustainablegsa/' + window.location.hash);
    });
    router.get('/', function(req) {
        resetSections()
            //ga('send', 'pageview', 'http://gsa.gov/sustainablegsa');
    });

    router.get('/:id', function(req) {
        var id = req.params.id;
        console.log(id)
        viewSection(id)
            //ga('send', 'pageview', 'http://gsa.gov/sustainablegsa/' + window.location.hash);
    });

    //clone items to thumbnails
    $('.splash > div').clone().each(function() {
        $(this).addClass('hidden')
        $(this).find('.detail,.overview,h2').remove();
    }).appendTo('.thumbnails')


    $('.splash > div,.thumbnails > div').on('click', function() {
        router.navigate('/' + $(this).attr('data-index'));
    })


    function viewSection(id) {
        if (!$('.wrapper').hasClass('active')) {
            firstView();
        }
        $('.splash > div').removeClass('open');
        $('.splash > [data-index=' + id + ']').addClass('open')
    }

    function firstView() {
        setTimeout(function() {
            $('.wrapper').addClass('active')
        }, 700);
        //fade em in
        var thumbQueue = [];
        var thumbSlideIn = function(i) {
            $('.thumbnails > div').eq(i).removeClass('hidden').addClass(' slideInUp animated');
        }
        $('.splash > div,.thumbnails > div').each(function(i) {
            thumbQueue[i] = setTimeout(thumbSlideIn, 1000 + i * 150, i)
        })
    }

    function resetSections() {
        $('.splash > div').removeClass('open');
        $('.wrapper').removeClass('active')
    }
})
