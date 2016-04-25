

// ----------------------------------------- carousel -------------------------------------------

$('.product-list .owl-carousel').each(function () {
    var owl = $(this);
    owl.owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
            0: {
                items: 1
            },

            768: {
                items: 2
            },
            1200: {
                items: 4
            }
        }
    });


});


// -------------------------------------- equal height -----------------------------------------------

function equalHeight(group) {
    tallest = 0;
    group.each(function () {
        thisHeight = $(this).height();
        if (thisHeight > tallest) {
            tallest = thisHeight;
        }
    });
    group.height(tallest);
}


function set_equal() {

    $(".product-list").each(function () {
        $(".item .title", this).css({height: "auto"})
        equalHeight($(".item .title", this))
    });

    $("#info .anounce.col-lg-4").css({height: "auto"})

    equalHeight($("#info .anounce.col-lg-4"))
}

set_equal();


// ---------------------------------------- main slider ---------------------------------------------

var mainSlider = $('#main-slider');
var progressBar = $('#slider #progress');

if (mainSlider.length) {
    mainSlider.owlCarousel({
        //items: 1,
        singleItem: true,
        autoplay: false,
        autoplayHoverPause: false,
        loop: false,
        margin: 0,
        dots: true,
        nav: false,
        responsiveRefreshRate: 100,
        responsive: {
            0: {items: 1},
            479: {items: 1},
            768: {items: 1},
            991: {items: 1},
            1024: {items: 1}
        }
    });


    $(".item", mainSlider).each(function () {
        var title = (typeof $(this).attr("title") != "undefined") ? $(this).attr("title") : "";
        $("#slider #progress .bar ul").append("<li><div></div><span><b>" + title + "</b></span></li>")
    })

    if (progressBar.length) {

        $(".bar ul li", progressBar).css({width: 100 / $(".bar ul li", progressBar).length + "%"}).click(function (e) {
            e.stopPropagation();
            $(".bar ul li.current", progressBar).removeClass("current");
            $(this).addClass("current");
            var owl = $(this).closest("#slider").find(".owl-carousel").data('owlCarousel');
            var index = $(this).closest("ul").find("li").index($(this));
            owl.to(index)
        })

        autoChangeSlide = function () {

            var index = $(".bar ul li", progressBar).index($(".bar ul li.current", progressBar));
            index = (index >= 0) ? index : 0;
            var current = (index + 1 == $(".bar ul li", progressBar).length) ? 0 : index + 1;

            $(".bar ul li.current", progressBar).removeClass("current")
            $(".bar ul li:eq(" + current + ")", progressBar).trigger("click");

        };

        $(".bar ul li:eq(0)", progressBar).addClass("current")

        $(".bar ul li div", progressBar).on("transitionend webkitTransitionEnd webkitAnimationEnd animationend oanimationend MSAnimationEnd", autoChangeSlide)
    }


}


// ----------------------------------------- sticky ------------------------------------------------

var sticky_navigation_offset_top = $('nav').offset().top;

var sticky_navigation = function () {
    $('nav').css('top', '1px');

    var scroll_top = $(window).scrollTop();

    if (scroll_top > sticky_navigation_offset_top) {

        $('nav').addClass('fixedMainMenu');
    } else {
        $('nav').removeClass('fixedMainMenu');
    }

    $('nav').css('top', '0');
};

sticky_navigation();

jQuery(window).scroll(function () {
    sticky_navigation();
});


// ----------------------------------------- /sticky ------------------------------------------------


// ---------------------------------------- popup video ----------------------------------------

$(".various").fancybox({
    maxWidth: 800,
    maxHeight: 600,
    fitToView: false,
    width: '70%',
    height: '70%',
    autoSize: false,
    closeClick: false,
    openEffect: 'none',
    closeEffect: 'none'
});


// --------------------------------------- sidebar toggle -------------------------------------------

$(".navbar-toggle").click(function (e) {

    var type = String($(this).attr("id")).replace("toggle-", "");

    if (!$("body #sidebar-" + type).length) {
        $("body").append(
            "<div id='sidebar-" + type + "' class='sidebar-wrap'>" +
            "<div class='sidebar'>" +
            "<button class='close'></button>" +
            "<div class='inner'></div>" +
            "</div>" +
            "</div>"
        )

        var tmp = new Array();
        $("*[data-" + type + "]").each(function () {
            tmp[$(this).data(type)] = $(this).clone(true).removeClass("hidden-" + type);
        })

        tmp.sort();
        for (var i = 0; i < tmp.length; i++) $("body #sidebar-" + type + " .sidebar .inner").append(tmp[i])
        $("body #sidebar-" + type).addClass("active");
        //$("body #sidebar-"+type+" .sidebar > div").slimscroll({alwaysVisible: false, height: 'auto', railVisible: false});
    }

    $("body #sidebar-" + type).addClass("active");


    $("body, .sidebar-wrap .sidebar .close").on("click.sidebar", function () {
        $("body .sidebar-wrap").removeClass("active");
        $("body").off("click.sidebar");
        $("body .sidebar-wrap").off("click.sidebar");
    })
    $("body .sidebar-wrap .sidebar").on("click.sidebar", function (e) {
        e.stopPropagation();
    });
    e.stopPropagation();


})


// --------------------------------------- /sidebar toggle -------------------------------------------


// --------------------------------------- callback toggle -------------------------------------------


$("#pozvonim-button .pozvonim-button-phone, .callback-link").click(function (e) {


    $("#callback-wrap").addClass("active");
    $("#pozvonim-button").addClass("hidden")


    $("body, #callback-wrap .close").on("click.sidebar", function () {
        $("body #callback-wrap").removeClass("active");
        $("#pozvonim-button").removeClass("hidden");
        $("body, #callback-wrap .close").off("click.sidebar");
        $("body #callback-wrap").off("click.sidebar");
        return false;
    })
    $("body #callback-wrap .sidebar").on("click.sidebar", function (e) {
        e.stopPropagation();
    });
    e.stopPropagation();

})


// --------------------------------------- /callback toggle -------------------------------------------


$("input[name='phone']").mask("+7 (999) 999-9999");


// --------------------------------------- catalog menu toggle -------------------------------------------


$("#catalog-link a").click(function (e) {
    if (!$("nav #nav_left").hasClass("active")) {
        $(this).closest("li").addClass("active")
        $("nav #nav_left").addClass("active")
        $("body").on("click.catalogMenu", function () {
            $("nav #nav_left").removeClass("active");
            $("#catalog-link a").closest("li").removeClass("active");
            $("body").off("click.catalogMenu");
        })
    }
    else {
        $("body").trigger("click.catalogMenu");
    }


    e.stopPropagation();
    return false;
})


// --------------------------------------- /catalog menu toggle -------------------------------------------


// --------------------------------------- window resizes -------------------------------------------


$(function () {
    $("form#search :submit").click(function () {
        var $wrap = $(this).closest("#nav_right")
        if ($wrap.hasClass("wide")) return true;

        $wrap.toggleClass("wide")
        return false;

    });

    $("form#search .close").click(function () {
        $(this).closest("#nav_right").removeClass("wide")
        return false;
    })
});


$(window).resize(function () {
    if ($("body .sidebar-wrap").is(":visible")) $("body").trigger("click.sidebar");
    set_equal();
    $('.product-list .owl-carousel').trigger("refresh.owl.carousel");
})

$(window).load(function () {
    $(window).trigger("resize");
})