import { join } from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

import { Planet } from "./../models/Planet.ts";

export const loadPlanetData = async (): Promise<Array<Planet>> => {
  const path = join(Deno.cwd(), "data/exoplanets.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);

  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });

  Deno.close(file.rid);

  return <Array<Planet>>result;
};

export const getAlienPlanets = (planets: Array<Planet>): Array<Planet> =>
  planets
    .filter(
      ({
        koi_disposition: status,
        koi_prad: radius,
        koi_srad: stellarRadius,
        koi_smass: stellarMass,
      }) =>
        status === "CONFIRMED" &&
        +radius > 0.5 &&
        +radius < 1.5 &&
        +stellarRadius > 0.99 &&
        +stellarRadius < 1.01 &&
        +stellarMass > 0.78 &&
        +stellarMass < 1.04
    )
    .map(({ kepler_name, koi_prad, koi_smass, koi_srad }) => ({
      kepler_name,
      koi_prad,
      koi_smass,
      koi_srad,
    }));

export const getAvailablePlanets = async () =>
  getAlienPlanets(await loadPlanetData());
