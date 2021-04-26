<template>
    <div id="teacher-help">
        <div class="no" style="color:gray" v-if="helpData.length === 0"><h1>暂无内容</h1></div>
        <div @click="diaShow(item)" class="alert" v-for="(item, index) in helpData" :key="index">
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
        <el-dialog
        title="答复"
        :visible.sync="dialogVisible"
        width="30%">
        <span style="color:gray;float:left;">
            {{diaInfo.teacherid ? 'teacherid:'+ diaInfo.teacherid : ''}}
            {{diaInfo.studentid ? 'studentid:'+ diaInfo.studentid : ''}}
        </span>
        <span style="color:gray;float:right;">{{getLocalTime(diaInfo.createDate)}}</span>
            <el-alert
                :title="diaInfo.title"
                type="success"
                :closable="false"
                :description="diaInfo.content">
            </el-alert>
            <br>
            <div v-if="diaInfo.resContent">
                <span style="color:gray;float:right;">{{getLocalTime(diaInfo.resDate)}}</span>
                <el-alert
                    :title="diaInfo.resContent"
                    type="warning"
                    :closable="false">
                </el-alert>
            </div>
            <br><br>
        <el-form label-width="80px">
        <el-form-item label="我的答复">
            <el-input v-model="resText" type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="post">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible:false,
            diaInfo: {},
            title: '',
            content: '',
            helpData: [],
            resText: '',
        }
    },
    created() {
        this.get();
    },
    methods: {
        diaShow(item){
            this.dialogVisible = true;
            this.diaInfo = item;
        },
        post() {
            this.$http.post('/api/help/superSave',{
                token: localStorage.getItem('token'),
                hid: this.diaInfo._id,
                content: this.resText,
            }).then(res=>{
                if(res.data.status === 0) {
                    this.$message({type:'error', message: '发布失败'})
                }else {
                    this.$message({type:'success', message: '发布成功'})
                    this.resText = '';
                    this.dialogVisible = false;
                    this.get();
                }
            })
        },
        get() {
            this.$http.post('/api/help/superget',{
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
            cursor: pointer;
            border-left: 5px solid blue;
            padding-left: 5px;
            padding-bottom: 20px;
        }
    }
</style>
