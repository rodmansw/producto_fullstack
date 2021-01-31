import React, { useRef, useEffect } from 'react';
import * as L from 'leaflet';
// eslint-disable-next-line
import carto from '@carto/carto.js';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { getAddress, getPoints } from '../Utils/ApiUils';
import './Map.css';

function Map (props) {
  const {
    lat,
    lng,
    zoom,
    basemapURL,
    requestPoint,
  } = props;

  let username = '';
  let apiKey = '';
  let tableName = '';
  if (process && process.env) {
    if(process.env.REACT_APP_USERNAME) {
      username = process.env.REACT_APP_USERNAME;
    }
    if(process.env.REACT_APP_API_KEY) {
      apiKey = process.env.REACT_APP_API_KEY;
    }
    if(process.env.REACT_APP_TABLE_NAME) {
      tableName = process.env.REACT_APP_TABLE_NAME;
    }
  }
  
  const map = useRef({});

  requestPoint.current = async () => {
    const pointsLayer = await createPointsLayer(username, apiKey, tableName);
    const popup = L.popup({ closeButton: true });
    pointsLayer.addTo(map.current);
    
    pointsLayer.eachLayer(async point=> {
      point.on('click', async e => {
        let htmlContent;
        const address = await getAddress(lat, lng);
        htmlContent = makeMarkupOnePoint(e.latlng.lat, e.latlng.lng, address);
        popup.setContent(htmlContent);
        popup.setLatLng(e.latlng);
        if (!popup.isOpen()) {
          popup.openOn(map.current);
        }
      });
    });
  };
  
    
  useEffect(() => {
    // Avoid Map container is already initialized error when refreshing or saving
    if (typeof map.current.remove === 'function') {
      map.current.remove()
    }

    map.current = L.map('map', {
      center: [lat, lng],
      zoom,
      zoomControl: false
    });
    const basemap = L.tileLayer(basemapURL, {
      detectRetina: true,
      retina: '@2x',
    });
    basemap.addTo(map.current)

  }, [
    lat,
    lng,
    zoom,
    basemapURL,
  ]);
  return (
    <div id="map"/>
  );
}
    
const createPointsLayer = async (user, key, tableName) => {
  const pointData = await getPoints(user, key, tableName).then(data => data);
  const pointsArray = pointData.map(p => {
    const circleMarker = L.circleMarker(p, {
      color: '#3388ff'
    }).setRadius(1);
    return circleMarker;
  });

  return L.layerGroup(pointsArray);
};
    
function makeMarkupOnePoint(lat, lng, info = '') {
  return `
    <div class="widget">
    ${lat ? `
    <h3>${lat}, ${lng}</h3>
    `: ''}
    ${info ? `
    <h4>${info}</h4>
    `: '<h4>No hay dirección</h4>'}
    </div>
  `;
}

Map.propTypes = {
  basemapURL: PropTypes.string,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  requestPoint: PropTypes.shape({
    current: PropTypes.func,
  })
};

Map.defaultProps = {
  zoom: 13,
  basemapURL: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
  requestPoint: {
    current: () => {},
  }
}
    
export default Map;
    
