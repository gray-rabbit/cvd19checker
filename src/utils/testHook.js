import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
const fetch = require('electron').remote.require('electron-fetch').default;
const TestHook = (value) => {
    const [render, setRender] = useState(value);
    useEffect(() => {
        console.log('test Hook init');
        const replayFunction = (event, args) => {
            console.log(args);
            console.log(event);
        }
        ipcRenderer.on('test-message-reply', replayFunction)

        fetch('https://google.com').then(r=>r.text()).then(r=>console.log(r));
        
        // ipcRenderer.send('fetch-get','https://google.com')
        return () => {
            ipcRenderer.removeListener('test-message-reply', replayFunction);
            console.log('test hook removed')
        }
    }, []);

    return render;
}

export default TestHook;