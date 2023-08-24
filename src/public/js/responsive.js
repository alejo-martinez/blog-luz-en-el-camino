const navHamburger = document.getElementById('navHamburger');
const navMenu = document.getElementById('navMenu');

navHamburger.addEventListener('click', function() {
    navMenu.classList.toggle('open');
});
