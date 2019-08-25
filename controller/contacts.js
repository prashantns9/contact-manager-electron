const { ipcRenderer } = require('electron');

function sendLaunchRequest(mode, index) {
    ipcRenderer.send("launchContactWindow", mode, index);
}

function sendDeleteRequest(index) {
    if (confirm('Are you sure?')) {
        ipcRenderer.send('contact:delete', index);
    }
}

function updateContactsList(contacts) {
    contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = null;
    contacts.forEach((contact, index) => {
        //create card
        var listItem = document.createElement("div");
        listItem.setAttribute('class', 'card contact-card');

        listItem.innerHTML = `
        <div class="card-body">
            <div class="row">
                <div class="col-3">  
                    <div class="avatar">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
                <div class="col-9">
                    <div class="contact-info">
                        <strong>`+ contact.firstName + ` ` + contact.lastName + `</strong>
                        <br/>
                        <small>
                            <i class="fas fa-briefcase" style="margin-right: 1rem"></i>`+ contact.company + `
                        </small>
                        <br/>
                        <small>
                            <i class="fas fa-envelope" style="margin-right: 1rem"></i>`+ contact.email + `
                        </small>
                        <br/>
                        <small>
                            <i class="fas fa-phone" style="margin-right: 1rem"></i>`+ contact.phone + `
                        </small>
                    </div>
                    <div class="float-right style="margin-top: 1rem">
                        <small class="action-btn" onclick="sendLaunchRequest('edit',`+ index + `)">
                            <i class="fas fa-pen"></i>&nbsp;Edit
                        </small>

                        <small class="action-btn" onclick="sendDeleteRequest(`+ index + `)">
                            <i class="fas fa-trash-alt"></i>&nbsp;Delete
                        </small>
                    </div>
                </div>
            </div>
        </div>
        `;

        contactsList.appendChild(listItem);
    });
}

ipcRenderer.on('renderContactsView', function (e, contacts) {
    updateContactsList(contacts);
});

window.addEventListener('load', function () {
    ipcRenderer.send('requestToRender:contacts');
}, false);