const fs = require("fs");
const readline = require("readline");

const movies = require("../data/movies.json");

const fileStream = fs.createReadStream(
  __dirname + "/../data/title.principals.tsv"
);

const rl = readline.createInterface({
  input: fileStream,
});

const out = {};

rl.on("line", (line) => {
  const data = line.split("\t");
  const title = data[0];
  const name = data[2];

  if (!movies.includes(title)) {
    return;
  }

  if (out[title]) {
    out[title].push(name);
  } else {
    out[title] = [name];
    console.log(`Created ${title} entry`);
  }

  console.log(`Added ${name} to ${title} entry`);
});

rl.on("close", () => {
  fs.writeFileSync(
    __dirname + "/../data/moviesWithCast.json",
    JSON.stringify(out)
  );
});
