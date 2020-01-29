import axios from 'axios';

const instance = axios.create({
    baseURL: '/cgi-bin/miniQ'
//    baseURL: 'http://localhost/cgi-bin/miniQ'

    //baseURL: 'http://pit.lbto.org/cgi-bin/miniQ'

});

//instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// instance.interceptors.request...

export default instance;