<template>
    <div id="exam-running">
        <h2>{{data.papertitle}}</h2>
        <div class="content">
            <div class="left">
                <div class="question">
                    <Question v-for="(item, index) in questions" :key="index" :question="item" :Index="index" @res="setAnswer"></Question>
                </div>
                <button @click="postPaper" style="margin-bottom:5px;cursor:pointer">交卷</button>
            </div>
            <div>
                <div class="info">
                    <el-progress class="circle" type="circle" v-if="timeLong && baseTime" :percentage="Math.floor((timeLong / baseTime)*100)" status="text">
                        <h3>剩余时间<span>{{SurplusTime}}</span></h3>
                    </el-progress>
                    <hr>
                    <p>答题进度<span>{{progress}}%</span></p>
                    <p>完成率<span>{{passNum}}/{{questions.length}}</span></p>
                    <p>题卡</p>
                    <div class="card">
                        <div :class="paperData.answer[item._id].length > 0 ? 'pass' : 'nopass'" v-for="(item, index) in questions" :key="index" @click="step(index)"><span>{{index + 1}}</span></div>
                    </div>
                    <div class="label">
                        <span>已做</span><div class="pass"></div>
                        <span>未做</span><div class="nopass"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Question from './question';

export default {
    components: {Question},
    data() {
        return {
            questions: [],
            paperData: {},
            baseTime: 0,
            timeLong: 0, //剩余时间,
            time: 0, //这是定时器
            data:{},
        };
    },
    props:['leavePost'],
    watch:{
        leavePost(){
            if(this.leavePost === true) {
                const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$http.post('/api/exam/computePaper', {
                    token: localStorage.getItem('token'), 
                    paperData: this.paperData,
                    examId: this.$route.params.id,
                }).then(res=>{
                    if (res.data.status === 0) {
                        this.$message({type:'error',message:'交卷失败，请联系管理员！'})
                    } else {
                        loading.close();
                        this.$message({type:'success',message:'交卷成功'})
                        this.$emit('end')
                    }
                })
            }
        }
    },
    computed: {
        passNum() {
            let pass = 0;
            for (const item in this.paperData.answer) {
                if (this.paperData.answer[item].length > 0){
                    pass+=1;
                }
            }
            return pass;
        },
        progress() {
            return Math.floor((this.passNum / this.questions.length) *100);
        },
        SurplusTime() { // 剩余时间
            let min = Math.floor(this.timeLong / 60);
            let sec = Math.floor(this.timeLong % 60);
            min = min < 10 ? `0${min}`: min;
            sec = sec < 10 ? `0${sec}`: sec;
            return `${min}:${sec}`;
        },
    },
    created() {
        this.getData();
    },
    mounted() {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
        window.addEventListener('beforeunload', () => {
            this.$http.post('/api/exam/computePaper', {
                token: localStorage.getItem('token'), 
                paperData: this.paperData,
                examId: this.$route.params.id,
            }).then(res=>{
                if (res.data.status === 0) {
                    this.$message({type:'error',message:'交卷失败，请联系管理员！'})
                } else {
                    loading.close();
                    this.$message({type:'success',message:'交卷成功'})
                    this.$emit('end')
                }
            })
        })

    },
    methods: {
        getData() {
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get(`/api/exam/generateExam?token=${localStorage.getItem('token')}&id=${this.$route.params.id}`).then(res =>{
                console.log(res);
                loading.close();
                this.data = res.data.data;
                this.init();
            })
        },
        postPaper() {
            this.$emit('down',false);
            this.$confirm(`考试时间还剩余${this.SurplusTime},是否提交试卷?`, '交卷', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            }).then(() => {
                const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$http.post('/api/exam/computePaper', {
                    token: localStorage.getItem('token'), 
                    paperData: this.paperData,
                    examId: this.$route.params.id,
                }).then(res=>{
                    if (res.data.status === 0) {
                        this.$message({type:'error',message:'交卷失败，请联系管理员！'})
                    } else {
                        loading.close();
                        this.$message({type:'success',message:'交卷成功'})
                        this.$emit('end')
                    }
                })
            }).catch(() => {
                this.$emit('up', true);
                this.$message({
                    type: 'info',
                    message: '已取消交卷'
                });          
            });
        },
        setAnswer(answer, id) {
            // console.log(this.data, this.questions);
            console.log(this.questions);
            this.paperData.answer[id] = answer;
        },
        step(index) {
            const obj = document.getElementById('type' + index);
            if (obj !== null) {
                obj.scrollIntoView(true);
            }
        },
        async init() {
            const postData = {
                token: localStorage.getItem('token'),
                ids: Object.keys(this.data.answer),
            };
            const resdata = await this.$http.post('/api/exam/getQuestionsByIds', postData)
            this.questions = resdata.data.data;
            this.paperData = Object.assign({}, this.data);
            this.timeLong = this.paperData.timeLong * 60; //转化为秒
            this.baseTime = this.timeLong;
            this.time = setInterval(()=>{
                this.timeLong -= 1;
                if (this.timeLong === 0) {
                    this.postPaper();
                }
            }, 1000);
        },
    },
    destroyed() {
        clearInterval(this.time);
        clearInterval(this.time1);
    },
}
</script>
<style lang="scss" scoped>
    #exam-running{
        margin-top: 50px;
        margin-left: 20%;
        .pass{
            width:30px;
            height:30px;
            background-color:orange;
            border-radius:3px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .nopass{
            width:30px;
            height:30px;
            border:3px solid orange;
            border-radius:3px;
            box-sizing: border-box;
            text-align: center;
        }
        .content{
            display: flex;
            .question{
                width: 600px;
                min-height: 300px;
                border:1px solid #8080ff;
                box-shadow: 0 0 10px #8080ff;
                padding-right: 20px;
            }
            .info{
                position: fixed;
                width: 300px;
                min-height: 300px;
                border:1px solid #8080ff;
                box-shadow: 0 0 10px #8080ff;
                margin-left: 20px;
                .circle{
                    margin-left: 30%;
                    margin-top: 20px;
                    h3{
                        text-align:center;
                        span{
                            // margin-left:10px;
                            padding-top: 10px;
                        }  
                    }
                }
                p{
                    padding-left:20px;
                    span{
                        margin-left: 10px;
                    }
                }
                .label{
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    margin-bottom: 20px;
                    span{
                        margin-left: 5px;
                        margin-right: 3px;
                        line-height: 30px;
                    }
                }
                .card{
                    display: flex;
                    flex-wrap: wrap;
                    width: 280px;
                    margin-left: auto;
                    margin-right: auto;
                    div{
                        margin: 5px;
                        cursor: pointer;
                    }
                }
            }
        }
        button{
            width: 623px;
            height: 45px;
            border-radius: 5px;
            border:0;
            background-color: #0080ff;
            margin-top: 20px;
        }
    }
</style>