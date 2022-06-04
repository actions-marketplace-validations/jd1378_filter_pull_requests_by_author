# Filter Pull Requests By Author

This action provides a matrix containing pull request ids of the given author name.

## Inputs

## `token`

**Optional** `GITHUB_TOKEN` or PAT to use for accessing repo data

## `state`

**Optional** `open` or `closed`

## `author`

**Required** The name of the author to filter pull requests by.

## Outputs

## `ids`

matrix of pull request ids from the given author

has the following structure:

```jsonc
{
  "ids": [
    "<number>",
    // ...
  ],
}
```

## `html_urls`

matrix of pull request urls from the given author

has the following structure:

```jsonc
{
  "html_urls": [
    "https://github.com/<repoOwner>/<repo>/pull/<number>",
    // ...
  ]
}
```

## Example usage

```yaml


name: add some comment to prs of someone
on: 
  workflow_dispatch:
    inputs:
      author:
        description: 'author name'
        required: true 
        type: string 
      comment_body:
        description: 'comment body to send on pull requests'
        required: true 
        type: string 
        

jobs:
  pr_data_job:
    runs-on: ubuntu-latest
    outputs:
      ids: ${{ steps.get_pull_requests_step.outputs.ids }}
      html_urls: ${{ steps.get_pull_requests_step.outputs.html_urls }}
    steps:
    - id: get_pull_requests_step
      uses: jd1378/filter_pull_requests_by_author@v2
      with: 
        token: ${{ secrets.GITHUB_TOKEN }}
        author: ${{ github.event.inputs.author }} 
        state: open

  add_comment:
    needs: pr_data_job
    runs-on: ubuntu-latest
    strategy:
      matrix: 
        ids: ${{fromJson(needs.pr_data_job.outputs.ids)}}
    steps:
      - name: add comment
        uses: peter-evans/create-or-update-comment@v2
        with:
          issue-number: ${{ matrix.ids }}
          body: ${{ github.event.inputs.comment_body }} 

  ### or merge

  merge:
    needs: pr_data_job
    runs-on: ubuntu-latest
    strategy:
      matrix: 
        html_urls: ${{fromJson(needs.pr_data_job.outputs.html_urls)}}
    steps:
      - name: merge
        run: gh pr merge --auto --merge "$PR_URL"
        env: 
          PR_URL: ${{ matrix.html_urls }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```
