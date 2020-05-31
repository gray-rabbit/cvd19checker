import React, { useState } from 'react';
import Cvd19Hook from './utils/Cvd19Hook';

const TestPage = () => {
  const [list, setData] = Cvd19Hook();
  const [info, setInfo] = useState({
    teacher: '박성준',
    code: 'g8naew',
    grade: '2',
    classNum: '1'
  })

  const inputHandler = (e) => {
    const { id, value } = e.target
    setInfo(prev => {
      return { ...prev, [id]: value }
    })
  }
  console.log('ㅅㄷㄴㅅ');
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
          </div>
        </form>
      </div>

      <button className="button is-fullwidth is-primary" onClick={
        () => {
          // setData(info.teacher, info.code, info.grade, info.classNum);
          setData('박성준', 'g8naew', '2', '1')
        }
      }>불러오기</button>
      {list.map(d => {
        return <div key={d.num}
          style={{ borderStyle: 'solid', display: 'flex', borderRadius: '.2em', margin: '.2em' }}>
          {d.data[0] === '' && <>
            <div style={{ display:'flex',alignItems:'center',flex: 1,verticalAlign:'middle' }}>
              <span style={{height:'auto'}} >{d.num}번</span>
              <span style={{ display: 'inline-block', textAlign: 'center', paddingLeft: '.5em', minWidth: '80px' }}>{d.name}</span>
              <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'center', color: 'purple' }}>결과없음</span>
            </div>
            <div style={{ display: 'inline', alignItems: 'right' }}>
              <button className="button is-small is-info">재촉하기</button>
              <button className="button is-small is-danger">확인됌</button>
            </div>
          </>
          }
           {d.data[0] === '1' && <>
            <div style={{ display:'flex',alignItems:'center',flex: 1,verticalAlign:'middle' }}>
              <span style={{height:'auto'}} >{d.num}번</span>
              <span style={{ display: 'inline-block', textAlign: 'center', paddingLeft: '.5em', minWidth: '80px' }}>{d.name}</span>
              <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'center', color: 'green' }}>등교가능</span>
            </div>
          </>
          }
          {d.data[1] === '1' && <>
            <div style={{ display:'flex',alignItems:'center',flex: 1,verticalAlign:'middle' }}>
              <span style={{height:'auto'}} >{d.num}번</span>
              <span style={{ display: 'inline-block', textAlign: 'center', paddingLeft: '.5em', minWidth: '80px' }}>{d.name}</span>
              <span style={{ display: 'inline-block', minWidth: '100px', textAlign: 'center', color: 'red' }}>등교중지</span>
            </div>
          </>
          }

        </div>
      })}
    </div >
  )
}

export default TestPage;