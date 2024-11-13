var InRefresh = false;
var axiosController;
SESSIONCACHED = ''

function obtainAccessToken(username, password, callback) {
    var settings = {
       "url": HIT10URL + "/oauth/token",
       "method": "POST",
       "headers": {
           "Authorization": "Basic Y2F5ZGU6ejRvRHA4c0p2Ql5eaV5DQ3VvemlKVWVxc3dpNm4ydiM=",
           // "Authorization": "Basic am9hbzp6NG9EcDhzSnZCXl5pXkNDdW96aUpVZXFzd2k2bjJ2Iw",
           "Content-Type": "application/x-www-form-urlencoded",
       },
       "data": {
           "grant_type": "password",
           "username": username,
           "password": password
       }
    };
    $.ajax(settings)
    .done(function (response) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem('logged_in', '1');
        callback(200, {});
    })
    .fail(function (xhr) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem('logged_in');
        callback(xhr.status, xhr.responseJSON);
    });
}

function sendUrl(param, callback, item) {
    if (localStorage.getItem("access_token") == null) {
        callback(400, {}, item);
    } else {
        var settings = {
            url: param.url,
            method: param.metodo,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            data: param.envio
        };
        $.ajax(settings)
            .done(function (response) {
                callback(200, response, item);
            })
            .fail(function (response) {
                if (response.status === 401) {
                    renewAccessToken(param, callback, false, item);
                } else {
                    callback(response.status, response.responseText, item);
                }
            });
    }
}

function sendUrlAxios(settings, callback) {
    axios({
        url: settings.url,
        method: settings.method,
        data: settings.envio,
        async: settings.async
    })
    .then(response => {
        // Chama o callback com o status e a resposta
        callback(response.status, response.data);
    })
    .catch(error => {
        // Verifica se error.response existe
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : { userMessage: 'Erro desconhecido' };
        // Chama o callback com o status e a resposta de erro
        callback(status, data);
    });
}


function cancelAxiosRequest() {
    axiosController.abort();
}

function renewAccessToken(param, callback, axios, item) {
    if (localStorage.getItem("access_token") === null) {
        callback(400, {}, item);
    } else if(!InRefresh){
        InRefresh = true;
        var settingsCheck = {
            url: HIT10URL + "/checkbit",
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            data: {}
        };
        var valido = false;
        $.ajax(settingsCheck)
            .done(function () {
                valido = true;
            })
            .fail(function () {
                valido = false;
            });

        if (valido) {
            if(axios)
                sendUrlAxios(param, callback, item);
            else
                sendUrl(param, callback);
        } else {
            var settings = {
                url: HIT10URL + "/oauth/token",
                method: "POST",
                headers: {
                    "Authorization": "Basic Y2F5ZGU6ejRvRHA4c0p2Ql5eaV5DQ3VvemlKVWVxc3dpNm4ydiM=",
                    // "Authorization": "Basic am9hbzp6NG9EcDhzSnZCXl5pXkNDdW96aUpVZXFzd2k2bjJ2Iw",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: {
                    "grant_type": "refresh_token",
                    "refresh_token": localStorage.getItem("refresh_token")
                }
            };
            $.ajax(settings)
                .done(function (response) {
                    localStorage.setItem("access_token", response.access_token);
                    localStorage.setItem("refresh_token", response.refresh_token);
                    InRefresh = false;
                    if(axios)
                        sendUrlAxios(param, callback, item);
                    else
                        sendUrl(param, callback);
                })
                .fail(function () {
                    if (window.location.href.indexOf(Root + "/index.html?id=tas-42") < 0) {
                        window.location.href = Root + "/index.html?id=tas-42";
                    } else {
                        callback(400, {}, item);
                    }
                });
        }
    }else if(InRefresh){
        setTimeout(function(){
            if(axios)
                sendUrlAxios(param, callback, item);
            else
                sendUrl(param, callback);
        }, 1000);
    }
}

function storageChange(event) {
    if (event.key === 'logged_in') {
        window.location.href = Root + "/index.html?id=tas-42";
    }
}

function confirmLogin(){
    var settings = {
        url: HIT10URL + "/check",
        metodo: "GET",
        envio: "",
        async: false
    };
    sendUrl(settings,confirmLoginCallBack);
}

function confirmLoginCallBack(status, response){
    if(status == 400)
        window.location.href = Root + "/index.html?id=tas-42";
}

window.addEventListener('storage', storageChange);
