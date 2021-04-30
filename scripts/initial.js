'use strict';

// ustawienie opcji wyboru dla pol select
{
    const formElement = document.forms[searchMarsRoversCapturedPhotos].elements;

    const roverTypes = ['Curiosity','Opportunity','Spirit'];
    roverTypes.forEach( el => {
        formElement['rover-type'].insertAdjacentHTML('beforeend', 
        `<option value='${el.toLowerCase()}'>${el}</option>`)
    })
    
    const roverCameras = ['FHAZ','RHAZ','NAVCAM'];
    roverCameras.forEach( el => {
        formElement['camera-type'].insertAdjacentHTML('beforeend', 
        `<option value='${el.toLowerCase()}'>${el}</option>`)
    })

    // ustawienie maksymalenj daty do dzis
    formElement['taken-date-from'].setAttribute(
        'max',
        new Date().toISOString().split("T")[0]
    );
    formElement['taken-date-to'].setAttribute(
        'max',
        new Date().toISOString().split("T")[0]
    );
    // ustawienie minimalnej daty dla zakresu do
    formElement['taken-date-from'].addEventListener('change', (e) => {
        formElement['taken-date-to'].setAttribute(
            "min",
            e.target.valueAsDate.toISOString().split("T")[0]
        )
    } )
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
    // utworzenie wstepne siatki obrazow dla wygaszacza ekranu 
    (async () => {
        const screenSaverConatiner = document.getElementById('screen-saver-container-1');
        let actualGridSize = {
            rows: Math.ceil(window.innerHeight/screenSaverImageSize),
            columns: Math.ceil(window.innerWidth/screenSaverImageSize),
            numberOfImages: 0
        }
        actualGridSize.numberOfImages = actualGridSize.rows * actualGridSize.columns;
        screenSaverConatiner.style.gridTemplateRows = `repeat(${actualGridSize.rows},${100/actualGridSize.rows}%)`;
        screenSaverConatiner.style.gridTemplateColumns = `repeat(${actualGridSize.columns},${100/actualGridSize.columns}%)`;
        const [screenWidth,screenHeight] = [ window.innerWidth , window.innerHeight];
        
        const numberOfImages = Math.ceil(screenWidth / screenSaverImageSize) * Math.ceil(screenHeight / screenSaverImageSize);
    
        console.log(numberOfImages);
        for (let index = 0; index < numberOfImages; index++) {
            const img = document.createElement('img');
            img.alt = " ";
            img.src = "";
            //img.src = "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01004/opgs/edr/fcam/FLB_486615455EDR_F0481570FHAZ00323M_.JPG"
            screenSaverConatiner.appendChild(img);   
        }
    })();
    
    


}
