const ResumeParser = require("resume-parser-object");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
//starting express
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());
app.listen(process.env.PORT || 5000, () => console.log("Server Started !"));

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

app.get("/",(req,res)=>res.send("hello"));
// Single file
app.post("/upload/single", uploadStorage.single("file"), (req, res) => {
  const {
    file: { originalname },
  } = req;
  ResumeParser.parseResumeFile(`./uploads/${originalname}`, "./files/compiled") // input file, output dir
    .then((hehe) => {
      res.send(hehe);
    })
    .catch((error) => {
      console.error(error);
    });
});
//Multiple files
app.post("/upload/multiple", uploadStorage.array("file", 10), (req, res) => {
  console.log(req.files);
  return res.send("Multiple files");
});
