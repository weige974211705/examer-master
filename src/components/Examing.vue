<template>
    <div id="examing" @mouseenter="enter" @mouseleave="leave">
        <el-dialog title="考试提醒" :visible.sync="dialogTableVisible">
            <h3>鼠标离开3秒算作一次违规，三次违规将自动交卷！ 还剩<span style="font-size:20px;"> {{s}} </span>秒!</h3>
            <el-alert
                style="margin-bottom:10px;"
                v-for="i in num" :key="i"
                :title="'违规'+num+'次！'"
                type="error">
            </el-alert>
        </el-dialog>
        <div class="header">
            <h1>在线考试网</h1>
            <div class="img">
                <img src="../assets/logo.png">
            </div>
        </div>
        <div class="content">
            <Examinfo :data="examInfo" v-if="!examRunning && !completed" @start="start"></Examinfo>
            <Examrunning v-if="examRunning && !completed" @end="end" :leavePost="postPaper" @down="()=>{monitor = false}" @up="()=>{monitor = true;}"></Examrunning>
            <Examcomplete v-if="completed"></Examcomplete>
        </div>
    </div>
</template>
<script>
import Examinfo from './exam/examinfo'
import Examrunning from './exam/examrunning'
import Examcomplete from './exam/complete'

export default {
    data() {
        return  {
            dialogTableVisible:false,
            examData:{},
            examRunning: false,
            completed: false,
            examInfo: {},
            completeData: {},
            time: null,
            num: 0,
            s: 3,
            postPaper: false,
            monitor: true,
        };
    },
    components:{
        Examinfo,
        Examrunning,
        Examcomplete,
    },
    created() {
        this.init();
    },
    methods: {
        enter() {
            if (!(this.examRunning && !this.completed)) {
                return false;
            }
            this.dialogTableVisible = false;
            clearInterval(this.time);
        },
        leave() {
            if (!this.monitor) {
                return;
            }
            if (!(this.examRunning && !this.completed)) {
                return false;
            }
            const _this = this;
            this.dialogTableVisible = true;
            this.time = setInterval(()=>{
                if (_this.s ===0) {
                    _this.num ++;
                    if(_this.num ===3){
                        //交卷
                        _this.postPaper = true;
                    }
                    clearInterval(_this.time);
                    this.s = 3;
                } else {
                    _this.s -- ;
                }
            }, 1000)
        },
        end() {
            this.completed = true;
        },
        start() {
            const _this = this;
            this.examRunning = true;
        },
        init() {
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get(`/api/exam/getexambyid?token=${localStorage.getItem('token')}&id=${this.$route.params.id}`).then((res) => {
                this.examInfo = res.data.data;
                loading.close();
            });
            this.$http.get(`/api/exam/generateExam?token=${localStorage.getItem('token')}&id=${this.$route.params.id}`).then(res=>{
                if (res.data.data.isexam) {
                    this.completed = true;
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
    #examing{
        .header{
            width: 100%;
            height: 60px;
            background-color: #008080;
            display: flex;
            align-items: center;
            h1{
                margin:0;
                margin-left: 30px;
                color: white;
            }
            .img{
                margin-left: auto;
                margin-right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width:100%;
                }
            }
        }
        .content{

        }
        .footer{

        }
    }
</style>