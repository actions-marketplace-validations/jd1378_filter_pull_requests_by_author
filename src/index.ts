import * as core from '@actions/core';
import * as github from '@actions/github';

const token: string = core.getInput('token');
const authorName: string = core.getInput('author');
const repoOwner: string = github.context.repo.owner;
const repo: string = github.context.repo.repo;

function pullRequests(author: string) {
  const octokit = github.getOctokit(token);

  return octokit.rest.search
    .issuesAndPullRequests({
      q: `author:${author} is:pull-request repo:${repoOwner}/${repo}`,
    })
    .then(result => {
      return result.data.items.map(item => item.number);
    });
}

pullRequests(authorName)
  .then(ids => {
    core.setOutput('result', ids);
  })
  .catch(error => core.setFailed(error.message));
