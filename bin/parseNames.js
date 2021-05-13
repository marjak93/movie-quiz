const fs = require("fs");
const readline = require("readline");

const moviesWithCast = require("../data/moviesWithCast.json");

const fileStream = fs.createReadStream(__dirname + "/../data/name.basics.tsv");

const rl = readline.createInterface({
  input: fileStream,
});

const out = {};

const castInMovies = Object.entries(moviesWithCast).flatMap(([, cast]) => cast);

rl.on("line", (line) => {
  const data = line.split("\t");
  const id = data[0];
  const name = data[1];

  if (castInMovies.includes(id)) {
    out[id] = name;
    console.log(`Added ${id}/${name}`);
  }
});

rl.on("close", () => {
  fs.writeFileSync(__dirname + "/../data/cast.json", JSON.stringify(out));
});
