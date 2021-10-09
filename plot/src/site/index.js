/**
 * @author alex
 * @since 2021-10-03
 */
import './styles.scss';
import { csv, json } from 'd3-fetch';
import { timeParse } from 'd3-time-format';
import makeBikeMap from '../plots/bikemap';

// import plot functions here:
// import makePLOT_NAME from "./PLOT_NAME";

const main = async () => {
  // import data - use csv or json:
  const time = timeParse('%Y-%m-%d');

  const data = await csv('dist/data/location_data.csv', (d) => ({
    ...d,
    date: time(d.date),
  }));

  const locs = await json('dist/data/locations.json');

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
