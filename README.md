# Skype User Interface (SkyUI)

## Introduction

SkyUI is a discontinued SharePoint module project that displays a Skype for Business Online (Office 365) Diffusion Group with real time status and offers a communication system, thanks to the Skype Web SDK and the Unified Communications Web API (UCWA).

It was meant for companies that wanted to see an updated list of a specific group on any page of their SharePoint solutions.

Generated with Yeoman, coded in TypeScript and React, its light interface is based on the official SfB software's design.

## Requires

* Microsoft Azure AD
* A SharePoint solution
* A Skype for Business **Online** plan
* Admin credentials for the above items

## Deployment

Being no longer working on this module, I can no longer overview and guarantee an exact step by step guide, nor the availability of the tools used in the development and deployment process.

Therefore, the whole process (from registration to deployment) is available here (https://docs.microsoft.com/fr-ca/skype-sdk/ucwa/unifiedcommunicationswebapi2_0)[here].

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

- gulp clean - TODO
- gulp test - TODO
- gulp serve - TODO
- gulp bundle - TODO
- gulp package-solution - TODO
