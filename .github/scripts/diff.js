const { execSync } = require('child_process');

console.log(process.env);

const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME;
const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME; // Get the branch name from the environment variable

if (GITHUB_EVENT_NAME === 'push') {
    process.chdir(GITHUB_WORKSPACE);
    console.log(`Working directory changed to ${GITHUB_WORKSPACE}`);

    // Fetch only the last 2 commits for the branch specified by GITHUB_REF_NAME
    console.log(`Fetching the last 2 commits for branch ${GITHUB_REF_NAME}...`);
    execSync(`git fetch --depth=2 origin ${GITHUB_REF_NAME}`, { stdio: 'inherit' });

    // Determine and print the SHA of the current commit
    const currentCommitSHA = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    console.log(`Current commit SHA: ${currentCommitSHA}`);

    // Determine the SHA of the previous commit
    const previousCommitSHA = execSync('git rev-parse HEAD~1', { encoding: 'utf-8' }).trim();
    console.log(`Previous commit SHA: ${previousCommitSHA}`);

    // Checkout the previous commit
    console.log(`Checking out the previous commit: ${previousCommitSHA}`);
    execSync(`git checkout ${previousCommitSHA}`, { stdio: 'inherit' });
}
