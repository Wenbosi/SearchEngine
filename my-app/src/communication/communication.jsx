import axios from 'axios'

const TEST_URL = '/test';


export const Test = (username, password) => {
    const message = {
        username:username,
        password:password
    }
    return new Promise((resolve, reject) => {
        axios
        .post(TEST_URL, JSON.stringify(message))
        .then(
            (response) => {
                resolve(response);
            }
        )
        .catch(
            (error) => {
                reject(error.response)
            }
        )
    });
}