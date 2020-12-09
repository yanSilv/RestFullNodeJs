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

        return new Promise ((resolver, reject) => {
            let ajax = new XMLHttpRequest();

            ajax.open(method.toUpperCase(), url);

            ajax.onerror = event => {
                reject(obj);
            };
            
            ajax.onload = event => {
                let obj = {};
                
                try{
                    obj = JSON.parse(ajax.responseText);
                } catch (e) {
                    reject(obj);
                    console.log(e);
                }

                resolver(obj);
            }

            ajax.send();
        })
        
    }
}