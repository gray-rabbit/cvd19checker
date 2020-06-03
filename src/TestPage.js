import React, { useState, useEffect, useRef } from 'react';
import Cvd19Hook from './utils/Cvd19Hook';
import { getInfos, sendSotong } from './utils/Sotong';
import { useHistory } from 'react-router-dom';
import { autoInput } from './utils/AutoInput'

const electron = require('electron')
const fs = require('fs');
const path = require('path');
const fetch = require('electron').remote.require('electron-fetch').default;



const TestPage = () => {
  const [list, setData] = Cvd19Hook();
  const [students, setStudents] = useState([]);
  const [neis, setNeis] = useState([]);
  const [time, setTime] = useState('');
  const [autoUpdate, setAutoUpdate] = useState(false);
  const ref = useRef();
  const history = useHistory();
  const [error, setError] = useState({ status: false, msg: '' });
  const [info, setInfo] = useState({
    teacher: '',
    code: '',
    grade: '',
    classNum: '',
    group: '',
    id: '',
    password: '',
    phone: ''
  })

  const userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'user.json');
  const studentPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'student.json');

  useEffect(() => {
    try {
      const teacher = JSON.parse(fs.readFileSync(userDataPath))
      setInfo(teacher);
      const t = JSON.parse(fs.readFileSync(studentPath));
      setNeis(t);

      if (t.length === 1) setError({ status: true, msg: 'NEIS 정보가 없습니다. ' })
      getInfos({ id: teacher.id, group: teacher.group }).then(r => {
        setStudents(r);
      }).catch(e => {
        if (t.length === 1) {
          setError({ status: true, msg: '소통알리미 정보를 받을 수 없습니다. NEIS 정보가 없습니다.' })
        } else {
          setError({ status: true, msg: '소통알리미 정보를 받을 수 없습니다. ' })
        }
      })
    }
    catch (error) {
      history.replace('/setting')
    }
  }, [history, userDataPath, studentPath])

  const timmerSet = () => {

    if (time === '') { return };
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
      setAutoUpdate(false);
      return;
    }
    console.log(info);
    setData(info.teacher, info.code, info.grade, info.classNum);
    ref.current = setInterval(() => {
      setData(info.teacher, info.code, info.grade, info.classNum);
    }, time * 1000 * 60);
    setAutoUpdate(true);

  }
  const autoClear = (name) => {
    if (neis.length === 1) return;
    const target = neis.filter(d => d.name === name)[0];
    console.log(target);
    autoInput({ url: target.url }).then(() => {
      setData(info.teacher, info.code, info.grade, info.classNum);
    });
    return;
  }
  const sendMessage = async (name) => {
    if (neis.length === 1) return;
    const target = students.filter(st => st.GPM_NAME.replace(' ', '') === name)
    const neisURL = neis.filter(d => d.name === name)[0]['url'];
    let sms = [];
    let push = [];
    let mix = [];
    target.map(d => {
      if (d.APP_INST === 1) {
        push.push(d.GPM_PHONE);
      } else {
        sms.push(d.GPM_PHONE);
      }
      mix.push(d.GPM_PHONE);
      return d;
    })
    console.log(push, sms, mix, neisURL);
    sendSotong({
      phoneNumber: info.phone,
      message: '다음 링크를 사용하여 자가검진에 참여해주세요!   ' + neisURL,
      title: '코로나 자가점진 안내',
      targetSMS: sms,
      targetSOTONG: push
    }).then(r => {
      console.log(r);
    }).catch(e => {
      console.log(e);
    })
  }
  const sendAll = async () => {
    if (error.status) return;
    list.map(async person => {
      if (person.data[0] === '') {
        if (neis.length === 1) return;
        const name = person.name;
        const target = students.filter(st => st.GPM_NAME.replace(' ', '') === name)
        const neisURL = neis.filter(d => d.name === name)[0]['url'];
        let sms = [];
        let push = [];
        let mix = [];
        target.map(d => {
          if (d.APP_INST === 1) {
            push.push(d.GPM_PHONE);
          } else {
            sms.push(d.GPM_PHONE);
          }
          mix.push(d.GPM_PHONE);
          return d;
        })
        console.log(push, sms, mix, neisURL);
        try {
          const result = await sendSotong({
            phoneNumber: info.phone,
            message: '다음 링크를 사용하여 자가검진에 참여해주세요!   ' + neisURL,
            title: '코로나 자가점진 안내',
            targetSMS: sms,
            targetSOTONG: push
          })
        } catch (e) {
          console.log(e);
        }

      } else {
        console.log("했음");
      }
      return person;
    })
  }
  return (
    <div>
      <div className="field has-addons">
        <div className="control" style={{ flex: '1' }}>
          <input id="time" className="input is-small " type='number' value={time ? time : ''} style={{ width: '100%' }} placeholder="자동갱신(단위:분)" onChange={e => setTime(e.target.value)}></input>
        </div>
        <div className="control">
          <button className={`button is-fullwidth is-small ${ref.current ? 'is-danger' : 'is-primary'}`} onClick={
            timmerSet
          }>{autoUpdate ? '자동갱신중...(해제하기)' : '자동갱신하기'}</button>
        </div>
      </div>
      {error.status && <div className="notification is-danger is-small" style={{ padding: '.5rem' }}>{error.msg}</div>}
      {list.length > 0 && !error.status && <button
        className="button is-fullwidth"
        style={{ margin: '.5rem' }}
        onClick={sendAll}
      >미제출자 모두 재촉하기</button>}
      {list.map(d => {
        return <div key={d.num}
          style={{ borderStyle: 'solid', display: 'flex', borderRadius: '.5em', margin: '.2em' }}>
          {d.data[0] === '' && <>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '.5em', flex: 1, verticalAlign: 'middle' }}>
              <span style={{ height: 'auto' }} >{d.num.length === 2 ? d.num : '0' + d.num}번</span>
              <span style={{ display: 'inline-block', textAlign: 'center', paddingLeft: '.5em', minWidth: '80px' }}>{d.name}</span>
              <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'center', color: 'purple', margin: 'auto' }}>결과없음</span>
            </div>
            <div style={{ display: 'inline', alignItems: 'right' }}>
              <button className="button is-small is-info" onClick={() => sendMessage(d.name)}>재촉하기</button>
              <button className="button is-small is-danger" onClick={() => autoClear(d.name)}>확인됌</button>
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
              <button className="button is-small is-info " disabled> 재촉하기</button>
              <button className="button is-small is-danger" disabled>확인!</button>
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