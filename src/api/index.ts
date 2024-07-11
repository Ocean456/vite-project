import axios from 'axios';
import {userStore} from "../store";

// const api = axios.create({baseURL: 'http://localhost:1010'});
const api = axios.create({baseURL: 'http://36.212.25.142:1010'});

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

export const register = (username: string, password: string, email: string, code: string) =>
    api.post('/user/register', {username, password, email, code});

export const sendEmailCode = (email: string) =>
    api.get('/user/code', {params: {email}})

export const getContacts = () =>
    api.get('/contact/personal')

export const searchContact = (username: string) =>
    api.get('/contact/search', {params: {username}})

export const addContact = (username: string) =>
    api.get('/contact/add', {params: {username}})

export const getMessages = () =>
    api.get('/message/personal')

export const getPersonalInfo = () =>
    api.get('/user/info/personal')

export const modifyPersonalInfo = (nickname: string, avatar: string, email: string, phone: string, region: string) =>
    api.post('/user/info/modify', {nickname, avatar, email, phone, region})

export const modifyAvatar = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/user/info/avatar', formData, {headers: {'Content-Type': 'multipart/form-data'}})
}

export const sendMessageToUser = (sender: string, receiver: string, content: string) =>
    api.post('/message/send', {sender, receiver, content})