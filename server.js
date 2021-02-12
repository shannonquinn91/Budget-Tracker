const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useFindAndModify: false,
  useCreateIndex: true
});

// routes
app.use(require("./routes/api.js"));
require('./routes/html-routes')(app);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

{/* <script type="text/javascript">
    (function () {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js", { scope: "/" })
          .then(() => console.log("Service Worker registered successfully."))
          .catch(error => console.log("Service Worker registration failed:", error));
      }
    })();
  </script> */}