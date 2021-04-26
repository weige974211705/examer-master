<template>
    <div id="alert_see">
        <div class="bc">
        </div>
        <div class="alert">
            <div class="see-header">
                <svg @click="closeSee" width="20" height="20" version="1.1" style="margin-top:10px;margin-right:10px;cursor:pointer;"
                xmlns="http://www.w3.org/2000/svg">

                    <line x1="0" y1="0" x2="20" y2="20"
                    style="stroke:rgb(99,99,99);stroke-width:2"/>

                    <line x1="0" y1="20" x2="20" y2="0"
                    style="stroke:rgb(99,99,99);stroke-width:2"/>

                </svg>
            </div>
            <div class="acontent">
                
                <div class="ql-container ql-snow" style="border:0;">
                    <div class="ql-editor" >
                        <h1 style="text-align:center;">批改试卷</h1>
                        <div class="questions">
                            <transition name = "ques">
                                <div v-for="(examitem, examIndex) in haveEassayData" :key="examIndex">
                                    <h3 style="margin-top:20px;">第{{examIndex+1}}份试卷</h3>
                                    <div class="question" v-for="(item, index) in questionsArray[examIndex]" :key="index">
                                        <div class="wenda">
                                            <div class="qheader">
                                                <el-badge :value="item.default_score+ '分'" class="item">
                                                    <el-tag type="info">{{item.type}}</el-tag>
                                                </el-badge>
                                                <p>     {{index+1}}、</p><p v-html="item.question"></p>
                                            </div>
                                            <h4 style="margin-left:20px;">他的答案</h4>
                                            <div class="ques_answer">
                                                <div style="margin-left:20px;" v-html="examitem.answer[item._id][0]"></div>
                                            </div>
                                            <h4 style="margin-left:20px;">正确答案</h4>
                                            <div>
                                                <div class="ques_right">
                                                    <div v-html="item.right_answer[0]"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <h4 style="margin-left:20px;">答案解析</h4>
                                        <div class="ques_analysis">
                                            <div style="margin-left:20px;" v-html="item.analysis"></div>
                                        </div>
                                        <div class="ques_score">
                                            <span>给分</span>
                                            <el-input-number :min="0"  v-model="quesScore[examitem._id][index]" @change="changeScore(examIndex, quesScore[examitem._id][index], item.default_score, examitem._id)" :max="item.default_score" label="给分"></el-input-number>
                                        </div>
                                    </div>
                                    <div class="result" style="margin-left:30px;">
                                        <span>当前分数：{{resultScore[examitem._id]}}</span>
                                        <el-button type="success" style="margin-left:10px;cursor:pointer;" @click="postScore(examitem._id, examIndex)">提交分数</el-button>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
export default {
    props:['row'],
    data() {
        return {
            options:['A','B','C','D','E','F','G'],
            questions:[],
            haveEassayData: [],
            questionsArray: [],
            quesScore: {},
            resScore:{},
            resultScore: {},
        }
    },
    created() {
        // this.getquestions();
        this.getHaveEassay();
    },
    methods: {
        postScore(examid, index) {
            this.$http.post('/api/exam/postscroe',{
                token:localStorage.getItem('token'),
                examid: examid,
                score: this.resultScore[examid],
            }).then(res=>{
                if (res.data.status === 0) {
                    this.$message({type:'error',message: '提交失败'})
                } else {
                    this.$message({type:'success',message: '批改成功'})
                    this.haveEassayData.splice(index, 1);
                    this.questionsArray.splice(index, 1);
                }
            })
        },
        changeScore(examindex, give, all, examid) {
            this.resultScore[examid] = this.haveEassayData[examindex].score - (all - give);
        },
        closeSee() {
            this.$emit('close');
        },
        getHaveEassay() {
            this.$http.post('/api/exam/getHaveEassay',{token:localStorage.getItem('token')}).then(async res=>{
                this.haveEassayData = res.data.data;
                // debugger;
                for (let i = 0; i< this.haveEassayData.length;i++) {
                    this.quesScore[this.haveEassayData[i]._id] = {};
                    this.resultScore[this.haveEassayData[i]._id] = this.haveEassayData[i].score;
                    const ques = await this.getQuestionsByIds(this.haveEassayData[i].essayQuestionsId, this.haveEassayData[i]._id);
                    this.questionsArray.push(ques);
                }
                this.resScore = Object.assign({},this.quesScore);
            })
        },
        async getQuestionsByIds(ids, index) {
            let res = await this.$http.post('/api/exam/getQuestionsByIds',{ids,token:localStorage.getItem('token')})
            let resdata = res.data.data;
            for(let i=0;i<resdata.length;i++){
                this.quesScore[index][i] = 0;
                this.resultScore[index] -= resdata[i].default_score;
            }
            return resdata;
        },
    },
}
</script>
<style lang="scss" scoped>
    #alert_see{
        position: relative;
        .ques-enter-active{   
        transition: opacity .5s;   //类名：隐藏到显示过程所需要的时间
        }
        .ques-enter {      // 类名:初始化状态
        opacity: 0;
        }
        .ques_analysis{
            border-left: 5px solid #0080ff;
            background-color: #ececec;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .ques_right{
            border-left: 5px solid green;
            background-color: #ececec;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 20px;
        }
        .ques_answer{
            border-left: 5px solid gray;
            background-color: #ececec;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 20px;
        }
        .bc{
            width:100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #000000;
            opacity: 0.3;
            z-index: 999;
        }
        .alert{
            width: 700px;
            height: 700px;
            background-color: #ffffff;
            position: fixed;
            left:0;right:0;
            top:0;bottom:0;
            z-index: 1000;
            margin:auto;
            .see-header{
                display:flex;
                flex-direction: row-reverse;
            }
            .acontent{
                width: 90%;
                height: 650px;
                // margin:auto;
                // // display: flex;
                // // flex-direction: column;
                // overflow-y: scroll;
                margin-top: 10px;
                padding-left:20px;
                .paper-info{
                    width: 60%;
                    margin-left: auto;
                    margin-right: auto;
                    border-bottom: 1px solid #0080ff;
                    text-align: center;
                }
                .questions{
                    // margin-left: 20%;
                    border-top: 1px solid gray;
                    .question{
                        padding:30px;
                        // border-top: 1px solid gray;
                        // border-bottom: 1px solid gray;
                        // margin-bottom: 20px;
                        .qheader{
                            display: flex;
                            font-size: 15px;
                            p{
                                line-height: 30px;
                            }
                        }
                        .qcontent{
                            margin-left: 30px;
                            display: flex;
                            font-size: 13px;
                        }
                        .qright{
                            margin-left: 30px;
                            display: flex;
                            font-size: 15px;
                        }
                    }
                }
            }
        }
    }
</style>