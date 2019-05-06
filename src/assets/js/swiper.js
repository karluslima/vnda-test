// import { Swiper, Navigation, Pagination, Scrollbar } from 'swiper/dist/js/swiper.esm.js';

var mySwiper = new Swiper ('.swiper-container', {
  loop: true,
  speed: 1000,
  parallax: true,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})