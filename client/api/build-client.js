import axios from "axios";

// this helper function changes depending on the type of environment where it is making the request
// if this request is made on the server (during SSR), need to configure axios to be used differently
// it returns an instance of axios that has some preconfigured configurations based on environment
export default ({ req }) => {
    if (typeof window === 'undefined') {
        // on the server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        // on the browser
        return axios.create({
            baseUrl: '/'
        });
    }
};