const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

console.log(process.env);

const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME;
const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME;

// Create a temporary directory
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-'));
console.log(`Temporary directory created at ${tmpDir}`);

// Copy the contents of the GITHUB_WORKSPACE to the temporary directory
console.log(`Copying contents to temporary directory...`);
execSync(`cp -r ${GITHUB_WORKSPACE}/. ${tmpDir}`, { stdio: 'inherit' });

// Now you can operate on the contents within tmpDir without affecting the original GITHUB_WORKSPACE
// For demonstration, changing directory to tmpDir
process.chdir(tmpDir);
console.log(`Changed working directory to temporary location: ${tmpDir}`);

if (GITHUB_EVENT_NAME === 'push') {
    console.log(`Working directory is ${GITHUB_WORKSPACE}`);

    // Fetch only the last 2 commits for the branch specified by GITHUB_REF_NAME
    console.log(`Fetching the last 2 commits for branch ${GITHUB_REF_NAME}...`);
    execSync(`git fetch --depth=2 origin ${GITHUB_REF_NAME}`, { stdio: 'inherit', cwd: GITHUB_WORKSPACE });
    
    // Determine the SHA of the previous commit
    const previousCommitSHA = execSync('git rev-parse HEAD~1', { encoding: 'utf-8', cwd: tmpDir }).trim();
    console.log(`Previous commit SHA: ${previousCommitSHA}`);

    // Checkout the previous commit
    console.log(`Checking out the previous commit: ${previousCommitSHA}`);
    execSync(`git checkout ${previousCommitSHA}`, { stdio: 'inherit', cwd: tmpDir });
}
