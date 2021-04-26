import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        userdata:{},
        config: {},
    },
    mutations:{
        setUserdata:(state,userdata)=>{
            state.userdata = userdata
        },
        setConfig: (state, config) => {
            state.config = config;
        },
    }
})

export default store