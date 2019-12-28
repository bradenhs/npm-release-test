const core = require('@actions/core');
const github = require('@actions/github');

try {
  console.log("pr environment")
} catch (error) {
  core.setFailed(error.message);
}