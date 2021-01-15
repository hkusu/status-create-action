# Status Create Action

This is a GitHub Action to create commit statuses for a given SHA.

## Usage

```yaml
- uses: hkusu/status-create-action@v1
  with:
    sha: ${{ github.sha }}
    state: pending # specify 'error', 'failure', 'pending', or 'success'
    target-url: http://ci.example.com # default: 'https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}'
    description: Running.. # option
    context: My Workflow # default: '${{ github.workflow }}'
```

About input parameters, see also https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-a-commit-status--parameters .

### Result of action

Use `result` outputs.

```yaml
- uses: hkusu/status-create-action@v1
  id: status-create # specify id
  with:
    sha: ${{ github.sha }}
    state: pending
- name: Show result
  if: always()
  run: echo '${{ steps.status-create.outputs.result }}' # success or failure
```

## License

MIT
