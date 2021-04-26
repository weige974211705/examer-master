<template>
    <div id="teacher-help">
        <el-alert
            title="如果你遇到问题，请创建一个新的咨询来获得帮助"
            type="warning"
            effect="dark">
        </el-alert>
        <div class="row">
            <span>主题</span>
            <el-input v-model="title"></el-input>
        </div>
        <div class="row">
            <span>详细描述</span>
            <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="content">
            </el-input>
        </div>
        <div class="row">
            <div class="btn">
                <el-button type="success" @click="post">提交</el-button>
            </div>
        </div>
        <div class="alert" v-for="(item, index) in helpData" :key="index">
            <span style="color:gray;float:right;">{{getLocalTime(item.createDate)}}</span>
            <el-alert
                :title="item.title"
                type="success"
                :closable="false"
                :description="item.content">
            </el-alert>
            <br>
            <div v-if="item.resContent">
                <span style="color:gray;float:right;">{{getLocalTime(item.resDate)}}</span>
                <el-alert
                    :title="item.resContent"
                    type="warning"
                    :closable="false">
                </el-alert>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            title: '',
            content: '',
            helpData: [],
        }
    },
    created() {
        this.get();
    },
    methods: {
        post() {
            this.$http.post('/api/help/teacherSave',{
                token: localStorage.getItem('token'),
                title: this.title,
                content: this.content,
            }).then(res=>{
                if(res.data.status === 0) {
                    this.$message({type:'error', message: '发布失败'})
                }else {
                    this.$message({type:'success', message: '发布成功'})
                    this.content = '';
                    this.title = '';
                    this.get();
                }
            })
        },
        get() {
            this.$http.post('/api/help/teacherget',{
                token: localStorage.getItem('token'),
            }).then(res=>{
                if(res.data.status === 0) {
                    this.$message({type:'error', message: '获取失败'})
                }else {
                    this.helpData = res.data.data;
                }
            })
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
    },
}
</script>
<style lang="scss" scoped>
    #teacher-help{
        width: 80%;
        margin-left: 80px;
        margin-top:30px;
        .row{
            margin-top: 20px;
            display: flex;
            span{
                width: 100px;
                text-align: right;
                margin-right: 20px;
            }
            .btn{
                margin-left: auto;
                // margin-right: 50px;
            }
        }
        .alert{
            margin-top: 20px;
            margin-bottom: 20px;
        }
    }
</style>
