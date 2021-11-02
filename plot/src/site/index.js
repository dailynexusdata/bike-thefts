/**
 * @author alex
 * @since 2021-10-03
 */
import './styles.scss';
import { csv } from 'd3-fetch';
import makeBikeMap from '../plots/bikemap';

// import plot functions here:
// import makePLOT_NAME from "./PLOT_NAME";

const main = async () => {
  // import data - use csv or json:
  const data = await csv('dist/data/map_since_9_19.csv', (d) => ({
    ...d,
    n: +d.n,
  }));

  const locs = await csv('dist/data/locations.csv');

  const resize = () => {
    // call imported plots here:
    // makePLOT_NAME(data);
    makeBikeMap(data, locs);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
};

main().catch((err) => {
  console.error(err);
});
