<template>
    <div id="question-one">
        <div :id="'type'+Index"></div>
        <div class="header">
            <div class="row">
                <div class="nth">{{Index + 1}}</div>
                <div class="type">{{question.type}}</div>
                <div class="default_score">{{question.default_score}}分</div>
            </div>
            <div class="ql-container ql-snow" style="border:0;">
                <div class="ql-editor" style="padding:0;margin-left:20px;">
                   <div class="ques" v-html="question.question"></div>
                </div>
            </div>
        </div>
        <div class="single" v-if="question.type === '单选题'">
            <div class="select" v-for="(item, index) in question.answer_options" :key="index">
                <span>({{select_list[index]}})</span>
                <el-radio class="radio" :label="index" v-model="singleAnswer"><div class="radio-text">
                    <div class="ql-container ql-snow" style="border:0;">
                        <div class="ql-editor" style="padding:0;margin-left:20px;">
                        <div class="ques" v-html="item"></div>
                        </div>
                    </div>
                </div></el-radio>
            </div>
        </div>
        <div class="multiple" v-if="question.type === '多选题'">
            <div class="select" v-for="(item, index) in question.answer_options" :key="index">
                <span>({{select_list[index]}})</span>
                <el-checkbox class="check" v-model="multipleAnswer" :label="index"><div class="check-text">
                    <div class="ql-container ql-snow" style="border:0;">
                        <div class="ql-editor" style="padding:0;margin-left:20px;">
                        <div class="ques" v-html="item"></div>
                        </div>
                    </div>
                </div></el-checkbox>
            </div>
        </div>
        <div class="blanks" v-if="question.type === '填空题'">
            <div v-for="(item, index) in question.right_answer" :key="index" class="select">
                <span>({{select_list[index]}})</span>
                <input class="input" v-model="blanksAnswer[index]">
            </div>
        </div>
        <div class="judge" v-if="question.type === '判断题'">
            <el-radio class="radio" :label="index" v-model="judgeAnswer" v-for="(item, index) in question.answer_options" :key="index">{{item}}</el-radio>
        </div>
        <div class="essay" v-if="question.type === '问答题'">
            <quill-editor 
            v-model="essayAnswer" 
            ref="myQuillEditor" 
            :options="editorOption" >
            </quill-editor>
        </div>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor';

export default {
    components: { quillEditor },
    props: {
        Index: 0,
        question: {
            type: Object,
            default: () => {
                return {
                    type: '单选题',
                    question: '<p>weqqw</p>',
                }
            },
        },
        myAnswer:{
            type:Array,
            default: ()=>{
                return [];
            }
        },
    },
    updated() {
        this.resData();
    },
    created(){
        this.init();
    },
    methods: {
        init() {
            if (this.myAnswer.length!==0){
                switch(this.question.type) {
                case '单选题': {
                    this.singleAnswer = this.myAnswer[0];
                    break;
                }
                case '多选题': {
                    this.multipleAnswer = this.myAnswer;
                    break;
                }
                case '填空题': {
                    this.blanksAnswer = this.myAnswer;
                    break;
                }
                case '判断题': {
                    this.judgeAnswer=parseInt(this.myAnswer[0]);
                    break;
                }
                default: {
                    this.essayAnswer = this.myAnswer[0];
                    break;
                }
            }
            }
        },
        resData() {
            let answer = [];
            switch(this.question.type) {
                case '单选题': {
                    answer.push(this.singleAnswer);
                    break;
                }
                case '多选题': {
                    answer = this.multipleAnswer;
                    break;
                }
                case '填空题': {
                    answer = this.blanksAnswer;
                    break;
                }
                case '判断题': {
                    answer.push(this.judgeAnswer+ '');
                    break;
                }
                default: {
                    answer.push(this.essayAnswer);
                    break;
                }
            }
            this.$emit('res', answer, this.question._id);
        },
    },
    data() {
        return {
            essayAnswer: '',
            blanksAnswer: [],
            singleAnswer: -1,
            multipleAnswer: [],
            judgeAnswer: -1,
            select_list: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
            data: {
                answer: [],
            },
            editorOption:{
                modules:{
                    toolbar:[
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block','image']
                    ]
                }
            },
        };
    },
};
</script>
<style lang="scss" scoped>
    #question-one{
        margin-bottom:30px;
        .select{
            display: flex;
            align-items: center;
            justify-content: center;
            >span{
                margin-right: 5px;
            }
        }
        .header{
            margin-top: 20px;
            .row{
                display: flex;
                height: 30px;
                align-items: center;
                margin-left: 10px;
                .nth, .type{
                    height: 20px;
                    border: 1px solid #0080ff;
                    color: #0080ff; 
                    border-radius: 3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 5px;
                }
                .nth{
                    width: 45px;
                }
                .type{
                    width: 100px;
                }
                .default_score{
                    color: gray;
                    margin-left: 5px;
                }
            }
            .ques{
                margin-top: 10px;
                margin-bottom: 10px;
            }
        }
        .single{
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            box-sizing: border-box;
            .radio{
                margin-top: 10px;
                border:1px solid #0080ff;
                padding: 5px;
                box-sizing: border-box;
                border-radius: 3px;
                width: 98%;
                display:flex;
                justify-items: center;
                align-items: center;
                &:hover{
                    border:1px solid #ff8000;
                }
                .radio-text{
                    width: 530px;
                }
            }
        }
        .multiple{
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            box-sizing: border-box;
            .check{
                margin-top: 10px;
                border:1px solid #0080ff;
                padding: 5px;
                box-sizing: border-box;
                border-radius: 3px;
                width: 98%;
                display: flex;
                align-items: center;
                &:hover{
                    border:1px solid #ff8000;
                }
                .check-text{
                    width: 530px;
                }
            }
        }
        .blanks{
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            box-sizing: border-box;
            .input{
                width:98%;
                height: 30px;
                border: 1px solid #0080ff;
                border-radius: 3px;
                margin-top: 10px;
                margin-bottom: 10px;

            }
        }
        .judge{
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            box-sizing: border-box;
            .radio{
                margin-top: 10px;
                border:1px solid #0080ff;
                padding: 5px;
                box-sizing: border-box;
                border-radius: 3px;
                width: 98%;
                &:hover{
                    border:1px solid #ff8000;
                }
            }
        }
        .essay{
            width: 95%;
            margin-left: 20px;
        }
    }
</style>