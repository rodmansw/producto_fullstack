import axios from 'axios';

axios.defaults.headers.common.Accept = 'application/json';

const fetch = (endpoint) => {
    return axios
        .get(endpoint)
        .then((res) => res)
        .catch((err) => {
        console.error(
            'Error catch in Apiutils at fetch method. It will be thrown...');
        throw err;
        });
    }

const fetchGql = (config) => {
    let endpointUri = `http://localhost:${process.env.REACT_APP_API_PORT}`

    if (process.env.NODE_ENV === 'production') {
        endpointUri = `${process.env.REACT_APP_API_URL}/v1/graphql`
    }

    return axios
        .post(`${endpointUri}/v1/graphql`, config)
        .then((res) => res)
        .catch((err) => {
            console.error(
                'Error catch in Apiutils at fetch method. It will be thrown...');
            throw err;
        });
}

export const getPoints = () => {
    const config = {
        query: `{
            points {
                latitude
                longitude
            }
        }`
    };

    return fetchGql(config)
      .then(res=> {
        const data = res.data.data.points.map(point => ({
            lat: point.latitude,
            lng: point.longitude
        }));
        return data;
      });
  };

  export const getAddress = (lat, lng) => {
    const query = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    return fetch(query)
        .then(res=> {
            return res.data.display_name;
        });
};