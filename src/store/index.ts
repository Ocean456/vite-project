import {defineStore} from "pinia";

export const userStore = defineStore('user', {
    state: () => ({
        username: localStorage.getItem('username') || '',
        avatar: '',
        nickname: '',
        token: localStorage.getItem('token') || '',
    }),
    actions: {
        setToken(token: string) {
            this.token = token
            localStorage.setItem('token', token)
        },
        init(username: string, avatar: string) {
            this.username = username
            this.avatar = avatar
            localStorage.setItem('username', username)
        },
        logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
        },
        getToken() {
            return this.token
        },
    },

})

export const messageStore = defineStore('msg', {
    state: () => ({
        // username
        self: '',
        other: '',
        selfAvatar: '',
        otherAvatar: '',
        otherNickname: '',
        type: ''
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
        setType(type: string) {
            this.type = type
        },
        switchUser(other: string, otherAvatar: string, otherNickname: string, type: string) {
            this.other = other
            this.otherAvatar = otherAvatar
            this.otherNickname = otherNickname
            this.type = type
        },
        clear() {
            this.self = userStore().username
            this.selfAvatar = ''
            this.other = ''
            this.otherAvatar = ''
            this.otherNickname = ''
        }

    },

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
        getContacts() {
            return this.contacts
        },
        clear() {
            this.contacts = []
        },
    }
})


export const groupStore = defineStore('group', {
    state: () => ({
        groups: []
    }),
    actions: {
        setGroups(groups: any) {
            this.groups = groups
        },
        getGroup(number: string) {
            return this.groups.find((group: any) => group.groupId === number)
        },
        getGroups() {
            return this.groups
        },
        clear() {
            this.groups = []
        },
    }
})
