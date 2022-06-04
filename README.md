# Filter Pull Requests By Author

This action provides a matrix containing pull request ids of the given author name.

## Inputs

## `token`

**Required** `GITHUB_TOKEN` to use for accessing repo data

## `author`

**Required** The name of the author to filter pull requests by.

## Outputs

## `result`

matrix of pull request ids from the given author

## Example usage

uses: actions/filter_pull_requests_by_author@v1.0.0
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  author: 'app/dependabot'
