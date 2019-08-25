const { ipcRenderer } = require('electron');
var editMode = false;
var contactIndex = -1;

function sendContactData(e) {
    e.preventDefault();
    let contactDataToSend = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        company: document.querySelector('#company').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value

    }
    if (!editMode) {
        ipcRenderer.send('contact:create', contactDataToSend);
    } else {
        ipcRenderer.send('contact:edit', contactIndex, contactDataToSend);
    }
}

function updateContactDetails(contactDetails) {
    document.querySelector('#firstName').value = contactDetails.firstName;
    document.querySelector('#lastName').value = contactDetails.lastName;
    document.querySelector('#company').value = contactDetails.company;
    document.querySelector('#email').value = contactDetails.email;
    document.querySelector('#phone').value = contactDetails.phone;
}

ipcRenderer.on('renderContactDetailsView', function (e, contIndex, editM, contactDetails) {
    contactIndex = contIndex;
    editMode = editM;
    if (editM) {
        updateContactDetails(contactDetails);
    }
})

window.addEventListener('load', function () {
    ipcRenderer.send('requestToRender:contactDetails');
}, false)

const form = document.querySelector('form');
form.addEventListener('submit', sendContactData)