import { max } from 'd3-array';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { latLng } from 'leaflet';
import GetMap from './getMap';

const getLatLng = (map, { lat, lng }) => {
  // eslint-disable-next-line new-cap
  const ll = new latLng(lat, lng);
  return map.latLngToLayerPoint(ll);
};

const main = (data, locs) => {
  const container = select('#bike-theft-loc-map-container').attr(
    'class',
    'bike-thefts',
  );

  container
    .append('h1')
    .text('Bike lot locations of larceny/theft/vandalism since August');
  container.append('div').attr('id', 'bike-theft-loc-map');

  container
    .append('a')
    .attr(
      'href',
      'https://www.police.ucsb.edu/sites/default/files/UCSB%20Crime%20Log.pdf',
    )
    .text('Source: UCPD Daily Crime Log');

  const [map, svg] = new GetMap('bike-theft-loc-map');

  const combined = nest()
    .key((d) => d.loc)
    .entries(
      data.map((d) => ({
        ...d,
        ll: locs.find((l) => l.name === d.loc),
      })),
    );

  const r = scaleLinear()
    .domain([0, max(combined, (d) => d.values.length)])
    .range([2, 10]);

  const update = () => {
    const circs = svg.selectAll('circle').data(combined);

    circs
      .enter()
      .append('circle')
      .attr('fill', '#E15759')
      .attr('r', (d) => r(d.values.length))
      .attr('cx', (d) => getLatLng(map, d.values[0].ll).x)
      .attr('cy', (d) => getLatLng(map, d.values[0].ll).y);

    circs
      .attr('cx', (d) => getLatLng(map, d.values[0].ll).x)
      .attr('cy', (d) => getLatLng(map, d.values[0].ll).y);
  };

  map.on('moveend', () => {
    update();
  });

  map.on('click', (d) => {
    console.log(d);
  });

  update();
};
export default main;
