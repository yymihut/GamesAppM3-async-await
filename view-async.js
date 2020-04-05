const hook = document.querySelector('ul');
const modal = document.querySelector('.modal');
const deleteBtnModal = document.querySelector('#confirmDeleteModal')
const submitBtn = document.getElementById("submit");
const saveBtn = document.querySelector('.save btn btn-default');
const refreshBtn = document.getElementById("refresh");

function createDomElement(gameObject) {
    const gameElement = document.createElement('div');
    gameElement.setAttribute('class', 'posts');
    gameElement.setAttribute('id', gameObject._id);
    gameElement.innerHTML = `<div class="content"><h1>${gameObject.title}</h1>
                            <div class="title">                                
                                <img src="${gameObject.imageUrl}">
                                <p>${gameObject.description}</p>
                             </div>                             
                             <div class="action">
                                <button type="button" class="delete-btn" data-toggle="modal" 
                                data-target="#confirmDeleteModal">Delete</button>
                                <button type="button" class="update-btn" data-toggle="modal" 
                                data-target=".modal">Update Game</button> 
                             </div></div><br>`;
    hook.appendChild(gameElement);
}

refreshBtn.addEventListener('click', createDomElements);

hook.addEventListener('click', event => {
    const gameId = event.target.closest('ul > div').id;
    deleteBtnModal.setAttribute('caller', gameId)
    modal.setAttribute('rel', gameId);

    if (event.target.classList == 'update-btn') {
        const div = document.getElementById(`${gameId}`);
        const gameTitle = document.getElementById('modalGameTitle');
        const gameDescription = document.getElementById('modalGameDescription');
        const gameImageUrl = document.getElementById('modalGameImageUrl');

        gameTitle.value = div.querySelector('.content > h1').textContent;
        gameDescription.value = div.querySelector('.title > p').textContent;
        gameImageUrl.value = div.querySelector('.title > img').src;

    }
});

modal.addEventListener('click', event => {
    const modalBody = document.querySelector('.modal-body');
    const gameTitle = modalBody.querySelector("#modalGameTitle");
    const gameDescription = modalBody.querySelector("#modalGameDescription");
    const gameImageUrl = modalBody.querySelector("#modalGameImageUrl");
    console.log(modal.getAttribute('rel'))
    if (event.target.classList == 'save btn btn-default') {
        if (gameTitle.value !== "" && gameImageUrl.value !== ""
            && gameDescription.value !== "") {
            let urlencoded = new URLSearchParams();
            urlencoded.append("title", gameTitle.value);
            urlencoded.append("imageUrl", gameImageUrl.value);
            urlencoded.append("description", gameDescription.value);
            console.log('inside save buton modal : ' + gameDescription.value)
            updateGameRequest(urlencoded, modal.getAttribute('rel'));
            gameTitle.value = '';
            gameImageUrl.value = '';
            gameDescription.value = '';
        }
    };
})

deleteBtnModal.addEventListener('click', event => {
    if (event.target.classList == 'btn btn-danger') {
        console.log(deleteBtnModal.getAttribute('caller'))
        const gameId = deleteBtnModal.getAttribute('caller');
        console.log(gameId)
        deleteApiDomElements(gameId);
        removeDomElement(document.getElementById(`${gameId}`));
    }
});

function updateDom(apiResponse, gameObjectId) {
    const div = document.getElementById(`${gameObjectId}`);
    div.querySelector('h1').innerText = apiResponse.title;
    div.querySelector('p').innerText = apiResponse.description;
    div.querySelector('img').innerText = apiResponse.imageUrl;
}

function removeDomElement(domElement) {
    domElement.remove()
}

submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const gameTitle = document.getElementById('gameTitle');
    const gameDescription = document.getElementById('gameDescription');
    const gameGenre = document.getElementById('gameGenre');
    const gamePublisher = document.getElementById('gamePublisher');
    const gameImageUrl = document.getElementById('gameImageUrl');
    const gameRelease = document.getElementById('gameRelease');

    validateTextOnly(gameTitle, "Please enter a valid Game Title!");
    validateTextOnly(gameDescription, "Please enter a valid description of the Game !");
    validateTextOnly(gameGenre, "The genre is required!");
    validateTextOnly(gamePublisher, "Please enter a valid Publisher");
    validateGameImageUrl(gameImageUrl, "The image URL is required!, provide a valid one pls !");
    validateReleaseTimestampElement(gameRelease, "The release date you provided is not a valid timestamp!");
    let checkForSpan = !(document.querySelector('form > span'));
    if (checkForSpan && gameTitle.value !== "" && gameGenre.value !== "" && gameImageUrl.value !== "" && gameRelease.value !== "") {

        let urlencoded = new URLSearchParams();
        urlencoded.append("title", gameTitle.value);
        urlencoded.append("releaseDate", gameRelease.value);
        urlencoded.append("genre", gameGenre.value);
        urlencoded.append("publisher", gamePublisher.value);
        urlencoded.append("imageUrl", gameImageUrl.value);
        urlencoded.append("description", gameDescription.value);
        console.log(urlencoded.values);
        createGameRequest(urlencoded);
    }
    clearInputs();
});

function validateTextOnly(inputElement, errorMessage) {
    const validText = /^[0-9-a-zA-Z\s]*$/;
    if (inputElement.value === "" || (!validText.test(inputElement.value))) {
        if (!document.querySelector(`[rel="${inputElement.id}"]`)) {
            buildErrorMessage(inputElement, errorMessage);
        }
    } else {
        deleteErrorMessage(inputElement);
    }
}

function validateGameImageUrl(inputElement, errorMessage) {
    const validUrl = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    if (inputElement.value === "" || (!validUrl.test(inputElement.value))) {
        if (!document.querySelector(`[rel="${inputElement.id}"]`)) {
            buildErrorMessage(inputElement, errorMessage);
        }
    } else {
        deleteErrorMessage(inputElement);
    }
}

function validateReleaseTimestampElement(inputElement, errorMessage) {
    if (inputElement.value === "" || (isNaN(inputElement.value))) {
        if (!document.querySelector(`[rel="${inputElement.id}"]`)) {
            buildErrorMessage(inputElement, errorMessage);
        }
    } else {
        deleteErrorMessage(inputElement);
    }
}

function clearInputs() {
    document.querySelector(".creationForm").reset()
}

function deleteErrorMessage(inputEl) {
    if (document.querySelector(`[rel="${inputEl.id}"]`)) {
        document.querySelector(`[rel="${inputEl.id}"]`).remove();
        inputEl.classList.remove("inputError");
    }
}

function buildErrorMessage(inputEl, errosMsg) {
    inputEl.classList.add("inputError");
    const errorMsgElement = document.createElement("span");
    errorMsgElement.setAttribute("rel", inputEl.id);
    errorMsgElement.classList.add("errorMsg");
    errorMsgElement.innerHTML = errosMsg;
    inputEl.after(errorMsgElement);
}