# Akto Github Action

## Example usage

```yaml
- uses: oren-akto/hello-world-javascript-action@v1.1
    with:
      AKTO_DASHBOARD_URL: ${{secrets.AKTO_DASHBOARD_URL}}
      AKTO_ACCESS_TOKEN: ${{secrets.AKTO_ACCESS_TOKEN}}
      AKTO_TEST_CONFIGURATION: ${{secrets.AKTO_TEST_CONFIGURATION}}
```
