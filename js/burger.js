const burgerBtn = document.querySelector('.icon-menu');
burgerBtn.addEventListener("click",()=>{
    document.body.classList.toggle('burger-open');
});

export default burgerBtn;