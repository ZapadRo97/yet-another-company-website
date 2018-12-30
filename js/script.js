/*let request = new XMLHttpRequest();

request.open('GET', '/navigation.html', true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        document.querySelector('#div').innerHTML = request.responseText;
    }
};

request.send();*/

function onFormSubmit() {

    let nameField = document.querySelector("input[name='firstname']");
    let lastNameField = document.querySelector("input[name='lastname']");

    if(! (nameField.value === "" || lastNameField.value === "")) {

        let req = new XMLHttpRequest();
        req.open("POST", "#", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(nameField.name + "=" + nameField.value + "&" + lastNameField.name + "=" + lastNameField.value);

        alert("Form submitted");
    }

    return true;
}