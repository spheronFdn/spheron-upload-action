const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  //const nameToGreet = core.getInput('who-to-greet');
  //console.log(`Hello ${nameToGreet}!`);
  const spheronApiKey = core.getInput('spheron-api-key')
  console.log(`Spheron API Key: ${spheronApiKey}`)
  const spheronProjectName = core.getInput('spheron-project-name')
  console.log(`Spheron Project Name: ${spheronProjectName}`)
  const spheronOrganizationId = core.getInput('spheronOrganizationId')
  console.log(`Spheron Organization ID: ${spheronOrganizationId}`)


  // const time = (new Date()).toTimeString();
  // core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
