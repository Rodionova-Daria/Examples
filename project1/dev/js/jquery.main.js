const burgerBTN = document.querySelector('.burger-menu');
const body = document.querySelector('body');
burgerBTN.addEventListener("click", function() {
    body.classList.toggle("burger-active");

});

const knowMore = document.querySelectorAll('.know-more');
const closeI = document.querySelectorAll('.close');
const s_content = document.querySelectorAll('.service-content');
for (let i = 0; i < knowMore.length; i++) {
    knowMore[i].addEventListener('click', function(e) {
        e.preventDefault();
        s_content[i].classList.add("close-active");
    });
    closeI[i].addEventListener('click', function(e) {
      e.preventDefault();
      s_content[i].classList.remove("close-active");
    });
}


/* Индекс слайда по умолчанию */
var slideIndex = 1;
var slideInfoIndex = 1;
var next = document.querySelector('.arrow-right');
var prev = document.querySelector('.arrow-left');
var dots = document.querySelectorAll('.nav-item');
var dots2 = document.querySelectorAll('.nav-item-2');

showSlides(slideIndex);
showSlidesInfo(slideInfoIndex);
markUpdots(dots);
markUpdots(dots2);


next.addEventListener('click',function plusSlide(e) {
    e.preventDefault();
    showSlidesInfo(slideInfoIndex += 1);
});

prev.addEventListener('click',function minusSlide(e) {
    e.preventDefault();
    showSlidesInfo(slideInfoIndex -= 1);  
});


function markUpdots (dots) {
    for (var i=0; i<dots.length; i++) {
        dots[i].dataset.indexNumber = i+1;
    }
}


dots.forEach(function(dot){
    dot.addEventListener('click', function(e){
      e.preventDefault();
        var index = dot.getAttribute('data-index-number');
        slideIndex = index;
        showSlides(slideIndex);
    })
});

dots2.forEach(function(dot){
  dot.addEventListener('click', function(e){
    e.preventDefault();
      var index = dot.getAttribute('data-index-number');
      slideInfoIndex = index;
      showSlidesInfo(slideInfoIndex);
  })
});

/* Основная функция сладера */
function showSlides(n) {
    var i;
    var slides = document.querySelectorAll('.slider-item');
    var dots = document.querySelectorAll('.nav-item');
   
    if (n > slides.length) {
      slideIndex = 1;
    } else if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < dots.length; i++) {
        slides[i].classList.remove('active-slide');
        dots[i].classList.remove('nav-active');
    }
    
    slides[slideIndex - 1].classList.add('active-slide');
    dots[slideIndex - 1].classList.add('nav-active');
    
}

function showSlidesInfo(n) {
    var i;
    var slidesInfo = document.querySelectorAll('.testimon-info');
    var slides = document.querySelectorAll('.slider-item-2');
    var dots = document.querySelectorAll('.nav-item-2');

    if (n > slides.length) {
        slideInfoIndex = 1;
    } else if (n < 1) {
        slideInfoIndex = slides.length;
    }

    for (i = 0; i < dots.length; i++) {
        slides[i].classList.remove('active-slide');
        dots[i].classList.remove('nav-active');
        slidesInfo[i].classList.remove('active-info-slide');
    }

    slidesInfo[slideInfoIndex - 1].classList.add('active-info-slide');
    slides[slideInfoIndex - 1].classList.add('active-slide');
    dots[slideInfoIndex - 1].classList.add('nav-active');
}