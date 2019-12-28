const core = require('@actions/core');
const github = require('@actions/github');

main().catch(error => {
  core.setFailed(error.message);
})

async function main() {
  const { pulls } = new github.GitHub();

  await pulls.createComment({
    pull_number: github.context.payload.pull_request.number,
    body: "Test Comment",
    commit_id: github.context.sha    
  })

  console.log("Did comment")
}
