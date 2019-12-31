const core = require("@actions/core");
const github = require("@actions/github");
const codesandbox = require("codesandbox/lib/api/define");
const fs = require("fs");
const path = require("path");

main().catch(error => {
  core.setFailed(error.message);
});

async function main() {
  const client = new github.GitHub(process.env.GITHUB_TOKEN);

  const files = readFiles("./src");
  const prEnvFiles = {};

  Object.keys(files).forEach(fileName => {
    prEnvFiles[fileName.slice(__dirname.length, -1)] = files[fileName];
  });

  console.log(files);
  console.log(prEnvFiles);

  const prEnvironmentLink =
    "https://codesandbox.io/api/v1/sandboxes/define?parameters=" +
    codesandbox.getParameters({
      files: {
        "sandbox.config.json": {
          content:
            "{\n" + '  "template": "create-react-app-typescript"\n' + "}\n"
        },
        "src/index.tsx": {
          content: 'import "@bradenhs/npm-release-test"'
        },
        "public/index.html": {
          content:
            '<style>a { margin-right: 10px; } nav { margin-bottom: 10px; } #root { margin: 10px; }</style><div id="root"></div>'
        },
        "package.json": {
          content: {
            dependencies: {
              "@bradenhs/npm-release-test": "test",
              "type-route": "latest",
              react: "=16.8.6",
              "@types/react": "=16.8.18",
              "react-dom": "=16.8.6",
              "@types/react-dom": "=16.8.4"
            }
          }
        }
      }
    });

  await client.issues.createComment({
    issue_number: github.context.payload.pull_request.number,
    body: `
      **🚀 PR Environment Ready**
      🖥️ CodeSandbox playground available **[here](${prEnvironmentLink})**
      ${Object.keys(prEnvFiles).join("\n")}
    `.split("\n").map(line => line.trim()).join('\n').trim(),
    owner: "bradenhs",
    repo: "npm-release-test"
  });
}

function readFiles(directory) {
  const fileNameCollection = fs.readdirSync(directory);
  const files = {};

  for (const fileName of fileNameCollection) {
    const filePath = path.resolve(directory, fileName);

    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      files[filePath] = fs.readFileSync(filePath).toString();
    } else {
      Object.assign(files, readFiles(filePath));
    }
  }

  return files;
}