<template>
    <div id="wrong_questions">
        <!-- 错题练习 -->
        <See v-if="showSee" :row="Seedata" :myAnswer="myAnswer" @closeSee="()=>{showSee = false}"></See>
        <div class="desc_header">
            <div class="left">
                <p>做题总数 <span style="color:blue;margin-left:10px;">{{lineAllNum}}</span></p>
                <div id="sline" ref="sline" style="width:600px;height:300px;"></div>
            </div>
            <div class="right">
                <p>错误率 <span style="color:blue;margin-left:10px;">{{Math.floor((circleWrongNum/lineAllNum)*100)}}%</span></p>
                <div id="scircle" ref="scircle" style="width:550px;height:300px;"></div>
            </div>
        </div>
        <div class="bottom_list">
            <div class="bheader">
                <h2>错题列表</h2>
                <el-button type="success" @click="wrongPractice">错题练习</el-button>
            </div>
            <el-table
                :data="showTable"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="title"
                label="试题">
                </el-table-column>
                <el-table-column
                fixed
                prop="type"
                label="试题类型">
                </el-table-column>
                <el-table-column
                fixed
                prop="date"
                label="日期">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
                </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    layout="prev, pager, next"
                    :current-page.sync="currentPage"
                    :page-size="showNum"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import See from './see'

export default {
    components:{
        See
    },
    data() {
        return {
            myAnswer: [],
            showSee: false,
            Seedata: {},
            lineAllNum: 0,
            circleRightNum: 0,
            circleWrongNum: 0,
            lineOption:{
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['对的次数','错的次数']
                },
                calculable : true,
                color:['red', 'green'],
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'错的次数',
                        type:'line',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'对的次数',
                        type:'line',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    },
                ]
            },
            circleOption: {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        color:['red', 'green'],
                        data:[
                            {value:310, name:'错'},
                            {value:335, name:'对'},
                        ]
                    }
                ]
            },
            tableData:[],     
            wrongQuesList:[],   
            wrongRec:[],
            quesIds: [],

            showNum: 5,
            currentPage: 1,
        };
    },
    computed:{
        showTable() {
            return this.tableData.slice((this.currentPage-1)*this.showNum,this.currentPage*this.showNum);
        },
    },
    mounted(){
        this.getline();
        this.getCircle();
        this.getWrongList();
    },
    methods:{
        wrongPractice() {
            this.$confirm('将开始错题练习?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$http.post('/api/exam/createWrongPaper', {
                    quesIds: this.quesIds,
                    token: localStorage.getItem('token'),
                }).then(res=>{
                    this.$router.push(`/examing/${res.data.data[0]._id}`);
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '结束'
            });          
            });
        },
        handleClick(row){
            this.Seedata = this.wrongQuesList[row.index];
            this.myAnswer = this.wrongRec[row.index].answer;
            this.showSee = true;
        },
        getline() {
            const _this = this;
            this.$http.post('/api/wrong/getline', {
                token: localStorage.getItem('token'),
            }).then(res=>{
                if (res.data.status === 0) {
                    _this.$message({type:'error',message:res.data.msg})
                }else {
                    let data = res.data.data;
                    _this.lineAllNum = data.allNum;
                    _this.lineOption.xAxis[0].data = data.dateList.reverse().map(e=>{
                        return _this.getLocalDate(e);
                    });
                    _this.lineOption.series[1].data = data.rightList.reverse();
                    _this.lineOption.series[0].data = data.wrongList.reverse();
                    let myChart1 = this.$echarts.init(document.getElementById('sline'))
                    myChart1.setOption(this.lineOption);
                }
            })
        },
        getCircle() {
            const _this = this;
            this.$http.post('/api/wrong/getcircle', {
                token:localStorage.getItem('token')
            }).then(res=>{
                if (res.data.status === 0) {
                    this.$message({type:'error',message:res.data.msg})
                } else {
                    let data = res.data.data;
                    _this.circleWrongNum = data.wrongNum;
                    _this.circleRightNum = data.rightNum;
                    _this.circleOption.series[0].data[0].value = _this.circleWrongNum;
                    _this.circleOption.series[0].data[1].value = _this.circleRightNum;
                    let myChart2 = _this.$echarts.init(document.getElementById('scircle'))
                    myChart2.setOption(_this.circleOption);
                }
            })
        },
        getWrongList() {
            const _this = this;
            this.$http.post('/api/wrong/getwronglist',{
                token:localStorage.getItem('token')
            }).then(res=>{
                if(res.data.status===0) {
                    _this.$message({type:'error',message:res.data.msg})
                }else {
                    const data = res.data.data;
                    _this.wrongQuesList = data.qs;
                    _this.wrongRec = data.data;
                    _this.quesIds = data.ids;
                    for(let i=0;i<_this.wrongQuesList.length;i++){
                        const reg = /<\/?.+?>/g;
                        const obj = {
                            title:_this.wrongQuesList[i].question.replace(reg, "").replace(/ /g,""),
                            date:_this.getLocalTime(_this.wrongRec[i].date),
                            index: i,
                            type: _this.wrongQuesList[i].type,
                        };
                        _this.tableData.push(obj);
                    }
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
        getLocalDate(nS) { 
            //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
            // d.cTime = 1539083829787
            nS = parseInt(nS)
            let date = new Date(nS);
            let month = date.getMonth()+1;
            let day = date.getDate();
            // month = month < 10 ? "0"+month:month;
            // day = day < 10 ? "0"+day:day;
            date = month+'月'+day +'日';
            return date;
        },
    },
}
</script>
<style lang="scss" scoped>
    #wrong_questions{
        button{
            cursor: pointer;
        }
        margin-left: 30px;
        margin-top: 20px;
        margin-right: 30px;
        .desc_header{
            display: flex;
            .left{
                display:flex;
                flex-direction: column;
                align-items: center;
                width: 700px;
                height:300px;
                background-color:rgba(192, 187, 187, 0.3);
                h2{
                    margin:0;
                }
            }
            .right{
                margin-left: 50px;
                width: 300px;
                flex-grow:1;
                height:300px;
                background-color:rgba(238, 221, 201, 0.3);
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }
        .bottom_list{
            margin-top:30px;
            width: 100%;
            height: 300px;
            // background-color:rgba(238, 221, 201, 0.3);
            // display:flex;
            // justify-content: center;
            .bheader{
                display:flex;
                justify-content: space-between;
                height:60px;
                align-items: center;
                h2{
                    margin:0;
                    margin-left:10px;
                }
                button{
                    height:35px;
                    margin-right: 10px;
                }
            }
            .pagination{
                width: 100%;
                display: flex;
                justify-content: center;
                margin-top: 20px;
                margin-bottom: 50px;
            }
        }
    }
</style>