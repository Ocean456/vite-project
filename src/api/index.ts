import axios from 'axios';
import {userStore} from "../store";


const api = axios.create({baseURL: 'http://localhost:1010'});

api.interceptors.request.use(function (config: any) {
    if (!config.url.startsWith('/user/login') || !config.url.startsWith('/user/register')) {
        config.headers['Authorization'] = 'Bearer ' + userStore().getToken()
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export const login = (username: string, password: string) =>
    api.post('/user/login', {username, password});

export const register = (username: string, password: string) =>
    api.post('/user/register', {username, password});

export const getContacts = () =>
    api.get('/contact/personal')

export const getMessages = () =>
    api.get('/message/personal')

export const getPersonalInfo = () =>
    api.get('/user/info/personal')

export const modifyPersonalInfo = (nickname: string, avatar: string, email: string, phone: string, region: string) =>
    api.post('/user/info/modify', {nickname, avatar, email, phone, region})

export const sendMessageToUser = (sender: string, receiver: string, content: string) =>
    api.post('/message/send', {sender, receiver, content})