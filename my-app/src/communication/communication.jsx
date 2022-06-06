import axios from 'axios'

const SEARCH_URL = '/search';
const PREDICT_URL = '/predict';
const UPLOAD_URL = '/upload'

export const Search = (message) => {
    return new Promise((resolve, reject) => {
        axios
        .post(SEARCH_URL, JSON.stringify(message))
        .then(
            (response) => {
                const data = response.data.data
                const dataList = response.data.data.results
                const length = dataList.length
                let r = {}
                let list = []
                for(let i = 0; i < length; i++) {
                    const item = {
                        img : "http://127.0.0.1:8000/source?id=" + dataList[i].id,
                        // labels : dataList[i].labels,
                        label : "图片",
                        width : dataList[i].width,
                        height : dataList[i].height,
                    }
                    list.push(item)
                }
                r['data'] = list
                r['count'] = data.count
                r['pages'] = data.pages
                r['time'] = data.time
                r['correction'] = data.correction
                resolve(r)
            }
        )
        .catch(
            (error) => {
                reject(error.response)
            }
        )
    });
}

export const Predict = (message) => {
    return new Promise((resolve, reject) => {
        axios
        .post(PREDICT_URL, JSON.stringify(message))
        .then(
            (response) => {
                const data = response.data.data.predictions
                console.log(data)
                let length = (data.length > 6) ? 6 : data.length;
                let list = []
                for(let i = 0; i < length; i++) {
                    const item = { word : data[i]}
                    list.push(item)
                }
                resolve(list)
            }
        )
        .catch(
            (error) => {
                reject(error.response)
            }
        )
    });
}


export const Upload = (image) => {
    return new Promise((resolve, reject) => {
        axios
        .post(UPLOAD_URL, image)
        .then(
            (response) => {
                const id = response.data.data.id;
                resolve(id)
            }
        )
        .catch(
            (error) => {
                reject(error.response)
            }
        )
    });
}