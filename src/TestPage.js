import React, { useState, useEffect, useRef } from 'react';
import Cvd19Hook from './utils/Cvd19Hook';
import { getInfos } from './utils/Sotong';
const electron = require('electron')
const fs = require('fs');
const path = require('path');
const fetch = require('electron').remote.require('electron-fetch').default;



const TestPage = () => {
  const [list, setData] = Cvd19Hook();
  const [stduents, setStudents] = useState([]);
  const [neis, setNeis] = useState([]);
  const [time, setTime] = useState();
  const ref = useRef();
  const [info, setInfo] = useState({
    teacher: '',
    code: '',
    grade: '',
    classNum: '',
    group: '',
    id: '',
    password: '',
  })
  const userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'user.json');
  const studentPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'student.json');

  useEffect(() => {
    try {
      setInfo(JSON.parse(fs.readFileSync(userDataPath)));
      setNeis(JSON.parse(fs.readFileSync(studentPath)));
    }
    catch (error) {
      console.log(error);
    }
  }, [])

  const timmerSet = () => {
    if (ref.current) clearInterval(ref.current);
    else { setData(info.teacher, info.code, info.grade, info.classNum); }
    ref.current = setInterval(() => {
      setData(info.teacher, info.code, info.grade, info.classNum);
      console.log('test');
    }, time * 1000 * 60);
  }

  const sendMessage = (name) => {
    console.log(name, stduents);
    //GPM_NAME, GPM_PHONE
    const target = stduents.filter(st => st.GPM_NAME.replace(' ', '') === name)
    console.log(target);

  }
  /*
   getInfos({ id: info.id, group: info.group }).then(r => {
              setStudents(r);
            });
            fs.writeFileSync(userDataPath, JSON.stringify(info));
            setData(info.teacher, info.code, info.grade, info.classNum);
            // setData('박성준', 'g8naew', '2', '1')
  */
  return (
    <div>
      <input id="time" type='number' value={time ? time : ''} style={{ width: '100%' }} placeholder="자동갱신(단위:분)" onChange={e => setTime(e.target.value)}></input>
      <button className={`button is-fullwidth is-small ${ref.current?'is-info':'is-primary'}`} onClick={
        timmerSet
      }>{ref.current?'자동갱신중...':'자동갱신하기'}</button>
      
      {list.map(d => {
        return <div key={d.num}
          style={{ borderStyle: 'solid', display: 'flex', borderRadius: '.5em', margin: '.2em' }}>
          {d.data[0] === '' && <>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, verticalAlign: 'middle' }}>
              <span style={{ height: 'auto' }} >{d.num.length === 2 ? d.num : '0' + d.num}번</span>
              <span style={{ display: 'inline-block', textAlign: 'center', paddingLeft: '.5em', minWidth: '80px' }}>{d.name}</span>
              <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'center', color: 'purple', margin: 'auto' }}>결과없음</span>
            </div>
            <div style={{ display: 'inline', alignItems: 'right' }}>
              <button className="button is-small is-info" onClick={() => sendMessage(d.name)}>재촉하기</button>
              <button className="button is-small is-danger">확인됌</button>
            </div>
          </>
          }
          {d.data[0] === '1' && <>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, verticalAlign: 'middle' }}>
              <span style={{ height: 'auto' }} >{d.num.length === 2 ? d.num : '0' + d.num}번</span>
              <span style={{ display: 'inline-block', textAlign: 'center', paddingLeft: '.5em', minWidth: '80px' }}>{d.name}</span>
              <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'center', color: 'green', margin: 'auto' }}>등교가능</span>
            </div>
            <div style={{ display: 'inline', alignItems: 'right' }}>
              <button className="button is-small is-info " disabled>재촉하기</button>
              <button className="button is-small is-danger" disabled>확인됌</button>
            </div>
          </>
          }
          {d.data[1] === '1' && <>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, verticalAlign: 'middle' }}>
              <span style={{ height: 'auto' }} >{d.num.length === 2 ? d.num : '0' + d.num}번</span>
              <span style={{ display: 'inline-block', textAlign: 'center', paddingLeft: '.5em', minWidth: '80px' }}>{d.name}</span>
              <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'center', color: 'red', margin: 'auto' }}>등교중지</span>
            </div>
          </>
          }

        </div>
      })}
    </div >
  )
}

export default TestPage;