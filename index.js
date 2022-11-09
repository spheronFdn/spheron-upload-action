const core = require("@actions/core");
const github = require("@actions/github");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const path = require("path");
const fs = require("fs");
var FormData = require("form-data");

const spheronBaseUrl = "https://api-v2.spheron.network";

async function getScope(apiKey) {
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    redirect: "follow",
  };

  const resp = await fetch(
    `${spheronBaseUrl}/v1/api-keys/scope`,
    requestOptions
  );
  const respJson = await resp.json();

  return respJson;
}

function readFilesSync(dir) {
  const files = [];

  fs.readdirSync(dir).forEach((filename) => {
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
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return files;
}

async function postFiles(
  apiKey,
  buildFolder,
  organizationId,
  projectName,
  protocol
) {
  const filePointers = readFilesSync(buildFolder);
  const formData = new FormData();

  filePointers.forEach((file) => {
    // console.log(file);
    formData.append(
      "files",
      fs.createReadStream(file.filepath),
      `${file.name}${file.ext}`
    );
  });
  var requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
    redirect: "follow",
  };

  searchParams = new URLSearchParams({
    organization: organizationId,
    project: projectName,
    protocol: protocol,
  });
  const resp = await fetch(
    `${spheronBaseUrl}/v1/deployment/upload?${searchParams}`,
    requestOptions
  );
  const respJson = await resp.json();

  return respJson;
}

try {
  // `who-to-greet` input defined in action metadata file
  //const nameToGreet = core.getInput('who-to-greet');
  //console.log(`Hello ${nameToGreet}!`);
  const spheronApiKey = core.getInput("spheron-api-key");
  // const spheronApiKey =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiI2YjczNTBjZjUzZDVkZmNmY2ViY2VjOTVjOGY5OWU0YzUwZmQ5OGMzMWFjMzc3MzY4ODYxODRjMzE4NzFiNjA5ZjlhNTliYzA3OGYwNjllZTg0MWVhOTUxZWRjNzFhNTc3YjQyYTNhZGE1NjJmYmYwOGNhOWEzNWIzMjJiMmUxOSIsImlhdCI6MTY2NTQwOTMxNywiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.UFPHCaxb2wvUPmz5SbQNKT-19Yy7XdT38SHbvY6wZkE";
  // console.log(`Spheron API Key: ${spheronApiKey}`);
  const spheronProjectName = core.getInput("spheron-project-name");
  // const spheronProjectName = "Dragd";
  // console.log(`Spheron Project Name: ${spheronProjectName}`);
  let spheronOrganizationId = core.getInput("spheronOrganizationId");
  // let spheronOrganizationId = "";
  // console.log(`Spheron Organization ID: ${spheronOrganizationId}`);
  const spheronUploadFolder = core.getInput("spheron-upload-folder");
  // const spheronUploadFolder = "dist";
  // console.log(`Spheron Upload Folder: ${spheronUploadFolder}`);
  const spheronProtocol = core.getInput("spheron-protocol");

  getScope(spheronApiKey).then((res) => {
    if (spheronOrganizationId == "") {
      spheronOrganizationId = res["organizations"][0]["id"];
    }
    const directoryPath = `${process.env.GITHUB_WORKSPACE}/${spheronUploadFolder}`;
    uploaded = postFiles(
      spheronApiKey,
      directoryPath,
      spheronOrganizationId,
      spheronProjectName,
      spheronProtocol
    );
    uploaded.then((res) => {
      console.log(res);
      console.log(res["sitePreview"]);
    });
  });
} catch (error) {
  core.setFailed(error.message);
}
