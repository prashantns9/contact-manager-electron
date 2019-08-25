const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Exit',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Developer Tools',
        submenu: [
            {
                label:'Open',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }

]

module.exports = mainMenuTemplate;