/*var name = document.querySelector('#exampleInputName');
var gender = document.querySelectorAll('#form-user-create [name=gender]:checked');
var dateBirth = document.querySelector('#exampleInputBirth');
var parents = document.querySelector('#exampleInputCountry');
var email = document.querySelector('#exampleInputEmail');
var pass  = document.querySelector('#exampleInputPassword');
var admin = document.querySelector('#exampleInputAdmin');

name.value = 'Yan Silva';
gender.value = true;
dateBirth.value = '13/08/1984';
parents.value = 'Brasil';
email.value = 'jaguaryan@gmail.com'
pass.value = '123456';*/

let userConstroller = new UserContrller("form-user-create","form-user-update", "table-users");
userConstroller.onSubmit();

function onClosed() {
    userConstroller.onClosed();
}




