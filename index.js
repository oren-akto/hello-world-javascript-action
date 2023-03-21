const core = require('@actions/core');
const axios = require("axios")

async function run() {
  try {
    const AKTO_DASHBOARD_URL = core.getInput('AKTO_DASHBOARD_URL');
    const AKTO_ACCESS_TOKEN = core.getInput('AKTO_API_TOKEN');
    const AKTO_TEST_CONFIGURATION = JSON.parse(core.getInput('AKTO_TEST_CONFIGURATION'));

    await axios({
      url: AKTO_DASHBOARD_URL + '/startTest',
      method: 'post',
      headers: {'access-token': AKTO_ACCESS_TOKEN},
      data: AKTO_TEST_CONFIGURATION
    })
    console.log("Akto API test started")
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();