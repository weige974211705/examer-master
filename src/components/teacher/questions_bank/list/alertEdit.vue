<template>
    <div id="question_edit_alert">
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
                <Single v-if="getType===1" :row="row" :isAlert="true"></Single>
                <Multiple v-if="getType===2" :row="row" :isAlert="true"></Multiple>
                <Judge v-if="getType===3" :row="row" :isAlert="true"></Judge>
                <Essay v-if="getType===4" :row="row" :isAlert="true"></Essay>
                <Blanks v-if="getType===5" :row="row" :isAlert="true"></Blanks>
            </div>
        </div>
    </div>
</template>
<script>
import Single from './../edit/Single_selection'
import Multiple from './../edit/Multiple_selection'
import Judge from './../edit/judge_selection'
import Essay from './../edit/essay'
import Blanks from './../edit/blanks'

export default {
    components: { Single, Multiple, Judge, Essay, Blanks },
    props:['row'],
    data() {
        return {
            options:['A','B','C','D','E','F','G'],
            rowObj:this.row,
        };
    },
    created(){
        console.log(this.row)
    },
    computed: {
        getType(){
            switch(this.row.type){
                case '单选题':return 1;break;
                case '多选题':return 2;break;
                case '判断题':return 3;break;
                case '问答题':return 4;break;
                case '填空题':return 5;break;
            }
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
    #question_edit_alert{
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
                overflow-y: scroll;
                margin-top: 10px;
                padding-left:20px;
            }
        }
    }
</style>