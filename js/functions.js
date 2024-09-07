"use strict"
// Модуль "Спойлери"
export function spoilers(){
    const spoilerArray = document.querySelectorAll('[data-spoilers]');

    if(spoilerArray.length > 0){
        
        document.addEventListener('click',setSpoilerAction);
        // получение обычных спойлеров 
        const spoilersRegular = Array.from(spoilerArray).filter(function(item,index,self){
            return !item.dataset.spoilers.split(',')[0];
        })
        // инициализация обычных спойлеров
        if (spoilersRegular.length > 0){
            initSpoilers(spoilersRegular);
        }
        // Отримання слойлерів з медіа-запитами
        let mediaQuiesArray = dataMediaQueries(spoilerArray,'spoilers');
        if(mediaQuiesArray && mediaQuiesArray.length){
            mediaQuiesArray.forEach(mediaQuiesItem =>{
                // Подія
                mediaQuiesItem.matchMedia.addEventListener('change',function(){
                    initSpoilers(mediaQuiesItem.spoilersArray,mediaQuiesItem.matchMedia);
                })
                initSpoilers(mediaQuiesItem.spoilersArray,mediaQuiesItem.matchMedia);
            })
        }
    }
    // Ініціалізація
    function initSpoilers(spoilersArray,matchMedia = false){
        spoilersArray.forEach(spoilerBlock =>{
            spoilerBlock = matchMedia ? spoilerBlock.item : spoilerBlock;
            if(matchMedia.matches || !matchMedia){
                spoilerBlock.classList.add('_spoiler-init');
                initSpoilerBody(spoilerBlock)
            } else{
                spoilerBlock.classList.remove('_spoiler-init');
                initSpoilerBody(spoilerBlock,false);
            }
        })
    }
    // Робота с контентом
    function initSpoilerBody(spoilerBlock,hideSpoilerBody = true){
        let spoilerItems = spoilerBlock.querySelectorAll('details');
        if(spoilerBlock.dataset.oneSpoiler === ""){
            spoilerItems = Array.from(spoilerItems).filter(item => item.closest('[data-spoilers]') === spoilerBlock);
        }
        if(spoilerItems.length ){
            spoilerItems.forEach(spoilerItem =>{
                let spoilerTitle = spoilerItem.querySelector('summary');
                if(hideSpoilerBody){
                    spoilerTitle.removeAttribute('tabindex');
                    if(!spoilerItem.hasAttribute('data-open')){
                        spoilerItem.open = false;
                        spoilerTitle.nextElementSibling.hidden = true;
                    } else {
                        spoilerItem.open = true;
                        spoilerTitle.classList.add('_spoiler-active');
                    }
                } else {
                    spoilerTitle.setAttribute('tabindex','-1');
                    spoilerTitle.classList.remove('_spoiler-active');
                    spoilerItem.open = true;
                    spoilerTitle.nextElementSibling.hidden = false;
                }
            })
        }
        const spoilerTitles = spoilerBlock.querySelectorAll('summary');
        if(spoilerTitles.length > 0){
            spoilerTitles.forEach(spoilerTitle =>{
                if(hideSpoilerBody){
                    spoilerTitle.removeAttribute('tabindex');
                    if(!spoilerTitle.closest('details').open){
                        spoilerTitle.nextElementSibling.hidden = true;
                    } else {
                        spoilerTitle.setAttribute('tabindex','-1');
                        spoilerTitle.nextElementSibling.hidden = false;
                    }
                }
            })
        }
    }
}
// Модуль "Показати ще"
export function showMore(){
    window.addEventListener("load",function(e){
        // Знаходимо постійні "показати ще" блоки
        const showMoreBlocks = document.querySelectorAll('[data-showmore');
        let showMoreBlocksRegular;
        if(showMoreBlocks.length){
            showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function(item,index,self){
                return !item.dataset.showmoreMedia;
            })
            // Ініціалізуємо їх
            showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular): null;
            document.addEventListener('click',showMoreActions);
            window.addEventListener("resize", showMoreActions);
        }

        // Перебираємо всі знайдені блоки та виконуємо ініціалізацію 
        // (matchMedia прапорець необхідний для подальшої реазілації блоків з медіа запитом) НЕ УДАЛЯТЬ
        function initItems(showMoreBlocks,matchMedia){
            showMoreBlocks.forEach(showMoreBlock => {
                initItem(showMoreBlock,matchMedia);
            });
        }
        // Ініціалізація "блоків показати ще"
        function initItem(showMoreBlock,matchMedia = false){
            showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
            let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content');
            let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button');
            showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
			showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
            const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
            if(matchMedia.matches || !matchMedia){
                if(hiddenHeight < getOriginalHeight(showMoreContent)){
                    _slideUp(showMoreContent,0,showMoreBlock.classList.contains('_showmore-active')? getOriginalHeight(showMoreContent) :hiddenHeight);
                    showMoreButton.hidden = false;
                } else {
                    _slideDown(showMoreContent,0,hiddenHeight);
                    showMoreButton.hidden = true;
                }
            } else {
                _slideDown(showMoreContent,500,hiddenHeight);
                showMoreButton.hidden = true;
            }
        }
        // size - за розміром
        // items - за кіл-тю елементів У СПИСКУ
        function getHeight(showMoreBlock, showMoreContent){
            let hiddenHeight = 0;
            const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
            const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
            // Сховати За кількістю елементів 
            if(showMoreType === "items"){
                const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
                const showMoreItems = showMoreContent.children;
                for(let index = 1; index < showMoreItems.length; index++){
                    const showMoreItem = showMoreItems[index - 1];
                    const itemMarginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
                    const itemMarginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;;
                    hiddenHeight += showMoreItem.offsetHeight + itemMarginTop;
                    if(index == showMoreTypeValue) break;
                    hiddenHeight += itemMarginBottom;
                }
                rowGap ? hiddenHeight += rowGap * (showMoreTypeValue - 1):null;
            } else{
                // Сховати за висотою
                const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
                hiddenHeight = showMoreTypeValue;
            }
            return hiddenHeight;
        }
        function getOriginalHeight(showMoreContent){
            let parentHidden;
            let hiddenHeight = showMoreContent.offsetHeight;
            showMoreContent.style.removeProperty('height');
            if (showMoreContent.closest(`[hidden]`)) {
				parentHidden = showMoreContent.closest(`[hidden]`);
				parentHidden.hidden = false;
			}
            let originalHeight = showMoreContent.offsetHeight;
			parentHidden ? parentHidden.hidden = true : null;
			showMoreContent.style.height = `${hiddenHeight}px`;
			return originalHeight;
        }

        function showMoreActions(e){
            const targetEvent = e.target;
            const targetType = e.type;
            if( targetType === "click"){
                if(targetEvent.closest(`[data-showmore-button]`)){
                    const showMoreButton = targetEvent.closest(`[data-showmore-button]`);
                    const showMoreBlock = showMoreButton.closest('[data-showmore]');
                    const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
                    const showMorespeed = showMoreButton.dataset.showmoreButton ? showMoreButton.dataset.showmoreButton : '500';
                    const hiddenHeight = getHeight(showMoreBlock,showMoreContent);
                    if(!showMoreContent.classList.contains('_slide')){
                        showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent,showMorespeed,hiddenHeight) : _slideDown(showMoreContent,showMorespeed,hiddenHeight);
                        showMoreBlock.classList.toggle('_showmore-active');
                    }
                }
            }   else if(targetType === "resize"){
                showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                // mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
            }
        }
    })
}

function setSpoilerAction(e){
    const el = e.target;
    if(el.closest('summary') && el.closest('[data-spoilers]')){
        e.preventDefault()
        if(el.closest('[data-spoilers]').classList.contains('_spoiler-init')){
            const spoilerTitle = el.closest('summary');
            const spoilerItem = spoilerTitle.closest('details');
            const spoilerBlock = spoilerItem.closest('[data-spoilers]');
            const accordion = spoilerBlock.hasAttribute('data-accordion');

            if(!spoilerBlock.querySelectorAll('._slide').length){
                if(accordion && !spoilerItem.open){
                    hideSpoilerBody(spoilerBlock);
                }
                !spoilerItem.open ? spoilerItem.open = true :  setTimeout(() => {spoilerItem.open = false},500);
                
                spoilerTitle.classList.toggle('_spoiler-active');
                _slideToggle(spoilerTitle.nextElementSibling,500);
            }
        }
    }
}
function hideSpoilerBody(spoilersBlock){
    const spoilerActiveItem = spoilersBlock.querySelector('details[open]');
    
    if(spoilerActiveItem && !spoilersBlock.querySelectorAll('._slide').length){
        const spoilerActiveTitle = spoilerActiveItem.querySelector('summary');
        spoilerActiveTitle.classList.remove('_spoiler-active');
        _slideUp(spoilerActiveTitle.nextElementSibling,500);
        setTimeout(() => {spoilerActiveItem.open = false},500);
    }
}

export let _slideUp = (target,duration = 500,showmore = 0) => {
    if(!target.classList.contains('_slide')){
        target.classList.add("_slide");
        target.style.transitionProperty ='height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height =target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = showmore ? `${showmore}px`: '0px';
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() =>{
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty('height') : null;
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            !showmore ? target.style.removeProperty('overflow') : null;
            target.style.removeProperty('transition-property');
            target.style.removeProperty('transition-duration');
            target.classList.remove('_slide');
        },duration)
    }
}
export let _slideDown = (target,duration = 500,showmore = 0) => {
    if(!target.classList.contains('_slide')){
        target.classList.add("_slide");
        if(target.hidden){
            target.hidden = false;
        }
        showmore ? target.style.removeProperty('height') : null;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = showmore ? `${showmore}px`: '0px';
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty ='height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height =height + 'px';
        
        
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');        
        
        window.setTimeout(() =>{
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-property');
            target.style.removeProperty('transition-duration');
            target.classList.remove('_slide');
        },duration)
    }
}
export let _slideToggle = (target,duration = 500) =>{
    if(target.hidden){
        return _slideDown(target,duration);
    } else {
        return _slideUp(target,duration);
    }

}


// Обробка медіа запитів з атрибутів 
function dataMediaQueries(array,dataValue){
    // получение спойлеров с медиа запросами
    const media = Array.from(array).filter(function(item,index,self){
        if(item.dataset[dataValue]){
            return item.dataset[dataValue].split(',')[0];
        }
        
    })
    //  Инициализация спойлеров с медиа  запросами
    if (media.length > 0){
        const breakpointsArray = [];
        media.forEach(item =>{
            const params = item.dataset[dataValue];
            const breakpoint = {};
            const paramsArray = params.split(',');
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1]? paramsArray[1].trim(): 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        })
        // получаем уникальные брейкпоинты
        let mediaQueries = breakpointsArray.map(function(item){
            return '(' + item.type + '-width:' + item.value + 'px),' + item.value + ',' + item.type;
        })  
        mediaQueries = uniqueArray(mediaQueries);
        const mediaQueriesArray = [];
        if (mediaQueries.length){
            // Работаем с каждым брейкпоинтом
            mediaQueries.forEach( breakpoint => {
                const paramsArray = breakpoint.split(',');
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0])

                //Объекты с нужными условиями
                const spoilersArray = breakpointsArray.filter(function(item){
                    if( item.value === mediaBreakpoint && item.type === mediaType){
                        return true;
                    }
                })
                mediaQueriesArray.push({
                    spoilersArray,
                    matchMedia
                })
            });
            return mediaQueriesArray;
        }
    }
}
// Унікалізація значень массиву
function uniqueArray(array){
    return array.filter(function(item,index,self) {
        return self.indexOf(item) === index;
    })
}


