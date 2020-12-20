class UserContrller{
    constructor(formIdCreate,formIdUpdate, tableId) {
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdate = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onEdit();
        console.log('Teste');
        this.selectAll();
    }

    onSubmit(){
        this.formEl.addEventListener("submit", (event) => {
            let btn = this.formEl.querySelector("[type=submit]");
            event.preventDefault();
            btn.disabled = true;
            let values = this.getValue(this.formEl);
            
            if (!values) {
                return false;
            }
            //console.log('Linha 21 ');
            //console.log(values);
            this.getPhoto(this.formEl).then(
                (content)=>{
                    values.photo = content;
                    values.save().then(user=>{
                        this.addLine(user);
                        this.formEl.reset();
                        btn.disabled = false;
                    });  
                },
                (e)=>{
                    console.error(e);
                });
        });
    }

    onEdit(){
        this.formUpdate.addEventListener("submit", (event)=>{
            let btn = this.formUpdate.querySelector("[type=submit]");
            event.preventDefault();
            btn.disabled = true;
            let values = this.getValue(this.formUpdate);
 
            let index = this.formUpdate.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            let userOld =  JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);
            
            this.getPhoto(this.formUpdate).then(
                (content)=>{
                    if(!values.photo){
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    let user = new User();
                    user.loadFromJSON(result);
                    user.save().then(user => {
                        this.getTr(user, tr);
                        
                        this.updateCount();
                        this.formUpdate.reset();
                        btn.disabled = false;
                        this.onClosed();
                    });
                },
                (e)=>{
                    console.error(e);
            });
        });
    }

    onClosed() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
        this.formEl.reset();
        this.formUpdate.reset();
    }

    getPhoto(formEl){
        return new Promise ((resolve, reject)=>{
            let fileReader = new FileReader();
    
            let element = [...formEl.elements].filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });
            
            let file = element[0].files[0];
    
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
    
            fileReader.onerror = (e) => {
                reject(e);
            }

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }

        });
    }

    getValue(formId) {
        
        let formEl = formId;
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function(field, index){
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == 'gender') {
                if(field.checked)
                    user[field.name] = field.value;
            } else if(field.name == 'admin'){
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            return false;
        }
        return new User(user.name,
                            user.gender, 
                            user.dateBirth, 
                            user.country, 
                            user.email, 
                            user.password, 
                            user.admin, 
                            user.photo);
    }

    addLine(dataUser){
        let tr = this.getTr(dataUser);
        this.tableEl.appendChild(tr);
        this.updateCount();
    }

    getTr(dataUser, tr = null) {

        if(tr === null) {
            tr = document.createElement('tr');
        }
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML= `
            
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)?'Sim':'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn-edit btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn-delete btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
           
        `;
        this.addEventsTR(tr);
        return tr;
    }

    addEventsTR(tr) {
        tr.querySelector(".btn-delete").addEventListener("click", e=>{
            if(confirm("Deseja realmente excluir?")) {
                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                //console.log('Linha Deletando usuario');
                user.remove().then(data=>{
                    tr.remove();
                    this.updateCount();
                });
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user);
        
            this.formUpdate.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json) {
                let field = this.formUpdate.querySelector("[name="+name.replace("_", "")+"]");

                if (field) {
                    switch(field.type) {
                        case 'file':
                            continue;
                        break;
                        case 'radio':
                            field = this.formUpdate.querySelector("[name="+name.replace("_", "")+"][value="+json[name]+"]");
                            field.checked = true;
                        break;
                        case 'checkbox':
                            field.checked = json[name];
                        break;
                        default:
                            field.value = json[name];
                    }
                }
            }
            this.formUpdate.querySelector(".photo").src = json._photo;
            document.querySelector("#box-user-create").style.display = "none";
            document.querySelector("#box-user-update").style.display = "block";

        });
    }

    updateCount() {
        let numberUser = 0;
        let numberAdmin = 0;
        
        [...this.tableEl.children].forEach(tr=>{
            numberUser++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin) {
                numberAdmin++;
            }

        });

        document.querySelector("#number-users").innerHTML = numberUser;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }

    selectAll(){

        User.getSessionStorage().then(data=> {
            data.users.forEach(dataUser=>{

                let user = new User();
    
                user.loadFromJSON(dataUser);
    
                this.addLine(user);
    
            });
        });
    }
}