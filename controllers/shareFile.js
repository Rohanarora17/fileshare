const bcrypt = require("bcrypt");
const File = require("../models/File");
const schedule = require("node-schedule");
const fs = require("fs");

const job = schedule.scheduleJob("* * */1 * * *", function () {
  const fileNames = fs.readdirSync("./uploads").filter((files)=>files!=".gitkeep");
  fileNames.forEach((result) => {
    const pathName = "uploads\\" + result;
    File.exists({ path: pathName }, function (err, doc) {
      if (err) console.log(err);
      else {
        if (doc == null) {
          fs.unlinkSync("./uploads/" + result);
        }
      }
    });
  });
});

exports.index = (req, res) => {
  res.render("index");
};

exports.uploadFile = async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await File.create(fileData);

  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
};

exports.handleDownload = async (req, res) => {
  const file = await File.findById(req.params.id);

  if(file == null){
    res.render("download",{ expired: true });
  }else{
    if (file.password != null) {
      if (req.body.password == null) {
        res.render("download");
        return;
      }
  
      if (!(await bcrypt.compare(req.body.password, file.password))) {
        res.render("download", { error: true });
        return;
      }
    }
  }

  if(file != null){
    file.downloadCount++;
    await file.save();

    res.download(file.path, file.originalName);
  }

};
