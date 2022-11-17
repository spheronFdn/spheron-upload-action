const core = require("@actions/core");
const github = require("@actions/github");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const axios = require("axios");
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

async function getProjectDomain(apiKey, projectId) {
  var requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    redirect: "follow",
  };

  const resp = await fetch(
    `${spheronBaseUrl}/v1/project/${projectId}/domains`,
    requestOptions
  );
  const respJson = await resp.json();

  return respJson;
}

function fillFormData(dir, rootPath, formData) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const path = dir + "/" + file;
    const filePath = rootPath + file;
    if (fs.statSync(path).isDirectory()) {
      fillFormData(path, filePath + "/", formData);
    } else {
      formData.append("files", fs.createReadStream(path), {
        filepath: filePath,
      });
    }
  }
}

async function postFiles(
  apiKey,
  buildFolder,
  organizationId,
  projectName,
  protocol
) {
  const data = new FormData();
  fillFormData(buildFolder, "./", data);
  // console.log("file upload data", data);

  var requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: data,
    redirect: "follow",
  };

  searchParams = new URLSearchParams({
    organization: organizationId,
    project: projectName,
    protocol: protocol,
  });
  // console.log(searchParams);
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

  getScope(spheronApiKey).then((scopeRes) => {
    if (spheronOrganizationId == "") {
      spheronOrganizationId = scopeRes["organizations"][0]["id"];
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
      // console.log(res);
      // console.log(res["sitePreview"]);
      domains = getProjectDomain(spheronApiKey, res["projectId"]);
      // console.log(domains)
      domains.then((domainRes) => {
        // console.log(domainRes);
        domainRes["domains"].forEach((domain) => {
          console.log(`${domain["name"]}`);
        })
        core.setOutput("site", domainRes["domains"][0]["name"]);
      });
    });
  });
} catch (error) {
  core.setFailed(error.message);
}
