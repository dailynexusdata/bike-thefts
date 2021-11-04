import { max } from 'd3-array';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { latLng } from 'leaflet';
import GetMap from './getMap';

const getLatLng = (map, { lat, lon }) => {
  // eslint-disable-next-line new-cap
  const ll = new latLng(+lat, +lon);
  return map.latLngToLayerPoint(ll);
};

const main = (data, locs) => {
  const container = select('#bike-theft-loc-map-container').attr(
    'class',
    'bike-thefts',
  );

  container.append('h1').text('Locations of Bike Thefts From 9/19 - 10/18');
  container.append('div').attr('id', 'bike-theft-loc-map');

  container
    .append('a')
    .attr(
      'href',
      'https://www.police.ucsb.edu/sites/default/files/UCSB%20Crime%20Log.pdf',
    )
    .text('Source: UCPD Daily Crime Log');

  const [map, svg] = new GetMap('bike-theft-loc-map', false);

  const combined = data.map((d) => ({
    ...d,
    ll: locs.find((l) => l.building === d.loc),
  }));

  console.log(combined);

  const r = scaleLinear()
    .domain([0, max(combined, (d) => d.n)])
    .range([2, 8]);

  const svgG = svg.append('g');
  const update = () => {
    const circs = svg.selectAll('.bike-theft-circlePts').data(combined);

    circs
      .enter()
      .append('circle')
      .attr('class', 'bike-theft-circlePts')
      .attr('fill', '#E15759')
      .attr('r', (d) => r(d.n))
      .attr('cx', (d) => getLatLng(map, d.ll).x)
      .attr('cy', (d) => getLatLng(map, d.ll).y);

    circs
      .attr('cx', (d) => getLatLng(map, d.ll).x)
      .attr('cy', (d) => getLatLng(map, d.ll).y);
    const pt = getLatLng(map, {
      lat: 34.403243170284576,
      lon: -119.88137054417167,
    });
    svgG.attr('transform', `translate(${pt.x}, ${pt.y})`);

    const legend = svgG
      .selectAll('.bike-theft-map-leg')
      .data([1, 5, 11])
      .enter()
      .append('g')
      .attr('class', 'bike-theft-map-leg');

    legend
      .append('circle')
      .attr('r', (d) => r(d))
      .attr('cx', (d, i) => i * 40 + 5)
      .attr('fill', '#E15759')
      .attr('fill-opacity', 0.9)
      .attr('cy', 25);

    legend
      .append('text')
      .text((d, i) => d + (i === 2 ? ' thefts' : ''))
      .attr('x', (d, i) => i * 40)
      .attr('y', 55)
      .attr('fill', '#E15759')
      .attr('text-anchor', 'start')
      .attr('font-size', '13pt');

    legend
      .append('text')
      .text('Bike Thefts Since 9/19/2021')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#E15759')
      .attr('font-size', '15pt');
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
