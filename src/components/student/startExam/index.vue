<template>
    <div id="start-exam">
        <div class="exam-header">
            <div class="search">
                <el-input class="input"
                    placeholder="请输入内容"
                    v-model="searchinput" @keyup.enter.native="getExamList(searchinput)">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button class="btn" @click="getExamList(searchinput)">
                    搜索
                </el-button>
                <el-button @click="addOpenPaper">
                    添加公开考试
                </el-button>
<!--                <el-button type="primary" @click="addExam">-->
<!--                    添加考试-->
<!--                </el-button>-->
            </div>
            <div class="exam-list">
                <div class="exam-box" v-for="(item,index) in eList" :key="index">
                    <div class="img">
                        <img :src="item.imgurl" height="60">
                    </div>
                    <div class="content">
                        <div class="title">{{item.papertitle}}</div>
                        <div class="desc">
                            <span>{{item.isexam ? '已经考试': '还未考试'}}
                                <span v-if="item.timeOption === '1'">考试规定时间:{{getLocalTime(item.paperstend[0])}} 至 {{getLocalTime(item.paperstend[1])}}</span>
                                <span v-if="item.timeOption === '2'">永久有效</span>
                                <span v-if="item.timeOption === '3'">不可用</span>
                            </span>
                        </div>
                    </div>
                    <div class="start">
                        <el-button v-if="!item.isexam&&!item.haveEassay" @click="start(item)">开始考试</el-button>
                        <router-link :to="'/analysis/'+item._id">
                            <p v-if="item.isexam&&!item.haveEassay" :style="item.score < 60 ? 'color:red;': ''">{{item.score}}</p>
                        </router-link>
                        <p style="color:gray;margin-top:10px;font-size:15px;" v-if="item.haveEassay">等待教师批改试卷...</p>
                    </div>
                </div>
                <div class="pagination">
                    <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="showNum"
                    :current-page="currentIndex"
                    background
                    layout="prev, pager, next"
                    :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="搜索试卷" :visible.sync="dialogTableVisible">
            <el-table
                :data="showOpenPaper"
                style="width: 100%">
                <el-table-column
                label="标题"
                prop="title">
                </el-table-column>
                <el-table-column
                label="分类"
                sortable
                prop="paperCla">
                </el-table-column>
                <el-table-column
                sortable
                label="发布者"
                prop="publisher">
                </el-table-column>
                <el-table-column
                sortable
                label="访问码"
                prop="isfangwen">
                </el-table-column>
                <el-table-column
                label="创建时间"
                sortable
                prop="createDate">
                </el-table-column>
                <el-table-column
                align="right">
                <template slot="header">
                    <span>操作</span>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="openjoin(scope.row)">加入</el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-pagination
            background
            :current-page="diacurrentPage"
            @current-change="diachangePage"
            layout="prev, pager, next"
            :total="openPaperList.length">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
import Bs from 'js-base64'
export default {
    data() {
        return {
            dialogTableVisible:false,
            openPaperList:[],
            searchinput:'',
            examList:[],
            showNum: 5, //每页显示条数
            currentIndex: 1, //当前页数

            diapageSize:10,
            diacurrentPage: 1,
        };
    },
    computed:{
        showOpenPaper() {
            let list = [];
            for(let i=0;i<this.openPaperList.length;i++) {
                let obj = Object.assign({}, this.openPaperList[i]);
                obj.createDate = this.getLocalTime(obj.createDate);
                obj.isfangwen = obj.so === '1' ? '不需要' :'需要'
                list.push(obj);
            }
            return list.slice((this.diacurrentPage -1)*this.diapageSize,this.diacurrentPage*this.diapageSize);
        },
        total() { //总条数
            return this.examList.length;
        },
        eList() {
            let resdata = this.examList.slice((this.currentIndex-1) * this.showNum, this.currentIndex * this.showNum);
            return resdata;
        },
    },
    methods: {
        openjoin(row) {
            const that = this;
            if (row.so === '2') {
                this.$prompt('请输入访问码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
                }).then(({ value }) =>{
                    if (value === row.fangwenma) {
                        let wherestr = {
                        token: localStorage.getItem('token'),
                        studentid: that.$store.state.userdata.userid,
                        teacherid: row.publisher,
                        paperid: row._id,
                        fangwenma: row.fangwenma,
                        }
                        that.$http.post('/api/exam/joinexam', wherestr).then(res=> {
                            if (res.data.status === 1) {
                                this.$message({type:'info', message:'加入成功'})
                                this.dialogTableVisible = false;
                                this.getExamList();
                            } else {
                                this.$message({type:'error', message:res.data.msg})
                            }
                        }).catch(err => {
                            this.$message({type:'error', message:'加入失败'})
                        })
                    } else {
                        this.$message({type:'error',message:'访问码错误'})
                    }
                })
            }else {
                let wherestr = {
                token: localStorage.getItem('token'),
                studentid: that.$store.state.userdata.userid,
                teacherid: row.publisher,
                paperid: row._id,
                }
                that.$http.post('/api/exam/joinexam', wherestr).then(res=> {
                    if (res.data.status === 1) {
                        this.$message({type:'info', message:'加入成功'})
                        this.dialogTableVisible = false;
                        this.getExamList();
                    } else {
                        this.$message({type:'error', message:res.data.msg})
                    }
                }).catch(err => {
                    this.$message({type:'error', message:'加入失败'})
                })
            }
        },
        diachangePage(val){
            this.diacurrentPage = val;
        },
        addOpenPaper(){
            this.$http.get('/api/papers/getopenpaper').then(res=>{
                this.openPaperList = res.data.data;
            })
            this.dialogTableVisible = true;
        },
        start(item) {
            this.$router.push(`/examing/${item._id}`);
            // window.location.href=`/#/examing/${item._id}`;
        },
        addExam() {
            let that = this;
            this.$prompt('请输入code', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
            }).then(({ value }) => {
                const str = Bs.Base64.decode(value)
                const arr = str.split('_');
                debugger;
                let wherestr = {
                    token: localStorage.getItem('token'),
                    studentid: that.$store.state.userdata.userid,
                    teacherid: arr[1],
                    paperid: arr[0],
                    fangwenma: arr[2],
                }
                that.$http.post('/api/exam/joinexam', wherestr).then(res=> {
                    if (res.data.status === 1) {
                        this.$message({type:'info', message:'加入成功'})
                        this.getExamList();
                    } else {
                        this.$message({type:'error', message:res.data.msg})
                    }
                }).catch(err => {
                    this.$message({type:'error', message:'加入失败'})
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '加入失败'
                });
            });
        },
        getExamList(search) {
            let addstr = '';
            if (search) {
                addstr = `&search=${search}`;
            }
            this.$http.get(`/api/exam/getexamlist?token=${localStorage.getItem('token')}${addstr}`).then(res=>{
                if (res.data.status === 0) {
                    this.$message({type:'error', message:res.data.msg})
                } else {
                    this.examList = res.data.data.reverse();
                }
            }).catch(err=>{
                this.$message({type:'error', message:'获取列表失败'})
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
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentIndex = val;
        }
    },
    created() {
        this.getExamList();
    },
}
</script>
<style lang="scss" scoped>
    #start-exam{
        width:100%;
        .exam-header{
            margin-top: 30px;
            margin-left: auto;
            margin-right: auto;
            width: 900px;
            .search{
                display: flex;
                .input{
                    width: 600px;
                    border-radius: 5px;
                }
                .btn{
                    background-color: #0080ff;
                    color: white;
                    cursor: pointer;
                }
                .add-exam{
                    background-color: #8080c0;
                    color: white;
                    margin-left: auto;
                    cursor: pointer;
                }
            }
            .exam-list{
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 30px;
                .exam-box{
                    display:flex;
                    padding: 20px;
                    // background-color: #e1e1e1;
                    width: 700px;
                    border-bottom: 1px solid #000000;
                    .img{
                        width: 60px;
                        height: 60px;
                        overflow: hidden;
                    }
                    .content{
                        margin: 0;
                        padding: 0;
                        margin-left: 20px;
                        .title{

                        }
                        .desc{
                            margin-top: 13px;
                            span{
                                margin: 0;
                                font-size: 13px;
                                color: gray;
                            }
                        }
                    }
                    .start{
                        cursor: pointer;
                        margin-top: 10px;
                        p{
                            margin: 0;
                            padding: 0;
                            font-size: 30px;
                            margin-right: 35px;
                            color: #0080ff;
                        }
                    }
                }
                .exam-box:hover{
                    background-color: #e1e1e1;
                }
                .pagination{
                    margin-top: 20px;
                    margin-bottom: 20px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }
</style>
