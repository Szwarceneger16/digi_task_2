'use strict';

// ustawienie opcji wyboru dla pol select
{
    const formElement = document.forms[searchMarsRoversCapturedPhotos].elements;

    const roverTypes = ['Curiosity','Opportunity','Spirit'];
    roverTypes.forEach( el => {
        formElement.roverType.insertAdjacentHTML('beforeend', 
        `<option value='${el.toLowerCase()}'>${el}</option>`)
    })
    
    const roverCameras = ['FHAZ','RHAZ','NAVCAM'];
    roverCameras.forEach( el => {
        formElement.cameraType.insertAdjacentHTML('beforeend', 
        `<option value='${el.toLowerCase()}'>${el}</option>`)
    })

    // ustawienie maksymalenj daty do dzis
    formElement.takenDateFrom.setAttribute(
        'max',
        new Date().toISOString().split("T")[0]
    );
    formElement.takenDateTo.setAttribute(
        'max',
        new Date().toISOString().split("T")[0]
    );
    // ustawienie minimalnej daty dla zakresu do
    formElement.takenDateFrom.addEventListener('change', (e) => {
        formElement.takenDateTo.setAttribute(
            "min",
            e.target.valueAsDate.toISOString().split("T")[0]
        )
    } )

    formElement['takenDateFrom'].valueAsDate = new Date(2021,3,4);
    formElement['takenDateTo'].valueAsDate = new Date(2021,3,9);
    formElement['roverType'].selectedIndex = 0;
    formElement['cameraType'].selectedIndex = 0;
    // Array.from(formElement['cameraType'].options).forEach( el => {
    //     el.selected = true;
    // });
}

// otwieranie/zamykanie widoku koszyka
{
    const openBasketButton = document.getElementById('open-basket-button');
    document.getElementById('checkout-basket-button').setAttribute('disabled','');
    document.getElementById('clear-basket-button').setAttribute('disabled','');
    const basketElement = document.getElementById('basket');

    const openBasket = () => {
        basketElement.style.display = 'block';
        openBasketButton.innerHTML = "Close Basket"
        openBasketButton.onclick = closeBasket;
    }
    const closeBasket = () => {
        basketElement.style.display = 'none';
        openBasketButton.innerHTML = "Open Basket";
        openBasketButton.onclick = openBasket;
    }
    openBasketButton.onclick = openBasket;  

}

{
    (async () => {
        const [screenWidth,screenHeight] = [ window.innerWidth , window.innerHeight];
        const screenSaverConatiner = document.getElementById('screen-saver-container-1')
    
        const numberOfImages = Math.round(screenWidth / screenSaverImageSize) * Math.round(screenHeight / screenSaverImageSize);
    
        console.log(numberOfImages);
        for (let index = 0; index < numberOfImages; index++) {
            const img = document.createElement('img');
            img.alt = " ";
            //img.src = "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01004/opgs/edr/fcam/FLB_486615455EDR_F0481570FHAZ00323M_.JPG"
            screenSaverConatiner.appendChild(img);   
        }
    })();
}
