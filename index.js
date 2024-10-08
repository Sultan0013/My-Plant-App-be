const express = require("express");
const cors = require("cors");
const app = express();
const {
  registerUser,
  loginUser,
  addPlant,
  getPlants,
  getUserInfo,
  deletePlant,
  updatePlantNickname,
  updateUsername,
  getAllEndpoints,
  getPlant,
  updatePlantWatering,
  updateUserRewards,
  markPlantAsDead,
  getGraveyardPlants,
} = require("./controller/controllers.js");

app.use(cors());

app.use(express.json());

app.get("/api", getAllEndpoints);

app.post("/api/register", registerUser);

app.post("/api/login", loginUser);

app.post("/api/users/:username/plants", addPlant);

app.get("/api/users/:username/plants/:plantId", getPlant);

app.get("/api/users/:username", getUserInfo);
app.get("/api/users/:username/plants_graveyard", getGraveyardPlants);
app.get("/api/users/:username/plants", getPlants);

app.delete("/api/users/:username/plants/:plantId", deletePlant);

app.patch("/api/users/:username/plants/:plantId", updatePlantNickname);

app.patch("/api/users/:currentUsername", updateUsername);

app.patch("/api/users/:username/plants/:plantId/water", updatePlantWatering);

app.patch("/api/users/:username/rewards", updateUserRewards);

app.patch("/api/users/:username/plants/:plantId/dead", markPlantAsDead);

//ERROR HANDLERS

app.use((err, req, res, next) => {
  if (err.name === "MongoServerError") {
    switch (err.code) {
      case 11000:
        res.status(409).send({ msg: "Already exists!" });
        break;
      case 121:
        res.status(400).send({ msg: "Bad request, please check input." });
        break;
      default:
        res
          .status(500)
          .send({ msg: "A database error occurred. Please try again later." });
        break;
    }
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.errors) {
    const message = err.errors.email.properties.message;

    res.status(400).send(message);
  } else if (err.kind === "ObjectId") {
    res.status(404).send({ message: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).send({ msg: "Internal server error." });
});

// app.listen(9000, () => {
//   console.log("Listening on port 9000!!!!");
// });

module.exports = app;
