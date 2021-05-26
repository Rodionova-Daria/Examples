const burgerBTN = document.querySelector('.burger-menu');
const body = document.querySelector('body');
burgerBTN.addEventListener("click", function() {
    body.classList.toggle("burger-active");

});