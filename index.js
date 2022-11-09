const core = require('@actions/core');
const github = require('@actions/github');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const fs = require('fs');
const spheronBaseUrl = "https://api-v2.spheron.network"

async function getScope(apiKey) {

//authHeaders = new fetch.Headers()
//authHeaders.append("Authorization", `Bearer ${apiKey}`)

var requestOptions = {
  method: 'GET',
  headers: {
    "Authorization": `Bearer ${apiKey}`
  },
  redirect: 'follow'
};


const resp = await fetch(`${spheronBaseUrl}/v1/api-keys/scope`, requestOptions)
const respJson = await resp.json()

return respJson

}

function readFilesSync(dir) {
  const files = [];

  fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if (isFile) files.push({ filepath, name, ext, stat });
  });

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    // https://stackoverflow.com/a/38641281
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  console.log(files)

  return files;
}

async function postFiles(apiKey, buildFolder, organizationId, projectName, protocol) {

//var myHeaders = new Headers();
//myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiI2YjczNTBjZjUzZDVkZmNmY2ViY2VjOTVjOGY5OWU0YzUwZmQ5OGMzMWFjMzc3MzY4ODYxODRjMzE4NzFiNjA5ZjlhNTliYzA3OGYwNjllZTg0MWVhOTUxZWRjNzFhNTc3YjQyYTNhZGE1NjJmYmYwOGNhOWEzNWIzMjJiMmUxOSIsImlhdCI6MTY2NTQwOTMxNywiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.UFPHCaxb2wvUPmz5SbQNKT-19Yy7XdT38SHbvY6wZkE");
//myHeaders.append("Content-Type", "application/json");

//var raw = JSON.stringify({
//  "organizationId": "string",
//  "gitUrl": "string",
//  "repoName": "string",
//  "uniqueTopicId": "string",
//  "configuration": {
//    "buildCommand": "string",
//    "installCommand": "string",
//    "workspace": "string",
//    "publishDir": "string",
//    "framework": "static",
//    "nodeVersion": "V_12"
//  },
//  "env": {},
//  "protocol": "string",
//  "createDefaultWebhook": true,
//  "provider": "string",
//  "branch": "string"
//});
//files.forEach((file) => {
  //console.log(file)
//})
console.log('buildFolder', buildFolder)
syncedFiles = readFilesSync(buildFolder)
//console.log(syncedFiles)
// const filesFormData = {
//   files: syncedFiles,
// };

var requestOptions = {
  method: 'POST',
  headers: {
    "Authorization": `Bearer ${apiKey}`
  },
  body: syncedFiles,
  redirect: 'follow'
};

console.log('organization', organizationId)
console.log('project', projectName)
console.log('protocol', protocol)
searchParams = new URLSearchParams({
	organization: organizationId,
	project: projectName,
	protocol: protocol
})
console.log(searchParams)
const resp = await fetch(`${spheronBaseUrl}/v1/deployment/upload?${searchParams}`, requestOptions)
const respJson = await resp.json()

return respJson

//fetch("https://api-v2.spheron.network/v1/deployment", requestOptions)
  //.then(response => response.text())
  //.then(result => console.log(result))
  //.catch(error => console.log('error', error));

}

var _getFiles = function(dir) {

    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getFiles(file))
        } else results.push(file);

    });

    return results;

};

try {
  // `who-to-greet` input defined in action metadata file
  //const nameToGreet = core.getInput('who-to-greet');
  //console.log(`Hello ${nameToGreet}!`);
  //const spheronApiKey = core.getInput('spheron-api-key')
  const spheronApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiI2YjczNTBjZjUzZDVkZmNmY2ViY2VjOTVjOGY5OWU0YzUwZmQ5OGMzMWFjMzc3MzY4ODYxODRjMzE4NzFiNjA5ZjlhNTliYzA3OGYwNjllZTg0MWVhOTUxZWRjNzFhNTc3YjQyYTNhZGE1NjJmYmYwOGNhOWEzNWIzMjJiMmUxOSIsImlhdCI6MTY2NTQwOTMxNywiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.UFPHCaxb2wvUPmz5SbQNKT-19Yy7XdT38SHbvY6wZkE"
  console.log(`Spheron API Key: ${spheronApiKey}`)
  //const spheronProjectName = core.getInput('spheron-project-name')
  const spheronProjectName = "Dragd"
  console.log(`Spheron Project Name: ${spheronProjectName}`)
  //const spheronOrganizationId = core.getInput('spheronOrganizationId')
  let spheronOrganizationId = ''
  console.log(`Spheron Organization ID: ${spheronOrganizationId}`)
  //let spheronUploadFolder = core.getInput('spheron-upload-folder')
  const spheronUploadFolder = 'dist'
  console.log(`Spheron Upload Folder: ${spheronUploadFolder}`)
  const spheronProtocol = 'ipfs-pinata'

  if(spheronOrganizationId == ''){
    //const scope = await getScope(spheronApiKey)
    //spheronOrganizationId = res['organizations'][0]["id"]
    getScope(spheronApiKey).then((res) => {
      spheronOrganizationId = res['organizations'][0]["id"]
      console.log('spheronOrganizationId', spheronOrganizationId)
      const directoryPath = path.join(__dirname, spheronUploadFolder)
      files = readFilesSync(directoryPath)
      console.log(files)
	  uploaded = postFiles(spheronApiKey, directoryPath, spheronOrganizationId, spheronProjectName, spheronProtocol)
	  uploaded.then((res) => {
	  	console.log('uploaded', res)
	  })
      //fs.readdir(directoryPath, async function (err, files) {
      	//if(err){
      	//	return console.log(`Unable to scan directory`, err);
      	//}
      	//uploaded = await postFiles(spheronApiKey, directoryPath, spheronOrganizationId, spheronProjectName, spheronProtocol)
		//console.log(uploaded)      	      	
      //})
    })
  }

  //joining path of directory 
  //const directoryPath = path.join(__dirname, spheronUploadFolder);
  //passsing directoryPath and callback function
  //fs.readdir(directoryPath, async function (err, files) {
      //handling error
      //if (err) {
      //    return console.log('Unable to scan directory: ' + err);
      //} 
      //listing all files using forEach
      //files.forEach(function (file) {
          // Do whatever you want to do with the file
          //console.log(file); 
      //});
      //uploadedJson = await postFiles(spheronApiKey, files, spheronOrganizationId, spheronProjectName, spheronProtocol)
      //uploadedJson = await postFiles(spheronApiKey, files, spheronOrganizationId, spheronProjectName, spheronProtocol)
      //console.log(uploadedJson)
      //uploadedJson.then((res) => {
      //	console.log(res)
      //})
  //});
  // const time = (new Date()).toTimeString();
  // core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
