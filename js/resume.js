(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

  // Dark Mode Toggle Functionality
  $(document).ready(function() {
    const themeToggle = $('#theme-toggle');
    const themeIcon = $('#theme-icon');
    const body = $('body');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.attr('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.on('click', function() {
      const currentTheme = body.attr('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.attr('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
      if (theme === 'dark') {
        themeIcon.removeClass('fa-moon').addClass('fa-sun');
      } else {
        themeIcon.removeClass('fa-sun').addClass('fa-moon');
      }
    }

    // Back to Top Button Functionality
    const backToTopButton = $('#back-to-top');

    $(window).on('scroll', function() {
      if ($(window).scrollTop() > 300) {
        backToTopButton.addClass('visible');
      } else {
        backToTopButton.removeClass('visible');
      }
    });

    backToTopButton.on('click', function() {
      $('html, body').stop(true, false).animate({
        scrollTop: 0
      }, 600, 'easeOutCubic');
    });
  });

  // Loading Animation
  $(window).on('load', function() {
    setTimeout(function() {
      $('#page-loading').addClass('hidden');
      setTimeout(function() {
        $('#page-loading').hide();
      }, 500);
    }, 800);
  });

  // Enhanced hover effects for resume items
  $(document).ready(function() {
    $('.resume-item').hover(
      function() {
        $(this).find('.subheading').addClass('hovered');
      },
      function() {
        $(this).find('.subheading').removeClass('hovered');
      }
    );
  });

})(jQuery); // End of use strict
