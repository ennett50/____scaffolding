var ui = {
    init: function () {

        this.phoneMask();

        this.fancyBox();

        // if btn is button(not submit form)
        $('[data-target]').click(function (e) {
            e.preventDefault();
        });




    },
    phoneMask: function () {
        $("input.js-phone-mask").mask("+7(999) 999-99-99");
    },
    fancyBox: function(){
        $(".js-fancybox").fancybox({
            padding: 0,
            margin: 40,
            loop: false
        });
    }

};
