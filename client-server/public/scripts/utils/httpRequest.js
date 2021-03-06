class HttpRequest {

    static get(url, params = {}) {
        return HttpRequest.request('GET', url, params);
    }

    static delete(url, params = {}) {
        return HttpRequest.request('DELETE', url, params);
    }

    static put(url, params = {}) {
        return HttpRequest.request('PUT', url, params);
    }

    static post(url, params = {}) {
        return HttpRequest.request('POST', url, params);
    }

    static request(method, url, params = {}) {

        return new Promise ((resolve, reject) => {
            let ajax = new XMLHttpRequest();
            
            console.log('Linha 24 '+method.toUpperCase() +' '+url);

            ajax.open(method.toUpperCase(), url);

            ajax.onerror = event => {
                reject(obj);
            };
            
            ajax.onload = event => {
                let obj = {};
                
                try{
                    obj = JSON.parse(ajax.responseText);
                } catch (e) {
                    reject(e);
                    console.log(e);
                    console.log(ajax.responseText);
                }

                resolve(obj);
            }
            ajax.setRequestHeader('Content-Type', 'application/json');
            ajax.send(JSON.stringify(params));
        })
        
    }
}