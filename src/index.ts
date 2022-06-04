import * as core from '@actions/core';
import * as github from '@actions/github';

const token: string = core.getInput('token');
const authorName: string = core.getInput('author');
const state: string = core.getInput('state');
const repoOwner: string = github.context.repo.owner;
const repo: string = github.context.repo.repo;

function pullRequests(author: string) {
  const octokit = github.getOctokit(token);
  let q = `author:${author} is:pull-request repo:${repoOwner}/${repo}`;

  if (state) {
    q += ` state:${state}`;
  }

  return octokit.rest.search
    .issuesAndPullRequests({
      q,
    })
    .then(result => {
      return {
        ids: result.data.items.map(item => item.number),
        html_urls: result.data.items.map(item => item.html_url),
      };
    });
}

pullRequests(authorName)
  .then(result => {
    core.setOutput('result', result);
  })
  .catch(error => core.setFailed(error.message));
