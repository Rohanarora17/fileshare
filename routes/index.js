const express = require("express");
const shareFileController = require("../controllers/shareFile");
const multer = require("multer");
const router = express.Router();

const upload = multer({ dest: "uploads" });

router.get("/", shareFileController.index);
router.post("/upload", upload.single("file"), shareFileController.uploadFile);
router.get("/file/:id", shareFileController.handleDownload);
router.post("/file/:id", shareFileController.handleDownload);

module.exports = router;
