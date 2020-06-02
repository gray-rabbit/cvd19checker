const fetch = require('electron').remote.require('electron-fetch').default;


const autoInput = async ({ url }) => {
    let cookie;
    let result = await fetch(encodeURI(url), {
        method: 'GET',
    })
    const raw = result.headers.raw()['set-cookie']
    console.log(raw);
    cookie = raw.map(el => {
        const temp = el.split(';');
        return temp[0];
    }).join(';');
    const k = url.split('k=')[1];
    

    result = await fetch('https://eduro.cbe.go.kr/stv_cvd_co01_000.do', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie':cookie,
        },
        body: `rtnRsltCode=SUCCESS&qstnCrtfcNoEncpt=${k}&schulNm=&stdntName=&rspns01=1&rspns02=1&rspns07=0&rspns08=0&rspns09=0`
    })
    result = await result.json();
    return result['resultSVO']['rtnRsltCode'];
    // result = await fetch('https://eduro.cbe.go.kr/stv_cvd_co02_000.do', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //         'Referer': url,
    //         'Cookie':cookie,
    //     },
    //     body: `rtnRsltCode=SUCCESS&qstnCrtfcNoEncpt=${url}&schulNm=${encodeURI('송면초등학교')}&stdntName=${encodeURI('박도윤')}&rspns01=1&rspns02=1&rspns07=0&rspns08=0&rspns09=0`
    // })

    console.log(result.status);
}

export { autoInput };