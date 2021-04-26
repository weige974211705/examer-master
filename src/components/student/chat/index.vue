<template>
    <div id="student-chat">
        <div class="wrapper">
            <div class="container">
                <div class="left">
                    <div class="top">
                        <input type="text" placeholder="Search" />
                        <a href="javascript:;" class="search"></a>
                    </div>
                    <ul class="people">
                        <li :class="{'person':true,'active':index===chatIndex}" data-chat="person1" v-for="(item,index) in chatList" :key="index" @click="changeClass(index)">
                            <img :src="item.imgurl" alt="" />
                            <span class="name">{{item.title}}</span>
                            <span class="preview">{{item.desc}}</span>
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <div class="top"><span>To: <span class="name">{{title}}</span></span></div>
                    <div class="chat active-chat" data-chat="person2">
                        <div :class="{'bubble':true,'you':item.username !== userdata.username, 'me':item.username === userdata.username}" v-for="(item,index) in chats" :key="index">
                            <span>{{item.username}}</span>
                            <div class="head">
                                <img :src="'/api'+item.headPortrait" />
                            </div>
                            {{item.msg}}
                        </div>
                        <div id="bot" style="width:100px;height:50px;"></div>
                    </div>
                    <div class="write">
                        <!-- <a href="javascript:;" class="write-link attach"></a> -->
                        <input type="text" v-model="sendData" @keyup.enter="send"/>
                        <!-- <a href="javascript:;" class="write-link smiley"></a> -->
                        <a href="javascript:;" class="write-link send" @click="send"></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            title:'',
            userdata: {},
            sendData: '',
            chatList:[],
            classId:'',
            chatIndex: 0,
            friends:{
                list: document.querySelector('ul.people'),
                all: document.getElementsByClassName('person'),
                name: '' 
            },
            chat: {
                container: document.querySelector('.container .right'),
                current: null,
                person: null,
                name: document.querySelector('.container .right .top .name'),
            },
            timer:0,
            getClassNum: 0,
        };
    },
    computed:{
        chats(){
            return this.chatList[this.chatIndex].chatlist;
        },
        students(){
            return this.chatList[this.chatIndex].studentlist;
        },
    },
    created(){
        this.userdata = this.$store.state.userdata
        this.timer = setInterval(()=>{
            this.getClass();
        }, 700);
    },
    destroyed(){
        clearInterval(this.timer);
    },
    mounted() {
        this.init();
    },
    methods: {
        changeClass(index){
            this.chatIndex = index;
            this.classId = this.chatList[index].paperid;
            this.title = this.chatList[this.chatIndex].title;
            document.getElementById('bot').scrollIntoView(true);
        },
        send() {
            const sD = {
                token:localStorage.getItem('token'),
                msg: this.sendData,
                paperid: this.classId,
            };
            this.$http.post('/api/student/sendmessage',sD).then(res=>{
                console.log(res);
                document.getElementById('bot').scrollIntoView(true);
                this.sendData = '';
            })
        },
        init() {
            // document.querySelector('.chat[data-chat=person2]').classList.add('active-chat');
            // 让滚动条自动在最底部
            // const divlist = document.getElementsByClassName('chat');
            // for(let i= 0;i<divlist.length;i++){
            //     divlist[i].scrollTop = divlist[i].scrollHeight;
            // }

            // document.querySelector('.person[data-chat=person2]').classList.add('active');
        },
        getClass(){
            const _this = this;
            this.$http.post('/api/student/getclass',{token:localStorage.getItem('token')}).then(res=>{
                console.log(res.data);
                _this.chatList = res.data.data;
                _this.classId = _this.chatList[_this.chatIndex].paperid;
                _this.title = _this.chatList[_this.chatIndex].title;
                if(_this.getClassNum === 0) {
                    document.getElementById('bot').scrollIntoView(true);
                }
                _this.getClassNum++;
            })
        }
    }
}
</script>
<style lang="scss">
    #student-chat{
        @import '../../../assets/chat/css/style.css';
        max-width: 1000px;
        .you{
            margin-left: 30px;
            margin-top: 30px;
            .head{
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                left: -60px;
                top: -3px;
            }
            span{
                position: absolute;
                left: -60px;
                top: -30px;
                color: black;
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: gray;
            }
        }
        .me{
            margin-right: 30px;
            margin-top: 30px;
            .head{
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                left: calc(100% + 10px);
                top: -3px;
            }
            span{
                position: absolute;
                left: calc(100% - 25px);
                top: -30px;
                color: black;
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: gray;
            }
        }
        .write{
            .send::before{
                margin-left: 50px;
            }
        }
        .student-list{
            width: 200px;
            height: 100%;
            border:1px solid var(--light);
            position: relative;
            left: 100%;
            top: -100%;
            display: flex;
            // flex-direction: column;
            // flex-wrap: wrap;
            overflow-y: auto;
            .student{
                display: flex;
                align-items: center;
                width: 100%;
                height: 70px;
                border-bottom:1px solid var(--light);
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-left: 5px;
                }
                .name{
                    width: 110px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-left: 5px;
                }
                .del{
                    width: 15px;
                    height: 15px;
                    line-height: 15px;
                    text-align: center;
                    margin-left: 10px;
                    color: #004080;
                    border-radius: 50%;
                    background-color: #8080ff;
                    cursor: pointer;
                    &:hover{
                        background-color: #2424ff;
                    }
                }
            }
        }
    }
</style>