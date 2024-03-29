import { map, tileLayer, svg } from 'leaflet';
import { select } from 'd3-selection';
import 'leaflet/dist/leaflet.css';

class GetMap {
  constructor(
    id,
    includeButton = true,
    mapCenter = [34.41312927423142, -119.85940933052918],
    mapZoom = 14,
    args = {},
  ) {
    this.mapType = 'simple';
    const container = select(`#${id}`);
    const width = Math.min(window.innerWidth - 40, 600);

    container
      .append('div')
      .attr('id', `${id}-map`)
      .style('height', '500px')
      .style('width', `${width}px`);

    if (includeButton) {
      container
        .append('div')
        .style('display', 'flex')
        .style('justify-content', 'flex-end')
        .style('margin', '10px')
        .style('width', `${width}px`)
        .append('button')
        .attr('id', `${id}-switchMapButton`)
        .attr('class', 'campusMapButton')
        .text('Switch Map');
    }

    const Lmap = map(`${id}-map`, { zoomControl: false, ...args }).setView(
      mapCenter,
      mapZoom,
    );

    const simpleMap = tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">'
          + 'OpenStreetMap</a> contributors &copy;'
          + ' <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      },
    );

    const satelliteMap = tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/'
        + 'MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, '
          + 'GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, '
          + 'and the GIS User Community',
      },
    );

    if (includeButton) {
      select(`#${id}-switchMapButton`).on('click', () => {
        if (this.mapType === 'simple') {
          Lmap.removeLayer(simpleMap);
          Lmap.addLayer(satelliteMap);
          this.mapType = 'satellite';
        }
        else {
          Lmap.removeLayer(satelliteMap);
          Lmap.addLayer(simpleMap);
          this.mapType = 'simple';
        }
      });
    }

    // add svg over the map:
    Lmap.addLayer(simpleMap);
    svg().addTo(Lmap);

    const overlay = select(Lmap.getPanes().overlayPane);
    const Lsvg = overlay.select('svg');

    return [Lmap, Lsvg];
  }
}

export default GetMap;
