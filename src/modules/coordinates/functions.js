const fs = require("fs");
const chalk = require("chalk");
const rootPath = require("app-root-path");

const { piloteers } = require("../../../config");

const FILE_PATH = `${rootPath}/${process.env.FILES_DIRECTORY_PATH}`;

const getFileName = fileName => fileName.split('.')[0];

const degreesToRadians = deg => deg * (Math.PI / 180);

const getLinearDistance = (lat, lon) => {
  const { lon: piloteersLon, lat: piloteersLat } = piloteers;

  const earthRadius = 6371; // km
  const startLat = degreesToRadians(parseFloat(piloteersLat));
  const endLat = degreesToRadians(parseFloat(lat));
  const startLon = degreesToRadians(parseFloat(piloteersLon));
  const endLon = degreesToRadians(parseFloat(lon));

  const distanceLat = degreesToRadians(endLat - startLat);
  const distanceLon = degreesToRadians(endLon - startLon);

  const a =
    Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
    Math.sin(distanceLon / 2) *
      Math.sin(distanceLon / 2) *
      Math.cos(startLat) *
      Math.cos(endLat);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = earthRadius * c;

  return Math.round(d * Math.pow(10, 2)) / Math.pow(10, 2);
};

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
  const string = buffer.toString("utf8");
  return string;
};

const bufferToJSON = buffer => {
  const string = bufferToString(buffer);
  const asJSObject = JSON.parse(string);

  return asJSObject;
};

const writeFile = async (buffer, fileName) => {
  if (!buffer) throw new Error("writeFile - No buffer as argument");

  const sanitizedFileName = getFileName(fileName);

  const filePath = `${FILE_PATH}/${sanitizedFileName}.json`;

  try {
    const coordinatesContent = bufferToJSON(buffer);

    const distanceFromPiloteers = getLinearDistance(
      coordinatesContent.lat,
      coordinatesContent.lon
    );

    const result = await writeFileAsPromise(
      filePath,
      JSON.stringify({ ...coordinatesContent, distanceFromPiloteers }),
      {
        encoding: "utf8"
      }
    );

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
      ? JSON.parse(await readFileAsPromise(filePath, { encoding: "utf8" }))
      : await readFileAsPromise(filePath, { encoding: "utf8" });

    return { name, ...fileContent };
  } catch (error) {
    console.error(
      chalk.red(`readFile - Error Reading File: ${JSON.stringify(error)}`)
    );

    throw error;
  }
};

const readAllFiles = async () => {
  try {
    const fileNames = (await readDirectoriesAsPromise(FILE_PATH)).map(
      fileNameWithExtension => fileNameWithExtension.split(".")[0]
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

const getAllFileNames = async () => {
  try {
    const fileNames = (await readDirectoriesAsPromise(FILE_PATH)).map(
      fileNameWithExtension => fileNameWithExtension.split(".")[0]
    );

    return fileNames;
  } catch (error) {
    console.error(
      chalk.red(`getAllFileNames - Error Retrieving File Names: ${JSON.stringify(error)}`)
    );

    throw error;
  }
};

module.exports = {
  bufferToString,
  bufferToJSON,
  writeFile,
  readFile,
  readAllFiles,
  getLinearDistance,
  getAllFileNames
};
