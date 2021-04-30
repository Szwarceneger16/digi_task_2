'use strict';

// dodanie eventu dla przycisku do obslugi formualrza
document.getElementById('search-mars-rovers-captured-photos-form-submit-button').addEventListener(
    'click', 
    valdiateForm
);

// dodanie eventu do przelaczania pomiedzy stronami
document.getElementById('toogle-view-button').addEventListener(
    'click', 
    async (e) => {
        e.target.setAttribute('disabled',"");
        toggleViews()
        .then( () => e.target.removeAttribute('disabled') );
    }, false
); 

// obsluga otworzenia i zamkniecia modalu powiekszajacego fotografie
const openModal = function () {
    const showView = document.getElementById('show-view');
    const modalElement = document.getElementById('main-mrpimage-modal');
    const img = modalElement.firstElementChild.firstElementChild;

    const openModal = (url) => {
        modalElement.style.display = 'flex';
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
    
    // pobranie wszytskich obrazow dla podanych danych
    processQueryForMRPApi(
        formElements['taken-date-from'].valueAsDate,
        formElements['taken-date-to'].valueAsDate,
        Array.from(formElements['rover-type'].selectedOptions).map( el => el.value ),
        Array.from(formElements['camera-type'].selectedOptions).map( el => el.value )
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

    // przesuniecie o jedna pozycje w przod elementu w koszyku
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
    // przesuniecie o jedna pozycje wstecz elementu w koszyku
    const moveBackwardMRPElementInBasket = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget.parentElement.parentElement;
        if(target == basketImagesGrid.firstElementChild) return;

        const newNextSiblingElement = target.previousElementSibling;
        const movedElement = basketImagesGrid.removeChild(target);
        basketImagesGrid.insertBefore(movedElement,newNextSiblingElement);
    }

    // zakacpetowanie ksozyka, start wygaszacza
    checkoutBusketButton.onclick = (e) => {
        lazyRemoveImagesFromGrid(selectImagesGrid);
        const imagesUrl = Array.from(basketImagesGrid.children).map( (el) => {
            return el.style.backgroundImage.slice(5,-2);
        })
        lazyRemoveImagesFromGrid(basketImagesGrid);
        startScreenSaver(imagesUrl);
    }

    // pelne wyczyszczenie koszyka
    clearBusketButton.onclick = (e) => {
        Array.from(basketImagesGrid.children).forEach( (element) => {
            takeFromBasketToSelectGrid(element.firstElementChild.firstElementChild);
            
        })
        checkoutBusketButton.setAttribute('disabled',"");
        clearBusketButton.setAttribute('disabled',"");
        blockAddingToBasket = false;
    }

    // funckja zliczajaca aktualna ilosc w koszyku , kontoler stanu
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

    // przeneisienie elementu z koszyka do siatki wyboru
    const takeFromBasketToSelectGrid = (mrpCheckboxElement) => {
        countBasketElments(-1);
        let mrpImageElement = mrpCheckboxElement.parentElement.parentElement;
        mrpImageElement = mrpImageElement.parentElement.removeChild(mrpImageElement);
        mrpCheckboxElement.src = "./img/radio_button_unchecked.svg";
        mrpCheckboxElement.onclick = handleCustomCheckBoxCheck;
        mrpImageElement.firstElementChild.removeChild(mrpCheckboxElement.nextElementSibling);
        mrpImageElement.firstElementChild.removeChild(mrpCheckboxElement.nextElementSibling);
        selectImagesGrid.appendChild(mrpImageElement);
    }
    // obsluga odznaczenia checkboxa
    const handleCustomCheckBoxUncheck = (e) => {
        e.preventDefault();
        e.stopPropagation();

        takeFromBasketToSelectGrid(e.target);
    }
    // obsluga zaznaczenia checboxa
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
            );
            mainDiv.classList.add('mrp-api-image')
    
            // opozonione ladowanie i wyswieltanie po pelnym zaladowaniu obrazu
            let bgImg = new Image();
            bgImg.onload = function(e){
                mainDiv.style.display = 'grid';
                mainDiv.style.backgroundImage = 'url(' + bgImg.src + ')';
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

// funkcja uruchamiajaca wygaszacz ekranu
const startScreenSaver = function () {
    const screenSaverConatiner = document.getElementById('screen-saver-container-1');
    // tablica url do wybranych obrazow
    let imagesUrlArray;

    // aktualne wymairy siatki z obrazami w wygaszaczu
    let actualGridSize = {
        rows: Math.ceil(window.innerHeight/screenSaverImageSize),
        columns: Math.ceil(window.innerWidth/screenSaverImageSize),
        numberOfImages: 0
    }
    actualGridSize.numberOfImages = actualGridSize.rows * actualGridSize.columns;

    const screenSaverConatinerChildreen = screenSaverConatiner.children;
    let counter = 0;
    let addImageToConatinerTimerID = undefined,randomImageAnimateTimerID;

    const windowSizeChangeHandler = (e) => {
        const [innerWidth,innerHeight] = [ window.innerWidth , window.innerHeight];
        const [rows,columns] = [
            Math.ceil(innerHeight/screenSaverImageSize),
            Math.ceil(innerWidth/screenSaverImageSize)
        ];
        const numberOfImages = rows * columns;

        //console.log(actualGridSize.rows , 'calcualted rows:'+rows , actualGridSize.columns ,'calcualted cols:'+ columns);

        if ( rows !== actualGridSize.rows) {
            actualGridSize.rows = rows;
            screenSaverConatiner.style.gridTemplateRows = `repeat(${rows},${100/rows}%)`;

        }
        if ( columns !== actualGridSize.columns) {
            actualGridSize.columns = columns;
            screenSaverConatiner.style.gridTemplateColumns = `repeat(${columns},${100/columns}%)`;

        }
        const subtractionNumberOfImages = numberOfImages - actualGridSize.numberOfImages;

        if (subtractionNumberOfImages > 0) {
            actualGridSize.numberOfImages = numberOfImages;
            for (let index = 0; index < subtractionNumberOfImages; index++) {
                const img = document.createElement('img');
                img.alt = " ";
                img.src = "";
                if ( typeof addImageToConatinerTimerID === 'string') {
                    const randomImageNumber = Math.floor(Math.random()*(numberOfImagesToStartGrid -1));
                    img.src = imagesUrlArray[randomImageNumber];
                }
                
                screenSaverConatiner.appendChild(img);   
            }
        } else if (subtractionNumberOfImages < 0) {
            actualGridSize.numberOfImages = numberOfImages;
            for (let index = 0; index < Math.abs( subtractionNumberOfImages); index++) {
                screenSaverConatiner.removeChild(screenSaverConatiner.lastChild);   
            }
        }
    }

    let previousRandomAnimatedElement = null;
    const randomImageAnimate = () => {
        if (previousRandomAnimatedElement) previousRandomAnimatedElement.style.animation = '';
        const randomImage = Math.floor( screenSaverConatinerChildreen.length * Math.random());
        const el = screenSaverConatinerChildreen[randomImage];
        previousRandomAnimatedElement = el;
        const randomImageNumber = Math.floor(Math.random()*(numberOfImagesToStartGrid -1));
        
        el.style.animation = `screen-saver ${screenSaverAnimationDurationTime*0.5}s linear 0s 2 alternate both`;
        el.style.onanimatioend =  () => {
            el.src = imagesUrlArray[randomImageNumber];
            el.style.animationIterationCount = 2;
            el.style.onanimatioend = null;

        }
    }

    // poczatkowa aniamcja ladujaca obrazy
    const addImageToConatinerAniamtion = () => {
        const el = screenSaverConatinerChildreen[counter];
        const randomImageNumber = Math.floor(Math.random()*(numberOfImagesToStartGrid -1));
        el.src = imagesUrlArray[randomImageNumber];
        el.style.animation = `screen-saver-initial ${screenSaverInitialAnimationDurationTime}s linear 0s 1 normal `;
        
        counter++;
        if (counter >= screenSaverConatinerChildreen.length ) {
            clearInterval(addImageToConatinerTimerID);
            addImageToConatinerTimerID = "";
            
            randomImageAnimateTimerID = setInterval(
                randomImageAnimate, 
                screenSaverAnimationDurationTime*1000 + screenSaverAnimationOffsetTime*1000);
        }

    };
    
    // obserwacja zmianu rozmairu okna
    window.onresize = windowSizeChangeHandler;

    return function (imagesUrls) {
        screenSaverConatiner.style.display = 'grid';
        document.body.style.overflow = 'hidden';
        imagesUrlArray = imagesUrls;
        addImageToConatinerTimerID = setInterval( 
            addImageToConatinerAniamtion, 
            screenSaverInitialAnimationDurationTime*1000 + screenSaverInitialAnimationOffsetTime*1000
        );
    }

}();

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

    // funckaj zwiekszajaca date o jeden dzien
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

    }  

    return async function (dateFrom,dateTo,rovers,cameras) {
        if (!( dateFrom instanceof Date &&
            dateTo instanceof Date &&
            rovers instanceof Array &&
            cameras instanceof Array )
        ) return;
        const queryDate = new Date(dateFrom.getTime());


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
        const createQueryViewElement = document.getElementById('create-query-view'),
        showViewElement = document.getElementById('basket-view');
    
        if (  window.getComputedStyle(createQueryViewElement, null).display === 'block' ) {
            // aniamcja wyjsciowa
            createQueryViewElement.style.animation = `toggleViewAniamtion ${togglePageAniamtionDuration}s 1 normal both`;    
            
            //aniamcja wejsciowa
            createQueryViewElement.onanimationend = () => {
                createQueryViewElement.style.display = 'none';
                createQueryViewElement.onanimationend = null;
                showViewElement.style.display = 'block';
                showViewElement.style.animation = `toggleViewAniamtion ${togglePageAniamtionDuration}s 1 reverse both`;
                
                showViewElement.onanimationend = () => {
                    createQueryViewElement.style.animation = '';
                    showViewElement.style.animation = '';
                    showViewElement.onanimationend = null;
                    resolve();
                };
                
            };
        } else {
            // aniamcja wyjsciowa
            showViewElement.style.animation = `toggleViewAniamtion ${togglePageAniamtionDuration}s 1 both`;
            
            //aniamcja wejsciowa
            showViewElement.onanimationend = () => {
                showViewElement.onanimationend = null;
                showViewElement.style.display = 'none';
                createQueryViewElement.style.display = 'block';
                createQueryViewElement.style.animation = `toggleViewAniamtion ${togglePageAniamtionDuration}s 1 reverse both`;
                
                createQueryViewElement.onanimationend = () => {
                    showViewElement.style.animation = '';
                    createQueryViewElement.style.animation = '';
                    createQueryViewElement.onanimationend = null;
                    resolve();
                };
            };
        }
    });
}