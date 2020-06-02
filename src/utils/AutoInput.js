const fetch = require('electron').remote.require('electron-fetch').default;


const autoInput = async ({ url }) => {
    let cookie;
    let result = await fetch(url, {
        method: 'GET',
    })
    const raw = result.headers.raw()['set-cookie']
    cookie = raw.map(el => {
        const temp = el.split(';');
        return temp[0];
    }).join(';');

    result = await fetch('https://eduro.cbe.go.kr/stv_cvd_co02_000.do', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie
        },
        body: `tnRsltCode=SUCCESS&qstnCrtfcNoEncpt=r3Y/0EZi8sF39yHj2oOztQ==&schulNm=&stdntName=&rspns01=1&rspns02=1&rspns07=0&rspns08=0&rspns09=0`
    })
    console.log(result.status);
}

export { autoInput };