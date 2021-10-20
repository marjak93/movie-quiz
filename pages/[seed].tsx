import { useEffect, useReducer, useRef } from "react";
import { GetServerSideProps } from "next";
import { nanoid } from "nanoid";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import titles from "../data/titles.json";
import cast from "../data/cast.json";

interface Movie {
  title: string;
  cast: string[];
}

interface CastMember {
  id: string;
  name: string;
}

interface Props {
  movieA: Movie;
  movieB: Movie;
  intersectingCast: CastMember[];
}

export default function Page({ movieA, movieB, intersectingCast }: Props) {
  const [hasGivenUp, setHasGivenUp] = useReducer(() => true, false);
  const [correctGuesses, addToCorrectGuesses] = useReducer(
    (state: CastMember[], entry: CastMember) => [...state, entry],
    []
  );

  const inputRef = useRef();

  useEffect(() => {}, []);

  const handleInput = (e) => {
    const guess = e.target.value.toLowerCase();
    const guessIdx = intersectingCast.findIndex(
      (c) => c.name.toLowerCase() === guess
    );

    if (guessIdx !== -1) {
      addToCorrectGuesses(intersectingCast[guessIdx]);

      // @ts-ignore
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl p-8 mx-auto">
      <Head>
        <title>Movie Quiz</title>
        <meta name="description" content="My App" />
      </Head>

      <main className="flex-grow mt-4 lg:mt-16">
        <ul>
          <li>Movie A: {titles[movieA.title]}</li>
          <li>Movie B: {titles[movieB.title]}</li>
        </ul>

        <div className="mt-16">
          There{" "}
          {intersectingCast.length === 1
            ? `is 1 cast or crew member`
            : `are ${intersectingCast.length} cast or crew members`}{" "}
          that appear in both movies.
        </div>

        <div className="mt-8">
          <input
            ref={inputRef}
            type="text"
            placeholder="Guess..."
            onChange={handleInput}
            disabled={hasGivenUp}
            className="p-2 border border-black border-solid"
          />
        </div>

        <ul className="mt-4">
          {intersectingCast.map((c, i) => {
            const isGuessed = correctGuesses.some((g) => g.id === c.id);

            if (!hasGivenUp && !isGuessed) {
              return (
                <li key={c.id} className="my-2 italic">
                  Unknown #{i + 1}
                </li>
              );
            }

            return (
              <li key={c.id} className="my-2">
                {isGuessed ? "✅" : "❌"} {c.name}
              </li>
            );
          })}
        </ul>

        <div className="space-x-4">
          <button
            className="px-3 mt-16 text-white bg-gray-500 h-12"
            onClick={setHasGivenUp}
          >
            Show answers
          </button>

          <Link href={`/${nanoid()}`} passHref>
            <a className="px-3 text-white bg-blue-600 h-12">Next</a>
          </Link>
        </div>
      </main>
      <footer>
        <a
          href="https://github.com/marjak93/movie-quiz"
          target="_blank"
          rel="noopener"
        >
          <Image
            src="/GitHub-Mark-64px.png"
            alt="GitHub"
            width="32"
            height="32"
          />
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params: { seed },
}) => {
  const seedrandom = require("seedrandom");
  const moviesWithCast = require("../data/moviesWithCast.json");

  const rng = seedrandom(seed);

  // Pick two movies with intersecting cast
  let movieA: Movie,
    movieB: Movie,
    intersectingCast: string[] = [],
    i = 0,
    j = 1;

  const shuffledMovies = Object.entries(moviesWithCast)
    .map(([title, cast]: [string, string[]]) => ({
      title,
      cast,
    }))
    .sort(() => rng() - rng());

  while (intersectingCast.length === 0 && i !== shuffledMovies.length - 1) {
    movieA = shuffledMovies[i];
    movieB = shuffledMovies[j];

    intersectingCast = movieA.cast.filter((c) => movieB.cast.includes(c));

    if (j === shuffledMovies.length - 1) {
      i = 1;
      j = 2;
    } else {
      j++;
    }
  }

  return {
    props: {
      key: seed,
      movieA,
      movieB,
      intersectingCast: intersectingCast.map((id) => ({ id, name: cast[id] })),
    },
  };
};
