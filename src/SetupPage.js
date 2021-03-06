import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
const electron = require('electron')
const fs = require('fs');
const path = require('path');

const SetupPage = () => {
  const userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'user.json');
  const studentPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'student.json');
  const [loading, setLoading] = useState(false);
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
    phone: '',
  })
  const [txt, setText] = useState('');

  useEffect(() => {
    try {
      setInfo({ ...info, ...JSON.parse(fs.readFileSync(userDataPath)) });
    }
    catch (error) {
      setError({ status: true, msg: '필수항목이 누락되었습니다.' })
    }
    try {
      setText(fs.readFileSync(studentPath));
    }
    catch (error) {
      console.log(error);
    }
  }, [userDataPath, studentPath]);

  const inputHandler = (e) => {
    const { id, value } = e.target
    setInfo(prev => {
      return { ...prev, [id]: value }
    })
  }

  const parseAndSave = () => {
    if (info.teacher === '' || info.code === '' || info.grade === "" || info.classNum === '') {
      setError({ status: true, msg: '필수항목이 누락되었습니다.' })
      return;
    }
    setLoading(true);
    try {
      const neisData = txt.split('\n').map(dd => {
        const d = dd.split('\t');
        return {
          name: d[2],
          code: d[11],
          url: d[15],
        }
      })
      setText(JSON.stringify(neisData));
      fs.writeFileSync(studentPath, JSON.stringify(neisData));
    } catch (error) {
      console.log(error);
    }
    fs.writeFileSync(userDataPath, JSON.stringify(info));
    setLoading(false);
    history.push('/');
  }
  return (
    <div>
      {error.status&&<div className="notification is-danger is-small" style={{ marginTop: '1rem' }}>{error.msg}</div>}
      <div className="box">
        <p>필수항목</p>
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
          </div>
        </form>
      </div>
      <div className="box">
        <p>선택항목(재촉하기용)</p>
        <div className="columns is-mobile">
          <div className="column" >
            <label className="label">소통알리미아이디</label>
            <input className="input" placeholder="아이디" id="id" onChange={inputHandler} value={info.id}></input>
          </div>
          <div className="column">
            <label className="label">소통알리미패스워드</label>
            <input className="input" placeholder="소통알리미 패스워드" id="password" onChange={inputHandler} value={info.password}></input>
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column">
            <label className="label">우리반그룹명</label>
            <input className="input" placeholder="우리반그룹명" id="group" onChange={inputHandler} value={info.group}></input>
          </div>
          <div className="column">
            <label className="label">선생님전화번호</label>
            <input className="input" type="number" placeholder="선생님 전화번호" id="phone" onChange={inputHandler} value={info.phone}></input>
          </div>
        </div>
        <div className="field">
          <label className="label">나이스에서 받은 학생 코드 및 링크(엑셀)</label>
          <textarea style={{ width: '100%' }} rows={3} value={txt} onChange={e => setText(e.target.value)} ></textarea>
        </div>
        <div>
          <button className={`button is-fullwidth is-primary ${loading ? 'is-loading' : ''}`} onClick={parseAndSave}>데이터 저장하기</button>
        </div >
      </div>
    </div >
  )
}

export default SetupPage;