const Functions = require('./functions');

const uploadPlace = async (req, res, next) => {
  const { file } = req;
  const { originalname, buffer } = file;

  await Functions.writeFile(buffer, originalname);

  return res.status(201).json({
    success: true,
    message: `Coordinates for ${originalname}`
  });
};

const getOnePlace = async (req, res, next) => {
  const { name } = req.params;

  const fileNames = await Functions.getAllFileNames();
  const isInFileNames = fileNames.includes(name);

  if (!isInFileNames)
    return res
      .status(404)
      .json({ success: false, message: `Place With Name ${name} Not Found` });

  const fileContent = await Functions.readFile(name);

  return res.status(200).json({ success: true, place: { ...fileContent } });
};

const getAllPlaces = async (req, res, next) => {
  const files = await Functions.readAllFiles();

  return res.status(200).json({ success: true, places: [...files] });
};

module.exports = {
  uploadPlace,
  getOnePlace,
  getAllPlaces
};
