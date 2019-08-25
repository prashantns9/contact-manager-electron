//imports and declarations
const electron = require('electron');
const path = require('path');
const url = require('url');
const { app, BrowserWindow, Menu, ipcMain } = electron;

const Store = require('./controller/store.js');

const mainMenuTemplate = require('./model/menuTemplate');

let contactsWindow;
let contactDetailsWindow;

let contactDetailsMode = 'View';
let selectedContact;
let selectedContactIndex = -1;

let store = new Store();

app.on('ready', function () {
    contactsWindow = new BrowserWindow({
        height: 800,
        width: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });
    contactsWindow.loadURL(url.format({
        pathname: path.join(__dirname, './view/contacts.html'),
        protocol: 'file:',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('launchContactWindow', function (e, mode, index) {
    contactDetailsMode = mode;
    if (index != -1) {
        selectedContact = store.retrieve(index);
    } else {
        selectedContact = null;
    }
    selectedContactIndex = index;

    contactDetailsWindow = new BrowserWindow({
        height: 600,
        width: 500,
        webPreferences: {
            nodeIntegration: true

        }
    });
    contactDetailsWindow.loadURL(url.format({
        pathname: path.join(__dirname, './view/contact-details.html'),
        protocol: 'file:',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});


ipcMain.on('contact:create', function (e, item) {
    contactDetailsWindow.close();
    store.create(item);
    renderContacts();
})

ipcMain.on('contact:edit', function (e, index, contactData) {
    contactDetailsWindow.close();
    store.update(index, contactData);
    renderContacts();
})

ipcMain.on('contact:delete', function (e, index) {
    store.delete(index);
    renderContacts();
})

ipcMain.on('requestToRender:contacts', function (e, item) {
    renderContacts();
})

ipcMain.on('requestToRender:contactDetails', function (e, item) {
    renderContactDetails();
})

function renderContacts() {
    let contacts = store.retrieveAll();
    contactsWindow.webContents.send('renderContactsView', contacts);
}

function renderContactDetails() {
    contactDetailsWindow.webContents.send('renderContactDetailsView', selectedContactIndex, contactDetailsMode == 'edit', selectedContact);
}
