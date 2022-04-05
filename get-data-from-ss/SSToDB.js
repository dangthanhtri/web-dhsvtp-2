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
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
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

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1eLfPFQgSmjNdW9z2LzLYaTcWI9uCVdREZtoO3FulmbQ',
    range: 'sheet2',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        uploadDataToDatabase(row);
      });
    //console.log(rows);
    } else {
      console.log('No data found.');
    }
  });
}
async function uploadDataToDatabase(row){
    // await db.ref('/users/').once('value').then(async function(snapshot){
    //   let allSchools = snapshot.val();
    //   for(let idSchool in allSchools){
    //     await db.ref('/users/' + idSchool + '/members/').remove();
    //   }
    // })
    // await db.ref('/users/').once('value').then(async function(snapshot){
    //   let allSchools = snapshot.val();
    //   for(let idSchool in allSchools){
    //     if(allSchools[idSchool]["schoolname"] == row[7]){
    //       let updates = {};
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/id"] = row[1]; 
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/type_of_group"] = row[2]; 
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/name"] = row[3]; 
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/type_of_mem"] = row[4]; 
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/shift"] = row[5]; 
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/room"] = row[6];
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/school"] = row[7];
    //       updates['/users/' + idSchool + '/members/' + row[1] + "/avatar"] = row[8];  
    //       await db.ref().update(updates);
    //       break;
    //     }
    //   }
    // })
    // await db.ref('/users/').once('value').then(async function(snapshot){
    //   let allSchools = snapshot.val();
    //   for(let idSchool in allSchools){
    //     if(!allSchools[idSchool]["members"]){
    //       await db.ref('/users/' + idSchool).remove();
    //     }
    //   }
    // })
    let updates = {};
    updates['/users/' + row[0] + '/id'] = row[0]; 
    updates['/users/' + row[0] + '/permission'] = "user"; 
    updates['/users/' + row[0] + '/schoolname'] = row[7]; 
    updates['/users/' + row[0] + '/members/' + row[1] + "/id"] = row[1]; 
    updates['/users/' + row[0] + '/members/' + row[1] + "/type_of_group"] = row[2]; 
    updates['/users/' + row[0] + '/members/' + row[1] + "/name"] = row[3]; 
    updates['/users/' + row[0] + '/members/' + row[1] + "/type_of_mem"] = row[4]; 
    updates['/users/' + row[0] + '/members/' + row[1] + "/shift"] = row[5]; 
    updates['/users/' + row[0] + '/members/' + row[1] + "/room"] = row[6];
    updates['/users/' + row[0] + '/members/' + row[1] + "/school"] = row[7];
    updates['/users/' + row[0] + '/members/' + row[1] + "/avatar"] = row[8];  
        await db.ref().update(updates);
}