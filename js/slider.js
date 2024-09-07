function initSlider(){
    if(document.querySelector('.swiper')){
        new Swiper('.swiper',{
            loop:true,
            pagination:{
                el:'.swiper-pagination',
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
        })
    }
}
// initSlider();