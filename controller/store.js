const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
    constructor() {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        this.path = path.join(userDataPath, 'contactsData.json');
        this.data = parseDataFile(this.path, { contacts: [] });
    }

    retrieveAll() {
        return this.data.contacts;
    }

    create(val){
        this.data.contacts.push(val);
        fs.writeFileSync(this.path,JSON.stringify(this.data));
    }

    retrieve(index){
        return this.data.contacts[index];
    }

    update(index,val){
        this.data.contacts[index] = val;
        fs.writeFileSync(this.path,JSON.stringify(this.data));
    }

    delete(index){
        this.data.contacts.splice(index,1);
        fs.writeFileSync(this.path,JSON.stringify(this.data));
    }
}

function parseDataFile(filePath, defaults) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        return defaults;
    }
}

// expose the class
module.exports = Store;