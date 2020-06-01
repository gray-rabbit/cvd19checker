import React, { useState, useEffect } from 'react';
import Cvd19Hook from './utils/Cvd19Hook';
const electron = require('electron')
const fs = require('fs');
const path = require('path');
const fetch = require('electron').remote.require('electron-fetch').default;



const TestPage = () => {
  const [list, setData] = Cvd19Hook();
  const [stduents, setStudents] = useState([]);
  const [sotong, setSotong] = useState({
    group: '2학년',

  })
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

  useEffect(() => {
    try {
      setInfo(JSON.parse(fs.readFileSync(userDataPath)));
    }
    catch (error) {
      console.log(error);
    }
  }, [])

  const inputHandler = (e) => {
    const { id, value } = e.target
    setInfo(prev => {
      return { ...prev, [id]: value }
    })
  }
  const test = () => {
    let USL_CODE;
    fetch('https://infosys.cbe.go.kr/cbe/getUserInfo.ajax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `A_UID=${info.id}&A_UPW=${info.password}`
    }).then(r => r.json())
      .then(r => {
        USL_CODE = r[0].USL_CODE; //학교 나이스 아이디 가져온다.
        return fetch('https://infosys.cbe.go.kr/cbe/selectGroup.ajax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: `NEIS_CODE=${USL_CODE}`
        })
      }).then(r => r.json())
      .then(r => {
        r = r.filter(d => {

          const temp = d.GROUP_NM.replace(' ', '');
          const temp2 = sotong.group.replace(' ', '');
          return temp === temp2;
        })[0]
        const GROUP_ID = r["GROUP_ID"];
        return fetch('https://infosys.cbe.go.kr/cbe/selectGroupMember.ajax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: `NEIS_CODE=${USL_CODE}&GROUP_ID=${GROUP_ID}&SEARCH_TEXT=&SEARCH_TYPE=`
        })
      }).then(r => r.json())
      .then(r => {
        console.log(r);
      })
      ;


  }
  return (
    <div>
      <div className="box">
        <button className="button is-fullwidth" onClick={test}>클릭</button>
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
      </div>

      <button className="button is-fullwidth is-primary" onClick={
        () => {
          fs.writeFileSync(userDataPath, JSON.stringify(info));
          setData(info.teacher, info.code, info.grade, info.classNum);
          // setData('박성준', 'g8naew', '2', '1')
        }
      }>불러오기</button>
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
              <button className="button is-small is-info">재촉하기</button>
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