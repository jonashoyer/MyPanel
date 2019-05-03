import axios from "axios";


// const apiUrl = process.env.NODE_ENV === "production" ? "35.204.22.183:3001" : "";
// const apiUrl = "http://35.204.22.183:3001";
const apiUrl = "http://35.204.22.183:3001";

export default {
    user:{
      login: credentials => axios.post(apiUrl+"/api/auth", { credentials }).then(res => res.data.user),
      signup: user => axios.post(apiUrl+"/api/users", { user }).then(res => res.data.user),
      confirm: token => axios.post(apiUrl+"/api/auth/confirmation", { token }).then(res => res.data.user),
      resetPasswordRequest: email => axios.post(apiUrl+"/api/auth/reset_password_request", { email }),
      validateToken: token => axios.post(apiUrl+"/api/auth/validate_token", { token }),
      resetPassword: data => axios.post(apiUrl+"/api/auth/reset_password", { data })
    },
    lists:{
      fetchAll: () => axios.get(apiUrl+"/api/list").then(res => res.data.lists),
      create: name => axios.post(apiUrl+"/api/list",{name}).then(res => res.data.list),
      rename: (id,value) => axios.post(apiUrl+"/api/list/rename",{id,value}).then(res => res.data),
      delete: id => axios.post(apiUrl+"/api/list/delete",{id}).then(res => res.data),
      order: changes => axios.post(apiUrl+"/api/list/order",changes),
      addUser: props => axios.post(apiUrl+"/api/list/add-user",props).then(res => res.data),
      removeUser: props => axios.post(apiUrl+"/api/list/remove-user",props).then(res => res.data),
      getHidden: () => axios.get(apiUrl+"/api/list/hidden").then(res => res.data),
      setVisibility: (id,state) => axios.post(apiUrl+"/api/list/visible",{id,state}).then(res => res.data),

      fetchEncryptionKey: id => axios.post(apiUrl+"/api/list/encrytion-key",{id}).then(res => res.data),
      createEncrytionKey: (id,key) => axios.post(apiUrl+"/api/list/create-encryption-key",{id,key}).then(res => res.data),
      removeEncryptionKey: (id,key) => axios.post(apiUrl+"/api/list/remove-encryption-key",{id,key}).then(res => res.data),
      confirmeEncryptionKey: (id,key) => axios.post(apiUrl+"/api/list/create-encyption",{id,key}).then(res => res.data)
    },
    todo:{
      fetch: id => axios.post(apiUrl+"/api/todo/get",{id}).then(res => res.data),
      create: props => axios.post(apiUrl+"/api/todo/create",props).then(res => res.data),
      rename: props => axios.post(apiUrl+"/api/todo/rename",props).then(res=>res.data),
      delete: (id, todoId)=> axios.post(apiUrl+"/api/todo/delete",{id,todoId}).then(res=>res.data),
      setState: (id, todoId, value) => axios.post(apiUrl+"/api/todo/set-state",{id, todoId, value}).then(res => res.data),
      fetchNote: (id,todoId) => axios.post(apiUrl+"/api/todo/get-note",{id,todoId}).then(res => res.data.notes),
      setNote: props => axios.post(apiUrl+"/api/todo/set-note",props).then(res => res.data),
      order: data => axios.post(apiUrl+"/api/todo/order",data),
      addTag: data => axios.post(apiUrl+"/api/todo/add-tag",data),
      removeTag: data => axios.post(apiUrl+"/api/todo/remove-tag",data)
    },
    pass:{
      fetch: id => axios.post(apiUrl+"/api/password/get",{id}).then(res => res.data),
      create: props => axios.post(apiUrl+"/api/password/create",props).then(res => res.data),
      edit: props=> axios.post(apiUrl+"/api/password/edit",props).then(res=>res.data),
      delete: (id, passId)=> axios.post(apiUrl+"/api/password/delete",{id,passId}).then(res=>res.data),
      order: data => axios.post(apiUrl+"/api/password/order",data),
    },
    time:{
      fetch: id => axios.post(apiUrl+"/api/time/get",{id}).then(res => res.data),
      fetchActive: () => axios.get(apiUrl+"/api/time/timer").then(res => res.data),
      start: props => axios.post(apiUrl+"/api/time/start",props).then(res => res.data),
      continue: (id, timeId) => axios.post(apiUrl+"/api/time/continue",{id, timeId}).then(res => res.data),
      stop: (spanId) => axios.post(apiUrl+"/api/time/stop",{spanId}).then(res => res.data),
      rename: props => axios.post(apiUrl+"/api/time/rename",props).then(res => res.data),
      delete: (value) => axios.post(apiUrl+"/api/time/delete",{...value}).then(res => res.data),
      create: props => axios.post(apiUrl+"/api/time/create",props).then(res => res.data),
      span:{
        create: (id,value) => axios.post(apiUrl+"/api/time/create-span",{...id, ...value}).then(res => res.data),
        edit: data => axios.post(apiUrl+"/api/time/edit-span",data).then(res => res.data),
        delete: (value) => axios.post(apiUrl+"/api/time/remove-span",{...value}).then(res => res.data)
      },
      overview: (id,span) => axios.post(apiUrl+"/api/time/overview",{id,span}).then(res => res.data)
    },
    note:{
      fetch: id => axios.post(apiUrl+"/api/note/",{id}).then(res => res.data),
      create: id => axios.post(apiUrl+"/api/note/add",{id}).then(res => res.data),
      _delete: data => axios.post(apiUrl+"/api/note/delete",data).then(res => res.data),
      setNote: data => axios.post(apiUrl+"/api/note/set",data),
      order: data => axios.post(apiUrl+"/api/note/order",data),
    },
    tag:{
      fetch: id => axios.post(apiUrl+"/api/tags/",{id}).then(res => res.data),
      create: props => axios.post(apiUrl+"/api/tags/create",props).then(res => res.data),
      _delete: props => axios.post(apiUrl+"/api/tags/delete",props).then(res => res.data)
    },
    overview:{
      fetch: id => axios.post(apiUrl+"/api/overview",{id}).then(res => res.data),
      timers: (id,span) => axios.post(apiUrl+"/api/overview/timer",{id,span}).then(res => res.data),
    },
    beta:{
      betaInvite: email => axios.post(apiUrl+"/api/beta/whitelist",{email})
    },
    setting:{
      fetch: id => axios.post(apiUrl+"/api/setting/",{id}).then(res => res.data),
      set: (id,name,value) => axios.post(apiUrl+"/api/setting/set",{id,name,value}).then(res => res.data)
    }
}