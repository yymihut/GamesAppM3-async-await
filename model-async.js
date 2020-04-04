let apiUrl = "https://games-world.herokuapp.com"

function sendRequest(method, url, data) {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
           if (method == 'GET'|| method == 'PUT' || method == 'POST'){
               return response.json();
           } else if (method == 'DELETE'){
               return response.text();
           }            
        } else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error('Something went wrong - server-side.');
            });
        }
    }).catch(error => {
        console.log(error);
        throw new Error('Something went wrong!');
    });
}

async function createDomElements() {
    try {
        const responseData = await sendRequest(
            'GET', apiUrl + '/games');
        const arrayGameResponse = responseData;
        hook.innerHTML = '';
        for (let i = 0; i < arrayGameResponse.length; i++) {
            createDomElement(arrayGameResponse[i]);
        };
    } catch (error) {
        alert(error.message);
    }
}

async function deleteApiDomElements(gameId) {
    console.log('responseData.text()');
    try {
        const responseData = await sendRequest(
            'DELETE', apiUrl + '/games/' + gameId);
        console.log(responseData);
    } catch (error) {
        alert(error.message);
    }
}

async function updateGameRequest(gameObject, id) {
    console.log('responseData.text()');
    try {
        const responseData = await sendRequest(
            'PUT', apiUrl + '/games/' + id, gameObject);
        console.log(responseData);
        updateDom(responseData, id);
    } catch (error) {
        alert(error.message);
    }
}

async function createGameRequest(gameObject) {
    console.log('responseData.text()');
    try {
        const responseData = await sendRequest(
            'POST', apiUrl + '/games', gameObject);
        console.log(responseData);
        createDomElement(responseData);
    } catch (error) {
        alert(error.message);
    }
}