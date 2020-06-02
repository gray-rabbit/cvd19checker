const fetch = require('electron').remote.require('electron-fetch').default;

const teacherInfo = {
    SCH_CODE: '', //학교코드인가??8092029
    USL_CLASS_NAME: '', //학교 이름 송면초등학교
    USL_CODE: '', //학교 나이스 코드
    USL_ID: '',// 계정 ID
    USL_NAME: '' //선생님 이름
}
const getInfos = async ({ id, group }) => {
    let data = {
        head: {},
        body: {
            USL_ID: id
        }
    }
    let result = await fetch('https://cbedu.cbe.go.kr/api/cbe/getTeacherData', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json;charset=utf8",
        },
        body: JSON.stringify(data)
    })
    result = await result.json();
    const { SCH_CODE, USL_CLASS_NAME, USL_CODE, USL_ID, USL_NAME } = result['body']['resultData'];

    teacherInfo.SCH_CODE = SCH_CODE;
    teacherInfo.USL_CLASS_NAME = USL_CLASS_NAME;
    teacherInfo.USL_CODE = USL_CODE;
    teacherInfo.USL_ID = USL_ID;
    teacherInfo.USL_NAME = USL_NAME;


    //2단계 주소록 리스트 가져오기
    result = await fetch('https://cbedu.cbe.go.kr/api/cbe/getGroupPubAddress', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json;charset=utf8",
        },
        body: JSON.stringify({ head: {}, body: { NEIS_CODE: USL_CODE } })
    })
    result = await result.json();
    result = result['body']['resultList'];
    console.log(result);
    const { GROUP_ID } = result.filter(d => d.GROUP_NM === group)[0];

    //3단계 그룹 주소록 가져오기
    result = await fetch('https://cbedu.cbe.go.kr/api/cbe/getGroupPubMember', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json;charset=utf8",
        },
        body: JSON.stringify({ head: {}, body: { GROUP_ID } })
    })
    result = await result.json();
    result = result['body']['resultList'];
    return result;
}

const sendSotong = async ({ title, phoneNumber, message, targetSMS, targetSOTONG }) => {
    //1단계 Seq 코드 받기
    let result = await fetch('https://cbedu.cbe.go.kr/api/cbe/getMsgSeq', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json;charset=utf8",
        },
        body: ""
    })
    result = await result.json()
    const SeqCode = result['body']['resultList'];
    // console.log('Seq code', SeqCode);

    //2단계 insertMessage
    const RECEIVER = []
    targetSMS.map(d => {
        RECEIVER.push(d);
        return d;
    })
    targetSOTONG.map(d => {
        RECEIVER.push(d);
        return d;
    })
    const dummy = {
        head: {

        },
        body: {
            A_UID: teacherInfo.USL_NAME,
            PUSHMSG: message,
            PUSHTITLE: title + message,
            RECEIVER: RECEIVER.join(','),
            SCH_CODE: teacherInfo.SCH_CODE,
            NEIS_CODE: teacherInfo.USL_CODE,
            WRITER: teacherInfo.USL_NAME,
            SCH_GRADE_CODE: 'null',
            SCH_CLASS_CODE: 'null',
            B_IDX: SeqCode,
            pIdx: SeqCode,
            ext: `${SeqCode}^MSG_PUB|CBE_PUB^${teacherInfo.USL_CODE}`,
            smsMem: targetSMS.join(','),
            pushMem: targetSOTONG.join(','),
            orlPhone: phoneNumber,
            USL_ID: teacherInfo.USL_ID
        }
    }
    // console.log('Seq code', dummy);

    result = await fetch('https://cbedu.cbe.go.kr/api/cbe/insertCbeMsg', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json;charset=utf8",
        },
        body: JSON.stringify(dummy)
    })
    result = await result.json();
    // console.log('Seq code', result);
    return result;
}
export { getInfos, sendSotong }

// 나이스용
// const test = () => {
//     let USL_CODE;
//     fetch('https://infosys.cbe.go.kr/cbe/getUserInfo.ajax', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//         },
//         body: `A_UID=${info.id}&A_UPW=${info.password}`
//     }).then(r => r.json())
//         .then(r => {
//             USL_CODE = r[0].USL_CODE; //학교 나이스 아이디 가져온다.
//             return fetch('https://infosys.cbe.go.kr/cbe/selectGroup.ajax', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//                 },
//                 body: `NEIS_CODE=${USL_CODE}`
//             })
//         }).then(r => r.json())
//         .then(r => {
//             r = r.filter(d => {

//                 const temp = d.GROUP_NM.replace(' ', '');
//                 const temp2 = sotong.group.replace(' ', '');
//                 return temp === temp2;
//             })[0]
//             const GROUP_ID = r["GROUP_ID"];
//             return fetch('https://infosys.cbe.go.kr/cbe/selectGroupMember.ajax', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//                 },
//                 body: `NEIS_CODE=${USL_CODE}&GROUP_ID=${GROUP_ID}&SEARCH_TEXT=&SEARCH_TYPE=`
//             })
//         }).then(r => r.json())
//         .then(r => {
//             console.log(r);
//         })
//         ;


// }


/*


1. getUserInfo로 USL_CODE를 가져온다.
    form =A_UID=talksis1&A_UPW=a12345678`

2. selectGroup.ajax에서 해당 그룹이름(GROUP_NM)의 GROUP_ID를 가져와야 한다.
    form  = NEIS_CODE: M100000314

3. selectGroupMember.ajax 에서 데이터를 몽땅 끌어온다.
    form = GROUP_ID: GRP00008247
        NEIS_CODE: M100000314
        SEARCH_TEXT:
        SEARCH_TYPE:


https://infosys.cbe.go.kr/cbe/getUserInfo.ajax
method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `A_UID=talksis1&A_UPW=a12345678`
결과 -

[
    {
        "SCH_YEAR": null,
        "ORG_CNT": 1,
        "SCH_CODE_S": "8092029",
        "ORL_ADDRESS": "충청북도 괴산군 청천면 송면2길 13 송면초등학교",
        "USL_NAME": "박성준",
        "ORL_PHONE": "0438338308",
        "USL_TOP_CODE": "M100000001",
        "ORL_NAME": "송면초등학교",
        "USL_MOBILE": null,
        "USL_EMAIL": null,
        "USL_CODE": "M100000314",
        "USL_ID": "talksis1",
        "SCH_CODE": "songmyeon-e",
        "ADM_CNT": 0,
        "USL_CLASS_NAME": "송면초등학교",
        "USL_GRADE_CODE": null,
        "USL_POSITION": null,
        "ADM_SCH_CNT": 0,
        "USL_GRADE": null,
        "SCH_GRADE": null,
        "USL_POSITION_CODE": null,
        "HOMEPAGE_CODE": "school.cbe.go.kr/songmyeon-e/",
        "SCH_CLASS": null
    }
]
------------------------------------------------------
https://infosys.cbe.go.kr/cbe/selectMsgPub.ajax
application/x-www-form-urlencoded; charset=UTF-8
form
NEIS_CODE:
B_TITLE:
PAGE: 1
PAGE_SIZE: 10
SEARCH_TYPE: title
SCH_GRADE_CODE: null
SCH_CLASS_CODE: null
WRITER: 박성준
USL_ID: talksis1


결과
[
    {
        "B_TITLE": "학부모님께",
        "B_WRITER": "박성준",
        "TOTAL_CNT": 26,
        "B_WRITE_DATE": "2020-05-27",
        "ATCH_CNT": 0,
        "USL_ID": "talksis1",
        "B_IDX": 53460,
        "UMS_SEQ": 254607,
        "RESERVE_DATE": null,
        "RNUM": 1,
        "B_READ": "16/0",
        "RE_UMS_SEQ": null,
        "SMS_RCV": "3",
        "RECEIVER": "4"
    },
]

0: {GPM_IDX: 330477, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 0, GPM_NAME: "이온유", GPM_MEMO: null,…}
1: {GPM_IDX: 330201, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 1, GPM_NAME: "유담", GPM_MEMO: null,…}
2: {GPM_IDX: 329455, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 0, GPM_NAME: "황선경", GPM_MEMO: null,…}
3: {GPM_IDX: 329601, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 0, GPM_NAME: "박도윤 ", GPM_MEMO: "부",…}
4: {GPM_IDX: 329537, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 1, GPM_NAME: "김찬빈", GPM_MEMO: "조모",…}
5: {GPM_IDX: 329670, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 1, GPM_NAME: "박도윤 ", GPM_MEMO: "모",…}
6: {GPM_IDX: 329674, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 1, GPM_NAME: "이손유", GPM_MEMO: null,…}
7: {GPM_IDX: 329478, NEIS_CODE: "M100000314", GPM_ORDER: 10, APP_INST: 1, GPM_NAME: "최예린", GPM_MEMO: null,…}
*/


/*
메세지 발송 단계

1. https://infosys.cbe.go.kr/cbe/cbeMsgSeq.ajax
    from = CBE_MSG: CBE_MSG_PUB
    result = {"SCH_SEQ":94407,"MSG_SEQ":60182}

2. https://infosys.cbe.go.kr/cbe/insertPushMessage.ajax
    form = M_TITLE: 2222
       M_CONTENTS: 333333
       B_WRITER: 박성준
       B_SCHOOL_CODE: M100000314
       CBE_MSG: CBE_MSG_PUB
       MSG_SEQ: 60182
       SCH_SEQ: 94407
       SCH_GRADE_CODE: null
       SCH_CLASS_CODE: null
       USL_ID: talksis1

3. https://infosys.cbe.go.kr/cbedu/push/sendMultiUser.ajax
    form = uids: 01075458245
        pushTitle: 충북소통알리미(N)
        pushMsg: 2222
        senderCode: CBE_MSG_PUB
        reserveDate:
        gradeCode: null
        classCode: null
        ext: 60182^MSG_PUB|CBE_MSG_PUB^M100000314^8092029
        pIdx: 60182
        orlPhone: 0438338308
        pushMem: 01075458245
        smsMem:
        smsTitle: 2222
        smsMsg: 333333
    result = {"RES":"1"}

*/
