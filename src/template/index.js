const fs = require('fs').promises;
const path = require('path');

const utils = require('../utils');

const TEMPLATE_PATH = path.join(__dirname, '..', '..', 'template');
const LICENSES_PATH = path.join(__dirname, '..', '..', 'licenses');

/**
 * Update a file using a dictionary
 * @param  {Object} dictionary    A key-value dictionary
 * @param  {String} [filePath=''] The path for the file
 */
async function updateFile(dictionary, filePath = '') {
  const resolvedFilePath = utils.files.resolvePath(filePath);

  const originalFile = await fs.readFile(resolvedFilePath, 'utf8');

  const generatedFile = utils.string.replaceByDictionary(originalFile, dictionary);

  await fs.writeFile(resolvedFilePath, generatedFile);
  console.log(`File ${resolvedFilePath} updated`);
}

/**
 * Copy the template folder recursively
 * @param  {String} templatePath The template path
 * @param  {String} destPath     The destination
 */
async function copyTemplate(destPath) {
  await utils.files.copyDirRecursive(TEMPLATE_PATH, destPath);
}

async function copyLicense(license, dictionary, destPath) {
  // Get the license file
  const resolvedFilePath = path.join(LICENSES_PATH, license.replace(' ', '-'));
  const originalFile = await fs.readFile(resolvedFilePath, 'utf8');

  // Replace with dictionary
  const generatedFile = utils.string.replaceByDictionary(originalFile, dictionary);

  const licensePath = path.join(destPath, 'LICENSE');

  await fs.writeFile(licensePath, generatedFile);
  console.log(`File ${licensePath} created`);
}

function updateTemplateFiles(dictionary, destPath) {
  const readmePath = path.join(destPath, 'README.md');
  const packagePath = path.join(destPath, 'package.json');

  return Promise.all([
    updateFile(dictionary, readmePath),
    updateFile(dictionary, packagePath),
  ]);
}

module.exports = {
  updateFile,
  copyTemplate,
  copyLicense,
  updateTemplateFiles,
};
