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
                        <!-- {{row}} -->
                        <h3>试题</h3>
                        <div class="questions" width="100%" v-html="row.question"></div>
                        <h3 v-if="row.type==='单选题' || row.type==='多选题'">选项</h3>
                        <div class="options" style="display:flex;" v-for="(item,index) in row.answer_options" :key="Math.random(index)">
                            <span>({{options[index]}})   </span>
                            <div v-html="`${item}`"></div>
                        </div>
                        <h3>正确答案</h3>
                        <div class="right_answer" v-if="row.type==='单选题' || row.type==='多选题'">
                            <span v-for="(item,index) in row.right_answer" :key="index">{{options[item]}} </span>
                        </div>
                        <div class="right_answer" v-if="row.type==='填空题'">
                            <span v-for="(item,index) in row.right_answer" :key="index">{{item}} </span>
                        </div>
                        <div class="right_answer" v-if="row.type==='判断题'">
                            <span>{{row.answer_options[row.right_answer[0]]}} </span>
                        </div>
                        <h3>题目解析</h3>
                        <div class="answer_analysis" v-html="row.analysis">
                        </div>
                        <h3>我的答案</h3>
                        <div class="my_answer" v-if="row.type==='单选题' || row.type==='多选题'">
                            <span v-for="(item,index) in myAnswer" :key="index">{{options[item]}} </span>
                        </div>
                        <div class="my_answer" v-if="row.type==='填空题'">
                            <span v-for="(item,index) in myAnswer" :key="index">{{item}} </span>
                        </div>
                        <div class="my_answer" v-if="row.type==='判断题'">
                            <span>{{row.answer_options[myAnswer[0]]}} </span>
                        </div>
                        <!-- <div class="my_answer" v-if="row.type==='问答题'">
                            <div class="html" v-html="myAnswer[0]"></div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['row','myAnswer'],
    data() {
        return {
            options:['A','B','C','D','E','F','G','H','I','J','K','L','M'],
        }
    },
    methods: {
        closeSee() {
            this.$emit('closeSee');
        },
    }
}
</script>
<style lang="scss">
    #question_see{
        position: relative;
        .options{
            width:100%;
            min-height: 30px;
            border-left:5px solid orange;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            padding-left: 20px;
            margin-bottom: 5px;
        }
        .questions{
            width:100%;
            height: 60px;
            border-left:5px solid gray;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            padding-left: 20px;
        }
        .answer_analysis{
            width:100%;
            height: 60px;
            border-left:5px solid gray;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            padding-left: 20px;
        }
        .my_answer{
            width:100%;
            height: 60px;
            border-left:5px solid red;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            padding-left: 20px;
        }
        .right_answer{
            width:100%;
            height: 60px;
            border-left:5px solid green;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
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
            }
        }
    }
</style>