const fs = require('fs');
const chalk = require('chalk');
const rootPath = require('app-root-path');

const { piloteers } = require('../../../config');

const FILE_PATH = `${rootPath}/${process.env.FILES_DIRECTORY_PATH}`;

const degreesToRadians = deg => deg * (Math.PI / 180);
const writeFileAsPromise = (path, data, options) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, options, err => {
      if (err) return reject(err);

      resolve(true);
    });
  });

const readFileAsPromise = (path, options) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, buffer) => {
      if (err) return reject(err);

      resolve(buffer);
    });
  });

const readDirectoriesAsPromise = path =>
  new Promise((resolve, reject) => {
    fs.readdir(path, (err, fileNames) => {
      if (err) return reject(err);

      resolve(fileNames);
    });
  });

const bufferToString = buffer => {
  const string = buffer.toString('utf8');
  return string;
};

const bufferToJSON = buffer => {
  const string = bufferToString(buffer);
  const asJSObject = JSON.parse(string);

  return asJSObject;
};

const writeFile = async (buffer, fileName) => {
  if (!buffer) throw new Error('writeFile - No buffer as argument');

  const filePath = `${FILE_PATH}/${fileName}.json`;

  try {
    const bufferAsString = bufferToString(buffer);

    const result = await writeFileAsPromise(filePath, bufferAsString, {
      encoding: 'utf8'
    });

    return result;
  } catch (error) {
    console.error(
      chalk.red(`writeFile - Error Writting File: ${JSON.stringify(error)}`)
    );

    throw error;
  }
};

const readFile = async (name, asJSON = true) => {
  const filePath = `${FILE_PATH}/${name}.json`;

  try {
    const fileContent = asJSON
      ? JSON.stringify(await readFileAsPromise(filePath, { encoding: 'utf8' }))
      : await readFileAsPromise(filePath, { encoding: 'utf8' });

    return fileContent;
  } catch (error) {
    console.error(
      chalk.red(`readFile - Error Reading File: ${JSON.stringify(error)}`)
    );

    throw error;
  }
};

const readAllFilesAsJSON = async () => {
  try {
    const fileNames = (await readDirectoriesAsPromise(FILE_PATH)).map(
      fileNameWithExtension => fileNameWithExtension.split('.')[0]
    );

    const filesPromises = fileNames.map(fileName => readFile(fileName));

    const filesContent = await Promise.all(filesPromises);

    return filesContent;
  } catch (error) {
    console.error(
      chalk.red(`readAllFiles - Error Reading Files: ${JSON.stringify(error)}`)
    );

    throw error;
  }
};

const getLinearDistance = (lat, lon) => {
  const { lon: piloteersLon, lat: piloteersLat } = piloteers;
  const earthRadius = 6371; // in km

  const pilotLatInRad = degreesToRadians(piloteersLat);
  const lat2InRad = degreesToRadians(lat);

  const resultLon = degreesToRadians(lat - piloteersLon);
  const resultLat = degreesToRadians(lon - piloteersLat);

  const a =
    Math.sin(resultLat / 2) * Math.sin(resultLon / 2) +
    Math.cos(pilotLatInRad) *
      Math.cos(lat2InRad) *
      Math.sin(resultLon / 2) *
      Math.sin(resultLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = earthRadius * c;

  return d;
};
