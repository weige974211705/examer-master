<template>
    <div id="circle">
        <!-- 动态 -->
        <div class="cheader">
            <div>
                <el-input
                    style="width:300px;margin-left:20px;"
                    placeholder="请输入搜索内容"
                    v-model="input1">
                </el-input>
                <el-button style="margin-left:10px;cursor: pointer;" icon="el-icon-search" type="primary" circle></el-button>
            </div>
            <el-button type="success" style="margin-right:20px;cursor: pointer;" @click="open">发布新动态</el-button>
        </div>
        <div class="content">
            <div class="row" v-for="(item,index) in showData" :key="index">
                <div class="img">
                    <img :src="'/api/' + item.user[0].headPortrait">
                </div>
                <div class="text">
                    <h3 class="title">{{item.title}}</h3>
                    <div class="tcontent">{{item.content}}</div>
                </div>
                <el-button @click="see(item)" type="primary" style="margin-right:20px;" icon="el-icon-view" circle></el-button>
            </div>
        </div>
        <div class="pagination">
            <el-pagination
            background
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="currentChange"
            layout="prev, pager, next"
            :total="circleData.length">
            </el-pagination>
        </div>
        <el-dialog title="发布消息" :visible.sync="formShow">
            <el-form :model="form">
                <el-form-item label="标题">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input
                    type="textarea"
                    :rows="8"
                    placeholder="请输入内容"
                    v-model="form.content">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formShow = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="发布消息" :visible.sync="seeShow">
            <el-alert
                :title="showContent.title"
                type="success"
                :closable="false">
            </el-alert>
            <br>
            <el-alert
                :title="showContent.content"
                type="warning"
                :closable="false">
            </el-alert>
            <br/>
            <br/>
            <h2>评价</h2>
            <div v-for="(item, index) in showContent.evaluate" :key="index">
                <div v-if="index < evalNum">
                    <div style="width:100%;display:flex;justify-content: space-between;">
                        <span>{{item.username}}</span>
                        <span>{{getLocalTime(item.date)}}</span>
                    </div>
                    <el-alert
                        :title="item.content"
                        type="info"
                        :closable="false">
                    </el-alert>
                    <br>
                </div>
                <div style="width:100%;display:flex;justify-content: center;">
                    <el-button v-if="index === evalNum"  size="mini" type="primary" round icon="el-icon-arrow-down" @click="evalMore">加载更多</el-button>
                </div>
            </div>
            <br>
            <el-form :model="form">
                <el-form-item>
                    <el-input
                    type="textarea"
                    :rows="8"
                    placeholder="请输入内容"
                    v-model="evaluate">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="seeShow = false">取 消</el-button>
                <el-button type="primary" @click="saveEvaluate">提交评价</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            formShow: false,
            seeShow: false,
            form: {
                title: '',
                content: '',
            },
            circleData: [],
            pageSize: 5,
            currentPage: 1,
            showContent: {},
            evaluate: '',
            evalNum: 10,
        };
    },
    computed: {
        showData() {
            return this.circleData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
        },
    },
    created() {
        this.get();
    },
    methods: {
        evalMore() {
            this.evalNum += 10;
        },
        saveEvaluate() {
            this.$http.post('/api/dynamic/evaluate',{
                token:localStorage.getItem('token'),
                content: this.evaluate,
                did: this.showContent._id,
            }).then(res=>{
                if(res.data.status === 0){
                    this.$message({type:'error',message:'发布评论失败'})
                }else {
                    this.$message({type:'success',message:'发布评论成功'})
                    this.get();
                    this.seeShow = false;
                }
            })
        },
        see(item) {
            this.showContent = item;
            this.seeShow = true;
        },
        currentChange(val) {
            this.currentPage = val;
        },
        save() {
            this.$http.post('/api/dynamic/save',{
                token:localStorage.getItem('token'),
                content: this.form.content,
                title: this.form.title
            }).then(res=>{
                if(res.data.status === 0){
                    this.$message({type:'error',message:'发布动态失败'})
                }else {
                    this.$message({type:'success',message:'发布成功'})
                    this.get();
                    this.formShow = false;
                }
            })
        },
        get() {
            this.$http.get('/api/dynamic/getdynamic').then(res=>{
                if(res.data.status === 0){
                    this.$message({type:'error',message:'获取数据失败'})
                }else {
                    // this.$message({type:'success',message:'发布成功'})
                    this.circleData = res.data.data;
                }
            })
        },
        open() {
            this.formShow = true;
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
    }
}
</script>
<style lang="scss" scoped>
    #circle{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        .cheader{
            width: 80%;
            height: 60px;
            border-left: 5px solid blue;
            background-color: #f7f7f7;
            margin-top: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .content{
            display: flex;
            flex-direction: column;
            width: 80%;
            align-items: center;
            margin-top: 20px;
            margin-left: 0px;
            .row{
                min-width: 900px;
                width: 100%;
                height: 100px;
                border-left: 5px solid orange;
                background-color: #f7f7f7;
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .img{
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-left: 20px;
                    img{
                        height: 100%;
                    }
                }
                .text{
                    width: 87%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    .title{
                        margin:0;
                        margin-top:15px;
                        flex-grow: 1;
                        margin-left: 30px;
                        margin-right: 30px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .tcontent{
                        height: 60px;
                        width: 700px;
                        flex-grow: 1;
                        margin: 0;
                        margin-top: 15px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin-left: 30px;
                        margin-right: 30px;
                    }
                }
            }
        }
        .pagination{
            margin-top: 20px;
            margin-bottom: 20px;
        }
    }
</style>