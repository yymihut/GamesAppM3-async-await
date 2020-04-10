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
            if (method == 'GET' || method == 'PUT' || method == 'POST') {
                return response.json();
            } else if (method == 'DELETE') {
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

function createDomElements() {
    sendRequest('GET', apiUrl + '/games').then(responseData => {
        hook.innerHTML = '';
        for (let i = 0; i < responseData.length; i++) {
            createDomElement(responseData[i]);
        };
    })
}

function deleteApiDomElements(gameId) {
    sendRequest('DELETE', apiUrl + '/games/' + gameId).then(responseData => {
        console.log(responseData)        
    });
}

function updateGameRequest(gameObject, id) {
    sendRequest('PUT', apiUrl + '/games/' + id, gameObject).then(responseData => {
        console.log(responseData);
        updateDom(responseData, id);
    });
}

function createGameRequest(gameObject) {
    sendRequest('POST', apiUrl + '/games', gameObject).then(responseData => {
        console.log(responseData);
        createDomElement(responseData);
    });
}