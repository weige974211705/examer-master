<template>
    <div id="exam-info">
        <h1>{{data.title}}</h1>
        <div class="infoimg">
            <img src="../../assets/info.svg">
            <p style="color:gray;text-align:center;">考试说明</p>
        </div>
        <div class="info">
            <div class="row">
                <span>学员姓名:</span>
                <b>{{this.$store.state.userdata.username}}</b>
            </div>
            <div class="row">
                <span>考试时长:</span>
                <b>{{data.timeLong}}分钟</b>
            </div>
            <div class="row">
                <span>及格分数:</span>
                <b>{{data.paperPassScore}}分</b>
            </div>
            <div class="row">
                <span>试卷总分:</span>
                <b>{{data.score}}分</b>
            </div>
            <div class="row">
                <span>发布教师:</span>
                <b>{{data.publisher}}</b>
            </div>
            <div class="infotext" v-html="data.paperInfo">
            </div>
        </div>
        <el-button class="exam-btn" type="primary" @click="start">开始考试</el-button>
    </div>
</template>
<script>
export default {
    props:{
        data: {
            type:Object,
            default: () => {
                return {
                    title: '这是标题',
                    timeLong: 60,
                    paperInfo: '这是说明信息',
                    score: 100,
                    paperPassScore: 60,
                    publisher: 'th111'
                };
            }
        }
    },
    methods: {
        start() {
            this.$emit('start');
        },
    },
}
</script>
<style lang="scss">
    #exam-info{
        width: 500px;
        min-height: 600px;
        border:1px solid blue;
        margin-left: auto;
        margin-right: auto;
        margin-top: 30px;  
        h1{
            text-align: center;
        }
        .infoimg{
            width: 150px;
            margin-left: auto;
            margin-right: auto;
            img{
                width:100%;
                height: 100%;
            }
        }
        .info{
            width:300px;
            margin-left: auto;
            margin-right: auto;
            .row{
                border-bottom: 1px solid #004080;
                display: flex;
                justify-content: center;
                height: 30px;
                align-items: center;
                b{
                    width:130px;
                    text-align: right;
                }
            }
            .infotext{
                margin-top: 20px;
                min-height: 60px;
            }
        }
        .exam-btn{
            width: 90%;
            margin-left: 25px;
            margin-top: 30px;
            margin-bottom: 30px;
        }
    }
</style>