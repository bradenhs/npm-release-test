const core = require('@actions/core');
const github = require('@actions/github');

main().catch(error => {
  core.setFailed(error.message);
})

async function main() {
  const client = new github.GitHub(process.env.GITHUB_TOKEN);

  await client.issues.createComment({
    issue_number: github.context.payload.pull_request.number,
    body: "Test Comment",
    owner: "bradenhs",
    repo: "npm-release-test"
 });

  console.log("Did comment");
}
