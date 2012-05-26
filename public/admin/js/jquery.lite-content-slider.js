/* 
 * jQuery - Lite Content Slider - Plugin v1.0
 * http://www.aakashweb.com/
 * Copyright 2010, Aakash Chakravarthy
 * Released under the MIT License.
 */
 
(function($){
    $.fn.liteSlider= function(options) {

      var defaults = {
        content : '.content',
        width : 500,
        height : 250,
        autoplay : false,
        delay : 3,
        buttonsClass : '',
        activeClass : '',
        controlBt : '',
        playText : ' Play',
        pauseText : 'Pause'
      };

      var options = $.extend(defaults, options);

      var slideNo = 1;
      var timer = 0;
      var playStatus = options.autoplay;
      var thisClass = ($(this).attr('class')).split(' ');
      var theClass = '.' + thisClass[0];
      var count = 0;
      var slides;
      var currentSlide = 1;
      var delay = parseInt(options.delay)*1000;

      $(this).children(options.content).each(function(){
        slides = ++count;
      });

      function wrapContent(ele){
        ele.wrap('<div class="sliderContentsWrap" />');
      }

      function applyCss(ele){
        $('.sliderContentsWrap').css({
          padding : 0,
          margin : 0,
          width : options.width,
          height : options.height,
          overflow : 'hidden',
          position : 'relative'
        });

        ele.css({
          padding : 0,
          margin : 0,
          width : options.width * slides,
          height : options.height,
          position : 'absolute'
        });

        ele.children(options.content).css({
          float : 'left',
          width : options.width,
          height : options.height
        });
      }

      function resetButtons(){
        i = 0;
        $('.' + options.buttonsClass).each(function(){
          i++;
          $(this).addClass('bt' + i);
          $(this).attr('rel', i);
        });
      }

      function goToSlide(theSlide){

        var animateLeft = -(options.width) * (parseInt(theSlide)-1); 
        $('.sliderContentsWrap' + ' ' + theClass)
        .animate({
          left: animateLeft
        });

        $('.' + options.buttonsClass).each(function(){
          $(this).removeClass(options.activeClass);
          if($(this).hasClass('bt' + theSlide)){
            $(this).addClass(options.activeClass)}
        });

        currentSlide = theSlide;
      }

      function autoplay(){
        if(currentSlide < slides){
          goToSlide(parseInt(currentSlide) + 1);
        }else{
          goToSlide(1);
        }
      }

      function playSlide(){
        clearInterval(timer);
        timer = setInterval(function(){
          autoplay();
        }, delay);

        $(options.controlBt).text(options.pauseText);
        playStatus = true;
      }

      function pauseSlide(){
        clearInterval(timer);
        $(options.controlBt).text(options.playText);
        playStatus = false;
      }

      function init(ele){
        wrapContent(ele);
        applyCss(ele);
        //resetButtons();

        if(options.autoplay == true){
          playSlide()
        }else{
          pauseSlide();
        }
      }

      return this.each(function(){
        init($(this));

        $('.'+options.buttonsClass).click(function(e){
          e.preventDefault();
          pauseSlide();
          goToSlide($(this).attr('rel'));
        });

        $(options.controlBt).click(function(e){
          e.preventDefault();
          if(playStatus == true){
            pauseSlide()
          }else{
            playSlide()
          } ;
        });

      });

    };
})(jQuery);
