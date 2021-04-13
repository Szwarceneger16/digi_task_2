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

// obsluga modala
{
    const modal = document.getElementById("myModal");
    // modal.getElementsByClassName('modal-close')[0].addEventListener('click', (e) => {
    //     e.preventDefault();
    //     modal.style.display = "none";
    // },false)

    modal.addEventListener('click', (e) => {
        modal.style.display = "none";
    },false)
}

{
    // const selectImagesGrid = document.getElementById('selectImagesGrid');
    // Array(20).fill().forEach( (el,ind) => {
    //     selectImagesGrid.insertAdjacentHTML(
    //         'beforeend',
    //         `<div></div>`
    //         )
    // })
}

// otwieranie/zamykanie wiodku koszyka
{
    const openBasketButton = document.getElementById('open-basket-button');
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
