import React, { useEffect, useState } from 'react';
const electron = require('electron')
const fs = require('fs');
const path = require('path');

const SetupPage = () => {
  const userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'user.json');
  const studentPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'student.json');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    teacher: '',
    code: '',
    grade: '',
    classNum: '',
    group: '',
    id: '',
    password: '',
  })
  const [txt, setText] = useState('');

  useEffect(() => {
    try {
      setInfo(JSON.parse(fs.readFileSync(userDataPath)));
    }
    catch (error) {
      console.log(error);
    }
  }, []);

  const inputHandler = (e) => {
    const { id, value } = e.target
    setInfo(prev => {
      return { ...prev, [id]: value }
    })
  }

  const parseAndSave = () => {
    setLoading(true);
    const neisData = txt.split('\n').map(dd => {
      const d = dd.split('\t');
      return {
        name: d[2],
        code: d[11],
        url: d[15],
      }
    })
    fs.writeFileSync(userDataPath, JSON.stringify(info));
    fs.writeFileSync(studentPath, JSON.stringify(neisData));
    setLoading(false);
  }
  return (
    <div>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">교사이름</label>
            <input className="input" type="text" placeholder="교사이름" id="teacher" onChange={inputHandler} value={info.teacher}></input>
            <label className="label">인증코드</label>
            <input className="input" type="text" placeholder="인증코드" id="code" onChange={inputHandler} value={info.code}></input>
            <div className="columns is-mobile">
              <div className="column" >
                <label className="label">학년</label>
                <input className="input" type="number" placeholder="학년(숫자만)" id="grade" onChange={inputHandler} value={info.grade}></input>
              </div>
              <div className="column">
                <label className="label">반</label>
                <input className="input" type="number" placeholder="반(숫자만)" id="classNum" onChange={inputHandler} value={info.classNum}></input>
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column" >
                <label className="label">소통아이디</label>
                <input className="input" placeholder="아이디" id="id" onChange={inputHandler} value={info.id}></input>
              </div>
              <div className="column">
                <label className="label">소통패스워드</label>
                <input className="input" placeholder="소통알리미 패스워드" id="password" onChange={inputHandler} value={info.password}></input>
              </div>
              <div className="column">
                <label className="label">소통그룹</label>
                <input className="input" placeholder="우리반그룹명" id="group" onChange={inputHandler} value={info.group}></input>
              </div>
            </div>
          </div>
        </form>
        <div className="field">
          <label className="label">나이스에서 받은 학생 코드 및 링크</label>
          <textarea style={{ width: '100%' }} rows={10} placeholder onChange={e => setText(e.target.value)} ></textarea>
        </div>
        <div>
          <button className={`button is-fullwidth is-primary ${loading?'is-loading':''}`}  onClick={parseAndSave}>데이터 저장하기</button>
        </div>
      </div>
    </div>
  )
}

export default SetupPage;