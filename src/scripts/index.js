'use strict';

window.addEventListener('DOMContentLoaded', (event) => {
    // dodanie obslugi formualrza dla rpzycisku submit
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
});

const modalElement = document.getElementById('myModal');
const img = modalElement.firstElementChild.lastElementChild;
function openModal(url) {
    modalElement.style.display = 'flex';
    img.src = url;   
}

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

    const takeFromBasketToSelectGrid = (mrpCheckboxElement) => {
        countBasketElments(-1);
        let mrpImageElement = mrpCheckboxElement.parentElement;
        mrpImageElement = mrpImageElement.parentElement.removeChild(mrpImageElement);
        mrpCheckboxElement.removeAttribute('checked');
        mrpCheckboxElement.onclick = handleCustomCheckBoxCheck;
        mrpImageElement.removeChild(mrpCheckboxElement.nextElementSibling);
        selectImagesGrid.appendChild(mrpImageElement);
    }

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

    clearBusketButton.onclick = (e) => {
        Array.from(basketImagesGrid.children).forEach( (element) => {
            takeFromBasketToSelectGrid(element.firstElementChild);
            
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
        }else if (basketElementsCounter === 9) {
            blockAddingToBasket = true;
            checkoutBusketButton.removeAttribute('disabled');
        }

        direction = direction > 0 ? basketElementsCounter++ : basketElementsCounter-- ;
        
        if (basketElementsCounter === 0) {
            clearBusketButton.setAttribute('disabled',"");
        } else if (basketElementsCounter === 9) {
            blockAddingToBasket = false;
            checkoutBusketButton.setAttribute('disabled',"");
        }
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
        let mrpImageElement = e.target.parentElement;
        const mrpCheckboxElement = mrpImageElement.firstElementChild;
        mrpImageElement = mrpImageElement.parentElement.removeChild(mrpImageElement);
        mrpCheckboxElement.setAttribute('checked','');
        mrpCheckboxElement.insertAdjacentHTML(
            'afterend',
            `<span class="custom-control-container">
            <p class="arrow left"><i></i></p><p class="arrow right"><i></i></p>
            </span>`//<span class="custom-position-indicator">0</span>
        )
        mrpCheckboxElement.nextElementSibling.firstElementChild.onclick = moveBackwardMRPElementInBasket;
        mrpCheckboxElement.nextElementSibling.lastElementChild.onclick = moveForwardMRPElementInBasket;
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
function appendImagesToGrid(imagesArray) {
    const selectImagesGrid = document.getElementById('select-images-grid');
    
    imagesArray.forEach( (el) => {
        const mainDiv = document.createElement('div');
        mainDiv.insertAdjacentHTML('beforeend',
            `<span class="custom-checkbox"></span>
            <p>${el.name}</p>
            <p>${el.earth_date}</p>`
        );
        mainDiv.classList.add('mrp-api-image')

        // opzonione ladowanie i wyswieltanie po zaladowaniu
        let bgImg = new Image();
        bgImg.onload = function(e){
            mainDiv.style.display = 'grid';
            mainDiv.style.backgroundImage = /* bgImg; */'url(' + bgImg.src + ')';
            bgImg = null;
        };
        bgImg.src = el.img_src;
        mainDiv.onclick = () => openModal(el.img_src) ;
        mainDiv.firstElementChild.onclick = addToBasket;

        selectImagesGrid.appendChild(mainDiv);
    })
}


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
            return res.photos.map( (obj) => { 
                return { 
                    "img_src": obj.img_src,
                    "earth_date": obj.earth_date,
                    "name": obj.rover.name
                }
            })
        })
        .catch( err => {
            console.error(err);
        })
    }

    const incrementQueryDate = (queryDate) => {
        queryDate.setDate(queryDate.getDate() + 1);
    }

    const getEveryPageForQuery = async (queryDate,rover,camera) => {
        let pageCount = 1;
        let result = await getDataFromMRPApi(queryDate,rover,camera);
        appendImagesToGridFunction(result);
        
        while ( result.length !== 0 && result.length % 24 === 0) {
            pageCount++;
            result = await getDataFromMRPApi(queryDate,rover,camera,pageCount);
            appendImagesToGridFunction(result);
        }

        return result;
    }  

    return function (dateFrom,dateTo,rovers,cameras) {
        if (!( dateFrom instanceof Date &&
            dateTo instanceof Date &&
            rovers instanceof Array &&
            cameras instanceof Array )
        ) return;
        const queryDate = new Date(dateFrom.getTime());

        rovers.forEach(rover => {
            cameras.forEach(camera => {
                getEveryPageForQuery( queryDate,rover,camera)
                .catch( err => console.error(err) )
            });
        });
    
        while (queryDate.getDate() !== dateTo.getDate() ||
            queryDate.getMonth() !== dateTo.getMonth() ||
            queryDate.getFullYear() !== dateTo.getFullYear() 
        ) {
            incrementQueryDate(queryDate);
    
            rovers.forEach(rover => {
                cameras.forEach(camera => {
                    getEveryPageForQuery( queryDate,rover,camera)
                    .catch( err => console.error(err) )
                });
            });
        }
    }
}(appendImagesToGrid)


// animacja przejscia pomiedzy formualrzem a kalendarzem
async function toggleViews() {
    return new Promise(function(resolve, reject) {
        const queryViewElement = document.getElementById('queryView'),
        showViewElement = document.getElementById('showView');
    
        if (  window.getComputedStyle(queryViewElement, null).display === 'block' ) {
            queryViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s 1 normal both`;     

            setTimeout( () => {
                queryViewElement.style.display = 'none';
                showViewElement.style.display = 'block';
                showViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s 1 reverse both`;
                
                setTimeout( () => {
                    queryViewElement.style.animation = '';
                    showViewElement.style.animation = '';
                    resolve()
                }, viewPageAniamtionDuration*1000);
                
            },viewPageAniamtionDuration*1000)
        } else {
            showViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s 1 both`;
            
            setTimeout( () => {
                showViewElement.style.display = 'none';
                queryViewElement.style.display = 'block';
                queryViewElement.style.animation = `toggleViewAniamtion ${viewPageAniamtionDuration}s 1 reverse both`;
                
                setTimeout( () => {
                    showViewElement.style.animation = '';
                    queryViewElement.style.animation = '';
                    resolve()
                }, viewPageAniamtionDuration*1000);
            },viewPageAniamtionDuration*1000)
        }
    });
}