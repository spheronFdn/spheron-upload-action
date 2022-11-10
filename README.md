# spheron-upload-action

## What does it do?

So you've built a frontend service with React/Angular/Vue/Vanilla JS or generally any JS framework, once the build step is complete, you'd want to create a build with `npm run build` post which the ideal next step is to move it into IPFS so you can attach it to any web3 domain, Spheron protocol assists us with this and also gives you a URL that you can use to view your deployment (Think vercel of web3 site deployments) 

This action allows you to define a step that handles uploading of built files to IPFS and returns a URL that you can use to visit the deployment

## Usage
Hydrate the following environment keys in your project's environment secrets, 

A spheron API Key with the title: 
`SPHERON_API_KEY` which can be collected from Spheron Console. Profile > User Settings > Tokens > Create Token

This maps to `spheron-api-key` in your workflow yml

A spheron Project Name with the title: 
`SPHERON_PROJECT_NAME` 

This maps to `spheron-project-name` in your workflow yml

### Additional Config

You can override the default organization by passing in an optional `spheron-organization-id` key in your workflow yml

You can override the default upload folder by passing in an optional `spheron-upload-folder` key in your workflow yml

You can override the default protocol by passing in a supported key from Spheron's list of protocol's supported in an optional `spheron-protocol` key in your workflow yml

## Demo

[https://github.com/theycallmeloki/spheron-upload-action-test](https://github.com/theycallmeloki/spheron-upload-action-test)

[Successful Action](https://github.com/theycallmeloki/spheron-upload-action-test/actions/runs/3430231106/jobs/5716926735)

The workflow itself is [here](https://github.com/theycallmeloki/spheron-upload-action-test/blob/main/.github/workflows/main.yml)
