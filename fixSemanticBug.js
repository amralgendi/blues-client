const fs = require("fs"),
  fileLists = [
    `./node_modules/semantic-ui-css/semantic.min.css`,
    `./node_modules/semantic-ui-css/semantic.css`,
  ];
fileLists.forEach((fileList) => {
  fs.readFile(fileList, function (err, data) {
    if (err) throw err;
    data = data.toString().replace(";;", ";");
    fs.writeFile(fileList, data, function (err) {
      err || console.log("Data replaced \n");
    });
  });
});
