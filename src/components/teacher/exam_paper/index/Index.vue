<template>
    <div id="questions_list">
        <See v-if="showSee" @close="showSee = false" :row="paperrow"></See>
        <Header :usedNum="usedNum" :paperNum="paperNum" :classesNum="classeslist.length"></Header>
        <div class="list-content">
            <div class="fenlei">
                <h2>试卷分类列表</h2>
                <el-alert
                    title="下方可以添加分类"
                    type="info" style="margin-bottom:10px;">
                </el-alert>
                <div class="search" style="display:flex;">
                    <el-input v-model="addClass"></el-input>
                    <el-button @click="addCla"><i class="el-icon-zoom-in"></i></el-button>
                </div>
                <div class="fenlei-list">
                    <div class="lei">
                        <a href="#" @click="searchCla('')">
                            <i class="el-icon-tickets" style="margin-right:3px; margin-top:5px;margin-top:5px;"></i>
                            所有试卷
                        </a>
                        <!-- <i class="el-icon-delete" style="float:right;margin-top:5px;cursor: pointer;" @click="delCla(item)"></i> -->
                    </div>
                    <div class="lei" v-for="(item,index) in classeslist" :key="index">
                        <a href="#" @click="searchCla(item)">
                            <i class="el-icon-tickets" style="margin-right:3px; margin-top:5px;margin-top:5px;"></i>
                            {{item}}
                        </a>
                        <i class="el-icon-delete" style="float:right;margin-top:5px;cursor: pointer;" @click="delCla(item)"></i>
                    </div>
                </div>
            </div>
            <div class="list">
                <div class="title">
                    <h2>试卷列表</h2>
                    <el-button type="primary" style="height:40px;margin-top:15px;margin-left:10px;">
                        <router-link to="/manage/teacher/paper/edit">添加试卷</router-link>
                    </el-button>
                    <!-- <el-button type="info" style="height:40px;margin-top:15px;margin-left:10px;" @click="delQues">批量删除</el-button>
                    <el-button type="success" style="height:40px;margin-top:15px;margin-left:10px;" @click="exportExcel">导出考试</el-button> -->
                </div>
                <div class="paperlist" v-for="(item, index) in showPapers" :key="index">
                    <div class="fmimg"><img :src="item.imgurl" alt="图片"/></div>
                    <div class="content-warp">
                        <div class="pHeader">
                            <div class="ptitle">
                                <h3>{{item.title}}</h3>
                                <p>创建时间:{{item.createDate?getLocalTime(item.createDate):'未知'}}</p>
                                <!-- {{item.createDate}} -->
                            </div>
                        </div>
                        <div class="pContent">
                            <p>{{item.paperCla}}|</p>
                            <p>{{item.questionModel === 'custom' ? '自定义考试' : '随机考试'}}|</p>
                            <p>考试时长{{item.timeLong}}分钟|</p>
                            <p>{{item.so == '1' ? '任何人可加入' : '访问码: '+ item.fangwenma }}</p>
                        </div>
                        <div class="pBottom">
                            <div class="publisher">
                                <p>{{item.publisher}}</p>
                            </div>
                            <div class="time">
                                <p v-if="item.timeOption === '1'">开放时间: {{getLocalTime(item.timestend[0])}} 至 {{getLocalTime(item.timestend[1])}}</p>
                                <p v-if="item.timeOption !=='1'">开放时间: {{item.timeOption === '2' ? '永久有效':'不可用'}}</p>
                            </div>
                            <div class="manage">
                                <el-button>
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item><p @click="showPaper(item)">查看</p></el-dropdown-item>
                                            <el-dropdown-item><p @click="delPaper(item)">删除</p></el-dropdown-item>
                                            <el-dropdown-item><p @click="sharePaper(item)">分享</p></el-dropdown-item>
                                        </el-dropdown-menu>
                                        </el-dropdown>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pagination">
                    <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :page-size="6"
                    layout="prev, pager, next"
                    :total="paperNum">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div >
</template>
<script>
import See from './see.vue'
import Header from './header.vue'
import Bs from 'js-base64'

export default {
    components:{Header,See},
    data(){
        return {
            usedNum:0,
            addClass:'',
            classeslist:[],
            classisok:true,
            searchclass:'',
            papers:[],
            paperIndex: 1, //第0页
            paperNum: 0,
            showSee: false,
            paperrow:{},
        }
    },
    computed:{
        showPapers() {
            return this.papers.slice((this.paperIndex-1)*6,(this.paperIndex-1)*6+6);
        }
    },
    methods:{
        getPaperUsedNum(){
            this.$http.post('/api/teacher/getpaperusednum',{token:localStorage.getItem('token')}).then(res=>{
                if(res.data.status===0){
                    this.$message({type:'error',message:res.data.msg})
                }else {
                    this.usedNum = res.data.data;
                }
            })
        },
        sharePaper(item) {
            const str = item._id + '_' + this.$store.state.userdata.userid + '_' + item.fangwenma; //试卷id + 教师id + 访问码
            const code = Bs.Base64.encode(str);
            const h = this.$createElement;
            this.$msgbox({
            title: '加入代码',
            message: h('textarea', {style: "width:383px;height:30px"}, code),
            confirmButtonText: '确定'
            })
        },
        searchCla(cla) {
            this.getPapers(cla);
        },
        showPaper(item) {
            this.showSee = true;
            this.paperrow = item;
        },
        handleCurrentChange(val) {
            this.paperIndex = val;
        },
        addCla(){
            this.$confirm('确认添加这个分类吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(()=>{
                for(var i=0;i<this.classeslist.length;i++){
                    if(this.addClass==this.classeslist[i]){
                        this.$message({type:'error',message:'分类已存在'})
                        return;
                    }
                }
                this.$http.post('/api/teacher/addpapercla',{token:localStorage.getItem('token'),cla:this.addClass}).then(res=>{
                    if(res.data.status==1){
                        this.$message({type:'success',message:'添加成功'})
                        this.getcla()
                    }else{
                        this.$message({type:'error',message:'添加失败'})
                    }
                })
            }
            ).catch(()=>{
                this.$message({type:'error',message:'取消添加'})
            })
        },
        delCla(cla){
            this.$confirm('确认删除这个分类吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(()=>{
                this.$http.post('/api/teacher/delpapercla',{token:localStorage.getItem('token'),cla}).then(res=>{
                    if(res.data.status==1){
                        this.$message({type:'success',message:'删除成功'})
                        this.getcla()
                    }else{
                        this.$message({type:'error',message:'删除失败'})
                    }
                })
            }).catch(()=>{
                this.$message({type:'error',message:'取消删除'})
            })
        },
        getcla(){
            this.$http.get(`/api/teacher/getpapercla?user=${this.$store.state.userdata.username}`).then(res=>{
                this.classeslist = res.data.paperclasses
                // console.log(this.$store.userdata)
                // console.log(this.classeslist)
                this.classisok=false
            }).catch(err=>{
                this.$message({type:'error',message:'获取分类失败。。。'})
            })
        },
        getPapers(cla) {
            this.$http.get(`/api/papers/getallpaper?publisher=${this.$store.state.userdata.username}${cla !== '' && cla !== undefined? '&paperCla='+ cla : '' }`).then(res=>{
                this.papers = res.data.data.reverse();
                this.paperNum = this.papers.length
            })
        },
        delPaper(item){
            this.$http.get(`/api/papers/delpaper?token=${localStorage.getItem('token')}&id=${item._id}`).then(res=>{
                this.getPapers();
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
        }
    },
    created(){
        this.getcla();
        this.getPapers();
        this.getPaperUsedNum();
    }
}
</script>
<style lang="scss">
 .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
    #questions_list{
        .list-content{
            margin-bottom: 20px;
            display: flex;
            width: 90%;
            margin-left: 6%;
            .fenlei{
                width: 25%;
                min-height: 220px;
                border: 1px solid #c0c0c0;
                padding-left: 10px;
                padding-right:10px;
                .fenlei-list{
                    margin-top: 15px;
                }
            }
            .list{
                width:67%;
                min-height: 100px;
                border: 1px solid #c0c0c0;
                margin-left: 5px;
                padding-left: 10px;
                padding-right:10px;
                .pagination{
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                .title{
                    display:flex;
                }
                .paperlist{
                    margin-bottom: 20px;
                    display: flex;
                    border: 1px solid grey;
                    padding: 10px;
                    .fmimg{
                        width: 180px;
                        height: 150px;
                        overflow: hidden;
                        img{
                            // width: 100%;
                            height: 100%;
                        }
                    }
                    .content-warp{
                        flex-grow: 1;
                        height: 150px;
                        margin-left: 10px;
                        .pHeader{
                            height: 30px;
                            display: flex;
                            .ptitle{
                                width: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                h3{
                                    padding: 0;
                                    margin: 5px;
                                }
                                p{
                                    font-size: 13px;
                                    align-self: bottom;
                                    color: rgb(175, 174, 174);
                                }
                            }
                        }
                        .pContent{
                            display:flex;
                            margin-left: 5px;
                            color: rgb(99, 95, 95);
                            margin-top: 5px;
                        }
                        .pBottom{
                            margin-left: 5px;
                            display: flex;
                            color: gray;
                            margin-top: 15px;
                            width: 95%;
                            .publisher{
                                font-size: 13px;
                            }
                            .time{
                                font-size: 13px;
                                margin-left: 5px;
                            }
                            .manage{
                                // float: right;
                                margin-left: auto;
                            }
                        }
                    }
                }
            }
        }
    }
</style>