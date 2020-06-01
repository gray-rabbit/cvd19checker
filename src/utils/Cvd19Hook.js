import { useState, useEffect, useCallback } from 'react';
const fetch = require('electron').remote.require('electron-fetch').default;


function formToString(obj) {
    let str = [];
    Object.keys(obj).map(key => {
        str.push(`${key}=${obj[key]}`)
        return key;
    })
    return str.join('&');
}


const data = {
    qstnCrtfcNoEncpt: '',
    pName: encodeURIComponent(''),
    qstnCrtfcNo: ''
}
const Cvd19Hook = () => {
    const [list, setList] = useState([]);
 
    const setData = useCallback((name, code, g, c) => {
        if (name === '' || code === '') return;
        const str = formToString({ ...data, qstnCrtfcNo: code, pName: encodeURI(name) })
        let cookie;
        fetch('https://eduro.cbe.go.kr/stv_cvd_co00_011.do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: str
        }).then(async r => {
            const raw = r.headers.raw()['set-cookie']
            cookie = raw.map(el => {
                const temp = el.split(';');
                return temp[0];
            }).join(';');

            return r.json();

        }).then(r => {
            const link = r['resultSVO']['data']['qstnCrtfcNoEncpt'].substr(1);
            console.log(r['resultSVO']['data']);
            return fetch(`https://eduro.cbe.go.kr/stv_cvd_co03_000.do?k=${link}`, {
                method: 'GET',
                headers: {
                    cookie
                }
            })
        }).then(r => {
            return r.text();
        }).then(r => {
            let result;
            let test = r.match(/\s+<td class="alignC">[1-6]학년<\/td>[\s]+<td class="alignC">\s+[\d]+반\s+<\/td>\s+[\s\<a-z\>\d명\/]+%/g);
            test.map(data => {
                let temp = data.match(`${g}학년`)
                if (!temp) return data;
                temp = data.match(`${c}반`)
                if (!temp) return data;
                const grade = data.match(`${g}학년`)[0][0];
                const classNum = data.match(`${c}반`)[0][0];
                const [total, current] = data.match(/[0-9]+명/g).map(d => d.replace('명', ''));
                result = { grade, classNum, total, current };
                return data;
            })
            console.log(g,c);
            const data = {
                rtnRsltCode: 'SUCCESS',
                schulCrseScCode: 2,
                srchBeginYmd: '2020.06.01',
                srchEndYmd: '2020.06.01',
                srchRspns0: '',
                srchRspns00: '',
                srchRspns01: '',
                srchRspns02: '',
                srchRspns07: '',
                srchRspns08: '',
                srchRspns09: '',
                srchRspns12: '',
                srchGrade: g,
                srchClassCode: `2/0/00/${g}/0000/${c.length===2?c:'0'+c}`,
            }
            return fetch(`https://eduro.cbe.go.kr/stv_cvd_co03_001.do`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    cookie,
                },
                body: formToString(data),
            })
        }).then(r => r.text())
            .then(r => {
                let result = r.split('<tbody>')[1].split('<tr>');
                result.shift();
                result = result.map(data => {
                    const bun = data.match(/"alignC">\d+<\/td/)[0].match(/\d+/)[0];
                    const name = data.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g)[2]
                    const dd = data.match(/<td>[\d]?<\/td>/g).map(t => t.replace('<td>', '').replace('</td>', ''));



                    return { num: bun, name, data: dd };
                })
                setList(result);
            });
    });

    return [list, setData]
    // return [list, setData]
}

export default Cvd19Hook;