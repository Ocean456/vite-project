import {defineStore} from "pinia";

export const userStore = defineStore('user', {
    state: () => ({
        username: sessionStorage.getItem('username') || '',
        avatar: '',
        token: localStorage.getItem('token') || '',
    }),
    actions: {
        setToken(token: string) {
            this.token = token
            localStorage.setItem('token', token)
        },
        setUsername(username: string) {
            this.username = username
        },
        setAvatar(avatar: string) {
            this.avatar = avatar
        },
        logout() {
            this.token = ''
            this.username = ''
            this.avatar = ''
            localStorage.removeItem('token')
            sessionStorage.removeItem('username')
        },
        getToken() {
            return this.token
        },
        getUsername() {
            return this.username
        }
    }
})

export const messageStore = defineStore('msg', {
    state: () => ({
        self: userStore().username,
        other: '',
        selfAvatar: '',
        otherAvatar: '',
        otherNickname: ''
    }),
    actions: {
        setOther(other: string) {
            this.other = other
        },
        setOtherAvatar(avatar: string) {
            this.otherAvatar = avatar
        },
        setOtherNickname(nickname: string) {
            this.otherNickname = nickname
        },
        clear() {
            this.other = ''
            this.otherAvatar = ''
            this.otherNickname = ''
        }

    }
})


export const contactStore = defineStore('contact', {
    state: () => ({
        contacts: []
    }),
    actions: {
        setContacts(contacts: any) {
            this.contacts = contacts
        },
        getContact(username: string) {
            return this.contacts.find((contact: any) => contact.contactUsername === username)
        },
        clear() {
            this.contacts = []
        }
    }
})