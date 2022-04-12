const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

//firebase
const firebase =  require('firebase');
require("firebase/auth");
require("firebase/database");

var firebaseConfig = {
    apiKey: "AIzaSyDuTjWxGj9I4S-l5SJOdwVaBkbvUlOGQw8",
    authDomain: "dhsvtp-event.firebaseapp.com",
    databaseURL: "https://dhsvtp-event.firebaseio.com",
    projectId: "dhsvtp-event",
    storageBucket: "dhsvtp-event.appspot.com",
    messagingSenderId: "269828272951",
    appId: "1:269828272951:web:a36ec60e00ebfe2ccf20b2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.database();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const headerTable = [
  "STT",
  "ID",
  "Họ và Tên",
  "Năm sinh",
  "Khoa",
  "Trường",
  "Loại nhóm",
  "Loại thành viên",
  "Bảng",
  "Điểm danh",
  "Ảnh đại diện",
  "Bằng cấp",
  "email",
  "fullname",
  "uid",
]

let values = [
];
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  db.ref('users/').on('value', async function(snapshot){
    let datas = await snapshot.val();
    let count = 1;
    for(i in datas){
      let addValue = [];
      let data = datas[i].members;
      if(data != ''){
        for(let j in data){
          let certificates = data[j].certificates ? data[j].certificates.join(",\n") : '';
          addValue = [];
          addValue.push(count++);
          addValue.push(data[j].id);
          addValue.push(data[j].name);
          addValue.push(data[j].DOB);
          addValue.push(data[j].faculty);
          addValue.push(data[j].school);
          addValue.push(data[j].type_of_group);
          addValue.push(data[j].type_of_mem);
          addValue.push(data[j].type_of_bang);
          addValue.push(data[j]["checkin"]);
          addValue.push(data[j]["avatar"]);
          addValue.push(certificates);
          addValue.push(datas[i].email);
          addValue.push(datas[i].fullname);
          addValue.push(i);
          values.push(addValue);
        }
      }
      else{
        // addValue.push(count++);
        // addValue.push('');
        // addValue.push('');
        // addValue.push('');
        // addValue.push(datas[i].schoolname);
        // addValue.push('');
        // values.push(addValue);
      }
    }
    authorize(JSON.parse(content), async function(auth){
      const sheets = google.sheets({version: 'v4', auth});
      const filteredData = await filterNewData(sheets, values);
      const lastIndexOfCurrentData = Math.max(filteredData.currentData.length, 1)
      if(filteredData.currentData.length <= 0) {
        filteredData.currentData.unshift(headerTable)
      }
      const resource = {
        values: [
          ...filteredData.currentData,
          ...filteredData.willAppendData.map((d, i) => {
            const stt = lastIndexOfCurrentData + i
            d[0] = stt
            return d
          })
        ],
      };
      sheets.spreadsheets.values.update({
        spreadsheetId: '17eNzPh9tkVgsfJGFDAMVwp0u7Cm2HVYpalWXiyXI-Yc',
        range: 'sheet_update!A1',
        valueInputOption: "RAW",
        resource,
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        console.log("OK");
      });
    });
  })
});

function getDataFromSS(sheets) {
  return sheets.spreadsheets.values.get({
    spreadsheetId: '17eNzPh9tkVgsfJGFDAMVwp0u7Cm2HVYpalWXiyXI-Yc',
    range: 'sheet_update',
  })
  .then((res) => {
    return res.data.values || []
  });
}

async function filterNewData(sheets, commingData) {
  const newDataArr = []
  const dataSS = await getDataFromSS(sheets)
  for (let i = 0; i < commingData.length; i++) {
    const finded = dataSS.find(d => d[1] === commingData[i][1]) // d[1]: ID
    if(!finded) {
      newDataArr.push(commingData[i])
    }
  }
  return {
    willAppendData: newDataArr,
    currentData: dataSS,
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}