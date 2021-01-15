const core = require('@actions/core');
const axios = require('axios');

const NODE_ENV = process.env['NODE_ENV'];

// If you want to run it locally, set the environment variables like `$ export GITHUB_TOKEN=<your token>`
const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];

let input;
if (NODE_ENV != 'local') {
  input = {
    sha: core.getInput('sha', { required: true }),
    state: core.getInput('state', { required: true }),
    targetUrl: core.getInput('target-url'),
    description: core.getInput('description'),
    context: core.getInput('context'),
    repository: core.getInput('repository', { required: true }),
    githubToken: core.getInput('github-token', { required: true }),
  };
} else {
  input = {
    sha: '',
    state: 'success',
    targetUrl: 'http://ci.example.com',
    description: 'Running..',
    context: 'My Workflow',
    repository: 'hkusu/status-create-action',
    githubToken: GITHUB_TOKEN,
  };
}

async function run(input) {

  if (input.state != 'error' && input.state != 'failure' && input.state != 'pending' && input.state != 'success') {
    throw new Error('"state" input must be "error", "failure", "pending", or "success".');
  }

  try {
    await axios({
      method: 'post',
      url: `https://api.github.com/repos/${input.repository}/statuses/${input.sha}`,
      data: {
        state: input.state,
        target_url: input.targetUrl,
        description: input.description,
        context: input.context,
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${input.githubToken}`,
      },
    });
  } catch (e) {
    if (e.response.status == 422) {
      throw new Error('"sha" input may not be correct.');
    } else {
      throw new Error(`GitHub API error (message: ${e.message}).`);
    }
  }
}

run(input)
  .then(result => {
    core.setOutput('result', 'success');
  })
  .catch(error => {
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  });
