const core = require('@actions/core');
const github = require('@actions/github');

main().catch(error => {
  core.setFailed(error.message);
})

async function main() {
  const { issues } = new github.GitHub();

  await issues.createComment({
    issue_number: github.context.payload.pull_request.number,
    body: "Test Comment"
 });

  console.log("Did comment")
}
