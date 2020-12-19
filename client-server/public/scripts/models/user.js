class User {
    constructor(name, gender, dateBirth, country, email, password, admin, photo) {
       this._id;
       this._name = name;
       this._gender = gender;
       this._dateBirth = dateBirth;
       this._country = country;
       this._email = email;
       this._password = password;
       this._admin = admin;
       this._photo = photo;
       this._register = new Date(); 
    }

    set id(value) {
        this._id = value;
    }

    get id() {
        return this._id;
    }

    get register () {
        return this._register;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get dateBirth () {
        return this._dateBirth;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get admin() {
        return this._admin;
    }

    get photo() {
        return this._photo;
    }

    set photo(value) {
        this._photo = value;
    }

    loadFromJSON(json) {
        for (let name in json) {
            switch(name) {
                case '_register':
                    this[name] = new Date(json[name]);
                break;
                default:
                    if(name.substring(0,1) ==='_') {
                        this[name] = json[name];
                    }
            }
        }
    }

    static getSessionStorage() {
        let users = [];
        if (localStorage.getItem("users")) {
            users = JSON.parse(localStorage.getItem("users"));
        }

        return users;
    }

    getNewID() {
        let userId = parseInt(localStorage.getItem("usersID"));
        if (!userId > 0) {
            userId = 0;
        }

        userId++;

        localStorage.setItem("usersID", userId);
        return userId;
            
    }

    toJSON() {
        let json = {};
        Object.keys(this).forEach(key => {
            if(this[key] !== undefined ) {
                json[key] = this[key];
            }
        });

        return json;
    }

    save() {
        return new Promise ((resolve, reject)=>{
            let promise;

            if (this.id) {
                promise = HttpRequest.put(`/users/${this.id}`, this.toJSON());
            } else {
                console.log('Linha 117 '+this.toJSON());
                promise = HttpRequest.post(`/users/`, this.toJSON());
            }

            promise.then(data => {
                this.loadFromJSON(data);
                resolve(this);
            }).catch(e=>{
                reject(e);
            });
        });
    }

    remove() {
        let users = User.getSessionStorage();
        users.forEach((userData, index) => {
            if(this._id == userData._id) {
                users.splice(index, 1);
            }
        });
        
        localStorage.setItem("users", JSON.stringify(users));
    }
}