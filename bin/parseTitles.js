const fs = require("fs");
const readline = require("readline");

const moviesWithCast = require("../data/moviesWithCast.json");

const fileStream = fs.createReadStream(__dirname + "/../data/title.basics.tsv");

const rl = readline.createInterface({
  input: fileStream,
});

const out = {};

const titlesInMovies = Object.entries(moviesWithCast).map(([title]) => title);

rl.on("line", (line) => {
  const data = line.split("\t");
  const id = data[0];
  const name = data[2];
  const year = data[5];

  if (titlesInMovies.includes(id)) {
    out[id] = `${name} (${year})`;
    console.log(`Added ${id}/${name} (${year})`);
  }
});

rl.on("close", () => {
  fs.writeFileSync(__dirname + "/../data/titles.json", JSON.stringify(out));
});
