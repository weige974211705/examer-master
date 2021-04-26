<template>
    <div id="question_see">
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
                        <h1 style="text-align:center;">{{row.title}}</h1>
                        <h2 style="text-align:center;">考试时长:{{row.timeLong}}分钟</h2>
                        <h2 style="text-align:center;">总分:{{row.score}}  及格分:{{row.paperPassScore}}</h2>
                        <div class="paper-info" v-html="row.paperInfo"></div>
                        <div class="questions">
                            <div class="question" v-for="(item, index) in questions" :key="index">
                                <div class="select"  v-if="item.type === '单选题' || item.type === '多选题'">
                                    <div class="qheader">
                                        <el-badge :value="item.default_score+ '分'" class="item">
                                            <el-tag type="info">{{item.type}}</el-tag>
                                        </el-badge>
                                        <p>     {{index+1}}、</p><p v-html="item.question"></p>
                                    </div>
                                    <div>
                                        <div class="qcontent" v-for="(one,oindex) in item.answer_options" :key="oindex">
                                            <p>{{options[oindex]}}、</p><div v-html="one"></div>
                                        </div>
                                    </div>
                                    <h4 style="margin-left:20px;">正确答案</h4>
                                    <div class="qcontent">
                                        <p v-for="(qitem, qindex) in item.right_answer" :key="qindex">{{options[qitem]}}  </p>
                                    </div>
                                </div>
                                <div class="tiankong"  v-if="item.type === '填空题'">
                                    <div class="qheader">
                                        <el-badge :value="item.default_score+ '分'" class="item">
                                            <el-tag type="info">{{item.type}}</el-tag>
                                        </el-badge>
                                        <p>     {{index+1}}、</p><p v-html="item.question"></p>
                                    </div>
                                    <h4 style="margin-left:20px;">正确答案</h4>
                                    <div style="margin-left:20px;">
                                        <p v-for="(qitem, qindex) in item.right_answer" :key="qindex">{{qindex + 1}}、{{qitem}}  </p>
                                    </div>
                                </div>
                                <div class="wenda"  v-if="item.type === '问答题'">
                                    <div class="qheader">
                                        <el-badge :value="item.default_score+ '分'" class="item">
                                            <el-tag type="info">{{item.type}}</el-tag>
                                        </el-badge>
                                        <p>     {{index+1}}、</p><p v-html="item.question"></p>
                                    </div>
                                    <h4 style="margin-left:20px;">正确答案</h4>
                                    <div style="margin-left:20px;">
                                        <p v-html="item.right_answer[0]"></p>
                                    </div>
                                </div>
                                <div class="wenda"  v-if="item.type === '判断题'">
                                    <div class="qheader">
                                        <el-badge :value="item.default_score+ '分'" class="item">
                                            <el-tag type="info">{{item.type}}</el-tag>
                                        </el-badge>
                                        <p>     {{index+1}}、</p><p v-html="item.question"></p>
                                    </div>
                                    <div>
                                        <div class="qcontent">
                                            <p v-for="(one,oindex) in item.answer_options" :key="oindex">{{one}}   </p>
                                        </div>
                                    </div>
                                    <h4 style="margin-left:20px;">正确答案</h4>
                                    <div style="margin-left:20px;">
                                        <p>  {{item.answer_options[item.right_answer[0]]}}</p>
                                    </div>
                                </div>
                                <h4 style="margin-left:20px;">答案解析</h4>
                                <p style="margin-left:20px;" v-html="item.analysis"></p>
                            </div>
                        </div>
                        <!-- <div width="100%" v-html="row.question"></div>
                        <h3>选项</h3>
                        <div style="display:flex;" v-for="(item,index) in row.answer_options" :key="Math.random(index)">
                            <span>({{options[index]}})   </span>
                            <div v-html="`${item}`"></div>
                        </div>
                        <h3>正确答案</h3>
                        <div v-for="(item, index) in row.right_answer" :key="index">
                            <span>{{options[item]  }}</span>
                        </div>
                        <h3>题目解析</h3>
                        <div v-html="row.analysis"> -->
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
        }
    },
    methods: {
        closeSee() {
            this.$emit('close');
        },
        getLocalTime(nS) { 
            //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
            // d.cTime = 1539083829787
            nS = parseInt(nS)
            let date = new Date(nS);
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            month = month < 10 ? "0"+month:month;
            day = day < 10 ? "0"+day:day;
            hours = hours <10 ? "0" +hours:hours;
            minutes =minutes<10?"0"+minutes:minutes;
            date = year+'-'+month+'-'+day+ ' '+hours+':'+minutes;
            console.log(date); // 2018-10-09
            return date;
        },
        getquestions(){
            this.questions = [];
            this.row.questionsList.forEach(async item => {
                const res = await this.$http.get(`/api/questions/getquestion?id=${item}`)
                this.questions.push(res.data.data);
            });
        }
    },
    created() {
        this.getquestions();
    }
}
</script>
<style lang="scss">
    #question_see{
        position: relative;
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
                        border-bottom: 1px solid gray;
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