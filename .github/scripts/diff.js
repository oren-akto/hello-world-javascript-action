const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

console.log(process.env);

const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME;
const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;

// Create a temporary directory
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-'));
console.log(`Temporary directory created at ${tmpDir}`);

// Copy the contents of the GITHUB_WORKSPACE to the temporary directory
console.log(`Copying GITHUB_WORKSPACE contents to temporary directory...`);
execSync(`cp -r ${GITHUB_WORKSPACE}/. ${tmpDir}`, { stdio: 'inherit' });

// Change the working directory to the temporary location
process.chdir(tmpDir);
console.log(`Changed working directory to temporary location: ${tmpDir}`);

if (GITHUB_EVENT_NAME === 'push') {
    const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME;

    // Fetch only the last 2 commits for the branch specified by GITHUB_REF_NAME
    console.log(`Fetching the last 2 commits for branch ${GITHUB_REF_NAME}...`);
    execSync(`git fetch --depth=2 origin ${GITHUB_REF_NAME}`, { stdio: 'inherit', cwd: tmpDir });

    // Determine the SHA of the previous commit
    const previousCommitSHA = execSync('git rev-parse HEAD~1', { encoding: 'utf-8', cwd: tmpDir }).trim();
    console.log(`Previous commit SHA: ${previousCommitSHA}`);

    // Checkout the previous commit
    console.log(`Checking out the previous commit: ${previousCommitSHA}`);
    execSync(`git checkout ${previousCommitSHA}`, { stdio: 'inherit', cwd: tmpDir });
} else if (GITHUB_EVENT_NAME === 'pull_request') {
    // Fetch the latest commit of the base branch
    console.log(`Fetching the latest commit for base branch ${GITHUB_BASE_REF}...`);
    execSync(`git fetch origin ${GITHUB_BASE_REF} --depth=1`, { stdio: 'inherit' });

    // print the commit hash of current commit
    const currentCommitSHA = execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: tmpDir }).trim();
    console.log(`Current commit SHA: ${currentCommitSHA}`);

    // Checkout the fetched commit
    console.log(`Checking out to the latest commit of base branch ${GITHUB_BASE_REF}...`);
    execSync(`git checkout FETCH_HEAD`, { stdio: 'inherit' });

    // print the commit hash of base commit
    const baseCommitSHA = execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: tmpDir }).trim();
    console.log(`Base commit SHA: ${baseCommitSHA}`);
}

// 48469226ed62e1e43463ab5af4c90a98684d2500 - main
