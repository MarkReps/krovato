"use strict";

import burgerBtn from "./burger.js";

import * as functions from './functions.js';
// Модуль "Спойлери"
functions.spoilers();
// 
functions.showMore();
// Модуль Swiper
import "./slider.js";


const containerFooter = document.querySelector('.footer__container');
const socialFooter = containerFooter.querySelector('.social-footer');
const logoFooter = socialFooter.querySelector('.social-footer__logo');
if(logoFooter){
    const mediaQuery = window.matchMedia(`(max-width:${767.98/16}em)`);
    moveLogoFooter();
    mediaQuery.addEventListener('change',()=>{
        moveLogoFooter();
    });
    function moveLogoFooter(){
        mediaQuery.matches? socialFooter.insertAdjacentElement("beforebegin",logoFooter): socialFooter.insertAdjacentElement("afterbegin",logoFooter);
        mediaQuery.matches? containerFooter.insertAdjacentElement("beforeend",socialFooter): containerFooter.insertAdjacentElement("afterbegin",socialFooter);
    }
}

const langMenu = (e) => {
    const targetElement = e.target;
    const isTouchScreen = window.matchMedia('(any-hover:none)').matches;
    if(isTouchScreen){
        if(targetElement.closest('.lang-header')){
            const langHeader = targetElement.closest('.lang-header');
            langHeader.classList.toggle('_active');
        } else {
            document.querySelector('.lang-header').classList.remove('_active');
        }
    }
}
document.addEventListener('click',langMenu);
const phoneMenu  = (e) =>{
    const targetElement = e.target;
    const targetTag = targetElement.tagName;
    
    if(targetElement.closest('.contacts-header') && targetTag !=="A"){
        const contactsHeader = targetElement.closest('.contacts-header');
        contactsHeader.classList.toggle('_active');
    } else {
        document.querySelector('.contacts-header').classList.remove('_active');
    }
}
document.addEventListener('click',phoneMenu);
const catalogMenu =(e) => {
    const elementTarget = e.target;
    if(elementTarget.closest('.button-catalog')){
        const menuCatalog = document.querySelector('.items-catalog');
        document.documentElement.style.setProperty('--menu-catalog-top',`${menuCatalog.getBoundingClientRect().top + 20}px`)
        document.documentElement.classList.toggle('_catalog-open');   
        
    } else if(!elementTarget.closest('.items-catalog__wrapper')){
        document.documentElement.classList.remove('_catalog-open');
    }
}
document.addEventListener('click',catalogMenu);
const searchMenu = (e) =>{
    const elementTarget = e.target;
    if(elementTarget.closest('.search-header__button')){
        document.documentElement.classList.toggle('_search-active');
    } else if(!elementTarget.closest('.search-header')){
        document.documentElement.classList.remove('_search-active');
    }
}
document.addEventListener('click',searchMenu);
let subMenuToggle = (e) =>{
    const targetElement = e.target;
    if(targetElement.closest('.items-catalog__more')){
        const catalogItem = targetElement.closest('.items-catalog__item');
        const catalogActiveItem =  document.querySelector('.items-catalog__item._item-active');
        catalogItem.classList.toggle('_item-active');
        if(catalogActiveItem && catalogItem !== catalogActiveItem){
            catalogActiveItem.classList.remove('_item-active');
        }
    }
}
document.addEventListener('click',subMenuToggle);
const cartMenu =(e) => {
    const elementTarget = e.target;
    if(elementTarget.closest('.actions-body-header__link._icon-cart')){
        const menuCatalog = document.querySelector('.cart-header');
        document.documentElement.classList.toggle('_cart-open');   
        
    } else if(!elementTarget.closest('.cart-header') || elementTarget.closest('.cart-header__close') ||elementTarget.closest('.cart-header__continue')){
        document.documentElement.classList.remove('_cart-open');
    }
}
document.addEventListener('click',cartMenu);
const quantity = (e) =>{
    const targetElement = e.target;
    if(targetElement.closest('.quantity__button._icon-minus')){
        const count = targetElement.closest('.quantity__button._icon-minus').nextElementSibling;
        count.value = count.value - 1 > 0 ? count.value - 1 : 1;
    } else if (targetElement.closest('.quantity__button._icon-plus')){
        const count = targetElement.closest('.quantity__button._icon-plus').previousElementSibling;
        count.value = ++count.value;
    }
}
document.addEventListener('click',quantity);

// hero Slider
const heroSlider = new Swiper('.hero__slider',{
    loop:true,
    pagination:{
        el:'.hero__pagination',
        clickable:true,
    },
    // Navigation arrows
    navigation: {
        nextEl: '.hero__button-next',
        prevEl: '.hero__button-prev',
    },
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 10,
    //autoHeight: true,
    speed: 800,
});
// sale Slider
const saleSlider = new Swiper('.sale__slider',{
    loop:true,
    // Navigation arrows
    navigation: {
        nextEl: '.block-header__arrow--sale-right',
        prevEl: '.block-header__arrow--sale-left',
    },
    observer: true,
    observeParents: true,
    slidesPerView: 3,
    spaceBetween: 30,
    // Responsive breakpoints
    breakpoints: {
        // when window width is >= 480px
        320: {
        slidesPerView: 1.2,
        spaceBetween: 20
        },
        480:{
            slidesPerView: 2,
            spaceBetween: 20 
        },
        // when window width is >= 992px
        991.98: {
        slidesPerView: 3,
        spaceBetween: 30,
        }

    },
    //autoHeight: true,
    speed: 800,
})
// reviews Slider
const reviewsSlider = new Swiper('.reviews__slider',{
    slidesPerView: "auto",
    spaceBetween: 30,
    breakpoints: {
        // when window width is >= 480px
        320: {
        slidesPerView: 1,
        spaceBetween: 10
        },
        520:{
            slidesPerView: 1.5,
            spaceBetween: 10 
        },
        650:{
            slidesPerView: 1.8,
            spaceBetween: 10 
        },
        900:{
            slidesPerView: 2,
            spaceBetween: 20 
        },
        // when window width is >= 992px
        991.98: {
        slidesPerView: "auto",
        spaceBetween: 25,
        }

    },   
    speed: 800,
    scrollbar: {
        el:".reviews__scrollbar",
        dragClass: "reviews__drag-scroll",
		hide: false,
		dragSize: 60,
		draggable: true
    },
});
const ArticlesSlider = new Swiper('.new-articles__slider',{
    loop:true,
    // Navigation arrows
    navigation: {
        nextEl: '.block-header__arrow--new-articles-right',
        prevEl: '.block-header__arrow--new-articles-left',
    },
    observer: true,
    observeParents: true,
    slidesPerView: 3,
    spaceBetween: 30,
    // Responsive breakpoints
    breakpoints: {
        // when window width is >= 480px
        320: {
        slidesPerView: 1,
        spaceBetween: 20
        },
        520:{
            slidesPerView: 2,
            spaceBetween: 20 
        },
        768:{
            slidesPerView: 2.5,
            spaceBetween: 20 
        },
        // when window width is >= 992px
        991.98: {
        slidesPerView: 3,
        spaceBetween: 30,
        }

    },
    //autoHeight: true,
    speed: 800,
})


const priceRange = document.querySelector('.filter-price__range');
if(priceRange){
    const priceRangeInputs = document.querySelectorAll('.filter-price__input');
	const formatForSlider = {
		from: function (formattedValue) {
			return Number(formattedValue);
		},
		to: function (numericValue) {
			return Math.round(numericValue);
		}
	}; 
noUiSlider.create(priceRange, {
    start: [0, 100],
    connect: true,
    format:formatForSlider,
    range: {
        'min': 0,
        'max': 100
    }
});
priceRange.noUiSlider.on('update', function (values,handle){
    priceRangeInputs[handle].value = values[handle];
})
priceRangeInputs.forEach((priceRangeInput,index) =>{
    priceRangeInput.addEventListener('change',function(){
        priceRange.noUiSlider.setHandle(index,this.value);
    })
})
}


