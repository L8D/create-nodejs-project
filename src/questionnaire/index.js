const questions = require('./questions');
const auth = require('../auth');
const settings = require('../settings');

async function run(name) {
  const resp = await questions.getProjectDetails(name);

  if (!resp.useGithub) {
    Object.assign(resp, await questions.getGitRemoteDetails());
    resp.hasRemote = !!resp.git.url;
  } else {
    // Organizar obtención de datos y despues asignaciones
    Object.assign(resp, await questions.getAuthFile());

    const githubUser = auth.getFirstUser(resp.authPath);

    Object.assign(resp, await questions.getGithubUser(githubUser));

    const token = auth.getToken(resp.authUser, resp.authPath);

    Object.assign(resp, await questions.getAuthToken(resp.authUser, token));

    // FIXME: validación innecesaria
    if (resp.token) {
      // FIXME: auth.confirmUpdateToken no existe
      if (resp.token !== token && auth.confirmUpdateToken()) {
        auth.updateToken(resp.authUser, resp.token, settings.authPath);
      }
    } else {
      resp.useGithub = false;
    }
  }

  return resp;
}

module.exports = {
  run,
};
