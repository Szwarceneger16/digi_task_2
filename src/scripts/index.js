'use strict';

document.getElementById('searchMarsRoversCapturedPhotosFormSubmitButton').addEventListener(
    'click', 
    valdiateForm
);

// dodanie eventu do przelaczania pomiedzy stronami
document.getElementById('toogleViewButton').addEventListener(
    'click', 
    async (e) => {
        e.target.setAttribute('disabled',"");
        toggleViews()
        .then( () => e.target.removeAttribute('disabled') );
    }, false
); 

const openModal = function () {
    const showView = document.getElementById('showView');
    const modalElement = document.getElementById('myModal');
    const img = modalElement.firstElementChild.firstElementChild;

    const openModal = (url) => {
        modalElement.style.display = 'block';
        showView.classList.add('blur');
        img.src = url;
    }
    modalElement.addEventListener('click', (e) => {
        modalElement.style.display = "none";
        showView.classList.remove('blur');
    },false)

    return openModal;
}();

// funkcja sprawdzajaca poprawnosc formualrza
function valdiateForm() {
    const form = document.forms[searchMarsRoversCapturedPhotos];
    const formElements = form.elements;

    for (let index = 0; index < form.length; index++) {
        const element = formElements[index];
        
        if (!element.checkValidity()) {
            element.nextElementSibling.innerHTML = element.validationMessage;
        } else {
            element.nextElementSibling.innerHTML = "";
        } 
    }

    if (  !form.checkValidity() ) {
        return false;
    }

    toggleViews().then( () => form.reset() )
    
    processQueryForMRPApi(
        formElements['takenDateFrom'].valueAsDate,
        formElements['takenDateTo'].valueAsDate,
        Array.from(formElements['roverType'].selectedOptions).map( el => el.value ),
        Array.from(formElements['cameraType'].selectedOptions).map( el => el.value )
    )
    
}

// basket storage manager
const [addToBasket,removeFromBasket] = function () {
    const basketImagesGrid = document.getElementById('basket-images-grid');
    const selectImagesGrid = document.getElementById('select-images-grid');
    const clearBusketButton = document.getElementById('clear-basket-button');
    const checkoutBusketButton = document.getElementById('checkout-basket-button');

    let basketElementsCounter = 0;
    let blockAddingToBasket = false;
    window.basketElementsCounter = basketElementsCounter;

    const moveForwardMRPElementInBasket = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget.parentElement.parentElement;
        if(target == basketImagesGrid.lastElementChild) return;

        if (target.nextElementSibling == basketImagesGrid.lastElementChild) {
            const movedElement = basketImagesGrid.removeChild(target);
            basketImagesGrid.appendChild(movedElement);
        } else {
            const newNextSiblingElement = target.nextElementSibling.nextElementSibling;
            const movedElement = basketImagesGrid.removeChild(target);
            basketImagesGrid.insertBefore(movedElement,newNextSiblingElement);
        }
    }
    const moveBackwardMRPElementInBasket = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget.parentElement.parentElement;
        if(target == basketImagesGrid.firstElementChild) return;

        const newNextSiblingElement = target.previousElementSibling;
        const movedElement = basketImagesGrid.removeChild(target);
        basketImagesGrid.insertBefore(movedElement,newNextSiblingElement);
    }

    checkoutBusketButton.onclick = (e) => {
        lazyRemoveImagesFromGrid(selectImagesGrid);
        const imagesUrl = Array.from(basketImagesGrid.children).map( (el) => {
            return el.style.backgroundImage.slice(5,-2);
        })
        lazyRemoveImagesFromGrid(basketImagesGrid);
        startScreenSaver(imagesUrl);
    }

    clearBusketButton.onclick = (e) => {
        Array.from(basketImagesGrid.children).forEach( (element) => {
            takeFromBasketToSelectGrid(element.firstElementChild.firstElementChild);
            
        })
        checkoutBusketButton.setAttribute('disabled',"");
        clearBusketButton.setAttribute('disabled',"");
        blockAddingToBasket = false;
    }

    const countBasketElments = (direction) => {
        if( typeof direction !== "number") return;

        if (basketElementsCounter === 0) {
            if ( direction < 0) return;

            clearBusketButton.removeAttribute('disabled');
        }else if (basketElementsCounter === numberOfImagesToStartGrid - 1) {
            blockAddingToBasket = true;
            checkoutBusketButton.removeAttribute('disabled');
        }

        direction = direction > 0 ? basketElementsCounter++ : basketElementsCounter-- ;
        
        if (basketElementsCounter === 0) {
            clearBusketButton.setAttribute('disabled',"");
        } else if (basketElementsCounter === numberOfImagesToStartGrid - 1) {
            blockAddingToBasket = false;
            checkoutBusketButton.setAttribute('disabled',"");
        }
    } 

    const takeFromBasketToSelectGrid = (mrpCheckboxElement) => {
        countBasketElments(-1);
        let mrpImageElement = mrpCheckboxElement.parentElement.parentElement;
        mrpImageElement = mrpImageElement.parentElement.removeChild(mrpImageElement);
        mrpCheckboxElement.src = "./img/radio_button_unchecked.svg";
        //debugger;
        mrpCheckboxElement.onclick = handleCustomCheckBoxCheck;
        mrpImageElement.firstElementChild.removeChild(mrpCheckboxElement.nextElementSibling);
        mrpImageElement.firstElementChild.removeChild(mrpCheckboxElement.nextElementSibling);
        selectImagesGrid.appendChild(mrpImageElement);
    }
    const handleCustomCheckBoxUncheck = (e) => {
        e.preventDefault();
        e.stopPropagation();

        takeFromBasketToSelectGrid(e.target);
    }
    const handleCustomCheckBoxCheck = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if ( blockAddingToBasket) return;
        countBasketElments(1);
        let mrpImageElement = e.target.parentElement.parentElement;
        const mrpCheckboxElement = e.target;
        mrpImageElement = mrpImageElement.parentElement.removeChild(mrpImageElement);
        mrpCheckboxElement.src = "./img/radio_button_checked.svg";
        mrpCheckboxElement.insertAdjacentHTML(
            'afterend',
            `<img src="./img/arrow_back.svg">
            <img src="./img/arrow_forward.svg">`
        )
        mrpCheckboxElement.nextElementSibling.onclick = moveBackwardMRPElementInBasket;
        mrpCheckboxElement.nextElementSibling.nextElementSibling.onclick = moveForwardMRPElementInBasket;
        //debugger;
        mrpCheckboxElement.onclick = handleCustomCheckBoxUncheck;
        basketImagesGrid.appendChild(mrpImageElement);
    }
    
    return [handleCustomCheckBoxCheck,handleCustomCheckBoxUncheck];
}();


// funkcja wyswietlajaca obraz po uprzednim zaladowaniu
function displayLazyLoadingBoxes(e) {
    e.target.parentElement.style.display = "block";
}
// dodanie obrazow pobranych z MRP api do siatki
 const lazyAppendImagesToGrid = function () {
    const selectImagesGrid = document.getElementById('select-images-grid');
    return async function (imagesArray) {
        
        imagesArray.forEach( (el) => {
            const mainDiv = document.createElement('div');
            mainDiv.insertAdjacentHTML('beforeend',
                `<span class="custom-control-container">
                <img class="custom-checkbox" src="./img/radio_button_unchecked.svg">
                </span>
                <p>${el.name}</p>
                <p>${el.earth_date}</p>`
            );//<span class="custom-checkbox"><span class="material-icons">radio_button_unchecked</span></span>
            mainDiv.classList.add('mrp-api-image')
    
            // opzonione ladowanie i wyswieltanie po zaladowaniu
            let bgImg = new Image();
            bgImg.onload = function(e){
                mainDiv.style.display = 'grid';
                mainDiv.style.backgroundImage = /* bgImg; */'url(' + bgImg.src + ')';
                bgImg = null;
            };
            bgImg.src = el.img_src;
            mainDiv.onclick = () => { 
                openModal(el.img_src); 
            };
            mainDiv.firstElementChild.firstElementChild.onclick = addToBasket;
    
            selectImagesGrid.appendChild(mainDiv);
        })
    }
 }();


// usuniecie nie potrzebnych obrazow w celu zwolnienia pamieci
async function lazyRemoveImagesFromGrid(parentOfElementsToRemove) {
    Array.from(parentOfElementsToRemove.children).forEach( el => {
        parentOfElementsToRemove.removeChild(el);
    })

}

function startScreenSaver(imagesUrlArray) {
    const screenSaverConatiner = document.getElementById('screen-saver-container-1');
    screenSaverConatiner.style.display = 'grid';
    // Array.from(screenSaverConatiner.children).forEach( (el,index) => {
    //     el.src = imagesUrlArray[Math.floor(Math.random()*(numberOfImagesToStartGrid -1))];
    //     el.style.animation
    // })
    const screenSaverConatinerChildreen = screenSaverConatiner.children;
    let counter = 0;

    let timerID;
    const addImageToConatiner = () => {
        const el = screenSaverConatinerChildreen[counter];
        const randomImageNumber = Math.floor(Math.random()*(numberOfImagesToStartGrid -1));
        el.src = imagesUrlArray[randomImageNumber];
        el.style.animation = `screen-saver-initial ${screenSaverInitialAnimationDurationTime}s linear 0s 1 reverse `;
        
        counter++;
        if (counter === screenSaverConatinerChildreen.length - 1) {
            clearInterval(timerID);
        }
    };
    timerID = setInterval( addImageToConatiner, 
        screenSaverInitialAnimationDurationTime*2000 + screenSaverInitialAnimationOffsetTime*1000);

    // const timerID = setTimeout( addImageToConatiner, screenSaverAnimationDurationTime*1000);
    // const addImageToConatiner = () => {
    //     const el = screenSaverConatinerChildreen[counter];
    //     el.src = imagesUrlArray[Math.floor(Math.random()*(numberOfImagesToStartGrid -1))];
    //     el.style.animation = `screen-saver-initial ${viewPageAniamtionDuration*0.5}s linear 0s 1 normal `;
    //     setTimeout( ()=> {
    //         el.style.animation = `screen-saver-initial ${viewPageAniamtionDuration*0.5}s linear 0s 1 reverse `;
    //         counter++;
    //         if (counter !== screenSaverConatinerChildreen.length - 1) {
    //             setTimeout( addImageToConatiner, screenSaverAnimationDurationTime*500);
    //         }
    //     }
    //     ,screenSaverAnimationDurationTime*500)

    // };
}

// pobieranie z mrp oraz ich asynchroncizne dodawanie do strony
const processQueryForMRPApi = function (appendImagesToGridFunction) {
    
    // funkcja pobierajaca obrazy z apod api
    // argument date: obiekt Date z data dla szukanego obrazu
    const getDataFromMRPApi = (earthDate,rover,camera,page=1) => {
        return fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?`+
            `api_key=${nasaKeyApi}`+
            `&earth_date=${earthDate.toISOString().split("T")[0]}`+
            `&camera=${camera}`+
            `${ page !== 1 ? `$page=${page}`: ''}`,
        {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit'
        })
        .then( res =>  res.json() )
        .then( res => {
            const cutedData = res.photos.map( (obj) => { 
                return { 
                    "img_src": obj.img_src,
                    "earth_date": obj.earth_date,
                    "name": obj.rover.name
                }
            })
            return { 
                page: page,
                data: cutedData
            }
        })
        .catch( err => {
            console.error(err);
        })
    }

    const incrementQueryDate = (queryDate) => {
        queryDate.setDate(queryDate.getDate() + 1);
    }

    const getEveryPageForQuery = async (queryDate,rover,camera) => {

        const getNextPage = async (pageCount) => {
            getDataFromMRPApi(queryDate,rover,camera,pageCount)
            .then( res => {
                appendImagesToGridFunction(res.data);
                if ( res.data.length !== 0 && res.data.length % 24 === 0) {
                    getNextPage(queryDate,rover,camera,res.page + 1)
                }
            });
        }
        getDataFromMRPApi(queryDate,rover,camera)
            .then( res => {
                appendImagesToGridFunction(res.data);
                if ( res.data.length !== 0 && res.data.length % 24 === 0) {
                    getNextPage(res.page + 1)
                }
            });

        //appendImagesToGridFunction(result);
        
        // while ( result.length !== 0 && result.length % 24 === 0) {
        //     pageCount++;
        //     getDataFromMRPApi(queryDate,rover,camera,pageCount)
        //     .then( res => appendImagesToGridFunction(result));
        // }

        // return result;
    }  

    return async function (dateFrom,dateTo,rovers,cameras) {
        if (!( dateFrom instanceof Date &&
            dateTo instanceof Date &&
            rovers instanceof Array &&
            cameras instanceof Array )
        ) return;
        const queryDate = new Date(dateFrom.getTime());

        // rovers.forEach(rover => {
        //     cameras.forEach( async camera => {
        //         await getEveryPageForQuery( queryDate,rover,camera)
        //         .catch( err => console.error(err) )
        //     });
        // });
        for (const rover of rovers) {
            for (const camera of cameras) {
                getEveryPageForQuery( queryDate,rover,camera)
                .catch( err => console.error(err) )
            }
        }
    
        while (queryDate.getDate() !== dateTo.getDate() ||
            queryDate.getMonth() !== dateTo.getMonth() ||
            queryDate.getFullYear() !== dateTo.getFullYear() 
        ) {
            incrementQueryDate(queryDate);
    
            // rovers.forEach(rover => {
            //     cameras.forEach( await async camera => {
            //         await getEveryPageForQuery( queryDate,rover,camera)
            //         .catch( err => console.error(err) )
            //     });
            // });
            for (const rover of rovers) {
                for (const camera of cameras) {
                    getEveryPageForQuery( queryDate,rover,camera)
                    .catch( err => console.error(err) )
                }
            }
        }
    }
}(lazyAppendImagesToGrid)


// animacja przejscia pomiedzy formualrzem a kalendarzem
async function toggleViews() {
    return new Promise(function(resolve, reject) {
        const queryViewElement = document.getElementById('queryView'),
        showViewElement = document.getElementById('showView');
    
        if (  window.getComputedStyle(queryViewElement, null).display === 'block' ) {
            queryViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s linear 0s 1 normal both`;     

            setTimeout( () => {
                queryViewElement.style.display = 'none';
                showViewElement.style.display = 'block';
                showViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s linear 0s 1 reverse both`;
                
                setTimeout( () => {
                    queryViewElement.style.animation = '';
                    showViewElement.style.animation = '';
                    resolve()
                }, viewPageAniamtionDuration*1000);
                
            },viewPageAniamtionDuration*1000)
        } else {
            showViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s linear 0s 1 normal both`;
            
            setTimeout( () => {
                showViewElement.style.display = 'none';
                queryViewElement.style.display = 'block';
                queryViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s linear 0s 1 reverse both`;
                
                setTimeout( () => {
                    showViewElement.style.animation = '';
                    queryViewElement.style.animation = '';
                    resolve()
                }, viewPageAniamtionDuration*1000);
            },viewPageAniamtionDuration*1000)
        }
    });
}