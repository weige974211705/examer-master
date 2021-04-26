<template>
    <div id="analysis">
        <!-- <div class="header">
            <h1>在线考试网</h1>
            <div class="img">
                <img src="../../assets/logo.png">
            </div>
        </div> -->
        <div class="content">
            <h2 style="text-align:center">考试解析</h2>
            <p style="text-align:center">考试总分: {{examCompleteInfo.score}}分 {{examCompleteInfo.ispass?'及格':'不及格'}}</p>
             <div class="ql-container ql-snow" style="border:0;">
                    <div class="ql-editor" >
                        <div class="question" v-for="(item, index) in questions" :key="index">
                            <!-- {{item}} -->
                            <Question :question="item" :Index="index" :myAnswer="examCompleteInfo.answer[item._id]"></Question>
                            <div class="analysis_info">
                                <div class="row1">
                                    <div style="display:flex;align-items:center;" v-if="item.type==='多选题' || item.type==='单选题'">
                                        <span style="color:green">正确答案:</span>
                                        <div style="margin:5px;" v-for="(nitem,nindex) in examCompleteInfo.after_answer[item._id]" :key="nindex">{{options[nitem]}}</div>
                                    </div>
                                    <div style="display:flex;align-items:center;" v-if="item.type==='填空题'">
                                        <span style="color:green">正确答案:</span>
                                        <div style="margin:5px;" v-for="(nitem,nindex) in examCompleteInfo.after_answer[item._id]" :key="nindex">{{item.right_answer[nindex]}}</div>
                                    </div>
                                    <div v-if="item.type==='判断题'">
                                        <span style="color:green">正确答案:</span>
                                        <div style="margin:5px;">{{item.answer_options[examCompleteInfo.after_answer[item._id][0]]}}</div>
                                        <span style="color:orange">我的答案:</span>
                                        <div style="margin:5px;">{{item.answer_options[examCompleteInfo.answer[item._id][0]]}}</div>
                                    </div>
                                    <div v-if="item.type==='问答题'">
                                        <span style="color:green">正确答案:</span>
                                        <div v-html="examCompleteInfo.after_answer[item._id][0]"></div>
                                        <span style="color:orange">我的答案:</span>
                                        <div v-html="examCompleteInfo.answer[item._id][0]"></div>
                                    </div>
                                    <span>题目解析:</span>
                                    <div class="analysis_content">
                                        <!-- <div class="as" v-if="item.type!=='问答题'">{{item.analysis}}</div> -->
                                        <div class="ql-container ql-snow" style="border:0;">
                                            <div class="ql-editor" >
                                                <div class="as" v-html="item.analysis"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row2"></div>
                            </div>
                            <div class="bc"></div>
                        </div>
                    </div>
             </div>
            <router-link to="/manage/student/startexam">
                <el-button type="primary" icon="el-icon-s-home" circle style="position:fixed;left:80%;top:88%;"></el-button>
            </router-link>
        </div>
    </div>
</template>
<script>
import Question from './question'
export default {
    data() {
        return  {
            examCompleteInfo: {},
            questions: [],
            options: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
        };
    },
    components: { Question },
    created() {
        this.getCompleteInfo();
    },
    mounted() {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
    },
    methods: {
        async init() {
            const postData = {
                token: localStorage.getItem('token'),
                ids: Object.keys(this.examCompleteInfo.answer),
            };
            const resdata = await this.$http.post('/api/exam/getQuestionsByIds', postData)
            this.questions = resdata.data.data;
        },
       getCompleteInfo() {
            this.$http.post('/api/exam/getexamlistbyid', {
                token: localStorage.getItem('token'),
                id: this.$route.params.id,
            }).then(res=> {
                this.examCompleteInfo = res.data.data;
                this.init();
            })
        },
    },
}
</script>
<style lang="scss" scoped>
    #analysis{
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
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            .question {
                position: relative;
                .bc{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top:0;
                    left:0;
                    z-index: 999;
                    
                }
                .analysis_content{
                    margin-top: 10px;
                    min-height: 50px;
                    width: 100%;
                    border-left: 5px solid green;
                    box-sizing: border-box;
                    padding: 13px;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                }
            }
        }
        .footer{

        }
    }
</style>