/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// extended function to create html nodes
$.extend({
    el: function(el, props) {
        var $el = $(document.createElement(el));
        $el.attr(props);
        return $el;
    }
});

var username = "juanitodread";
$(function getGithubRepos() {
    var service = "https://api.github.com/users/" + username + "/repos";

    $.getJSON( service, function(response) {
        var sorted = response.sort(function(x, y){
            return new Date(x.updated_at).getTime() < new Date(y.updated_at).getTime();
        });

        $.each(sorted, function(key, val) {
            var projects = $('*[data-github="projects"]');
            projects.append(
                $.el("div", {"class":"col-sm-4 portfolio-item"})
                    .append($.el("a", {"class":"portfolio-link", "data-toggle":"modal" })
                        .append($.el("div", {"class": "caption"})
                            .append($.el("i", {"class": "fa fa-search-plus fa-3x"})
                                .append(val.name)))
                        .append($.el("img", {"class":"img-responsive", "alt":val.name})))
            );
        });
    });

});


