<template>
    <div id="my-record">
        <h3 class="title">考试记录</h3>
        <div class="content">
            <div class="analysis">
                <!-- 考试分析 -->
                <h4>考试分析</h4>
                <div class="ul">
                    <div class="col">
                        <img src="../../../assets/svg/paper.svg" width="50" height="50">
                        <div class="text">
                            <span>{{passNum}}份</span>
                            <span>及格试卷</span>
                        </div>
                    </div>
                    <div class="col">
                        <img src="../../../assets/svg/deng.svg" width="50" height="50">
                        <div class="text">
                            <span>{{examNum}}份</span>
                            <span>已完成试卷</span>
                        </div>
                    </div>
                    <div class="col">
                        <img src="../../../assets/svg/five.svg" width="50" height="50">
                        <div class="text">
                            <span>{{noExamNum}}份</span>
                            <span>未完成试卷</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="statistics">
                <h4>考试统计</h4>
                <div id="line" ref="myEchartLine" style="height:500px;width:1100px;"></div>
            </div>
            <div class="paper-record">
                <div class="table">
                    <el-table
                        :data="showTableData"
                        stripe
                        style="width: 100%">
                        <el-table-column
                        prop="index"
                        label="#"
                        width="50">
                        </el-table-column>
                        <el-table-column
                        prop="paper"
                        label="试卷"
                        width="300">
                        </el-table-column>
                        <el-table-column
                        prop="status"
                        label="状态">
                        </el-table-column>
                        <el-table-column
                        prop="score"
                        label="得分">
                        </el-table-column>
                        <el-table-column
                        prop="ispass"
                        label="是否及格">
                        </el-table-column>
                        <el-table-column
                        prop="date"
                        label="考试时间"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="time"
                        label="用时">
                        </el-table-column>
                        <!-- <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        </template>
                        </el-table-column> -->
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            @current-change="handleCurrentChange"
                            :total="tableData.length">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            passNum: 0,
            examNum: 0,
            noExamNum: 0,
            currentPage: 1,
            pageSize: 5,
            tableData: [],
            options: {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['平均成绩', '考试次数']
                },
                calculable : true,
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
                        name:'平均成绩',
                        type:'line',
                        data:[99, 56, 99, 12, 60, 13, 18]
                    },
                    {
                        name:'考试次数',
                        type:'line',
                        data:[1, 2, 3, 5, 6, 3, 2]
                    },
                ]
            }
        }
    },
    computed:{
        showTableData(){
            return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        },
    },
    mounted() {
        this.getLine();
        // this.init();
    },
    methods: {
        async getLine(){
            const _this = this;
            const res = await this.$http.post('/api/student/getline',{token:localStorage.getItem('token')})
            console.log(res.data);
            const data=res.data.data;
            _this.options.xAxis[0].data = data.dateList.reverse().map(e=>{
                return _this.getLocalDate(e);
            });
            _this.options.series[0].data = data.avList.reverse();
            _this.options.series[1].data = data.numList.reverse();
            _this.passNum = data.passNum;
            _this.examNum = data.examNum;
            _this.noExamNum = data.noExamNum;
            _this.init();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        getRecordList(){
            const _this = this;
            this.$http.post('/api/student/getrecordlist',{token:localStorage.getItem('token')}).then(res=>{
                const data = res.data.data.reverse();
                console.log(data);
                data.forEach((e,i) => {
                    const obj = {
                        index:i + 1,
                        paper:e.papertitle,
                        status:e.isexam?'已考试':'未考试',
                        score:e.score,
                        ispass:e.ispass?'及格':'不及格',
                        date: _this.getLocalTime(e.endTime),
                        time: _this.getTimeLong(e.startTime,e.endTime),
                    };
                    if (!e.isexam){
                        obj.ispass = '-------';
                    }
                    _this.tableData.push(obj)
                });
            })
        },
        init() {
            // let myEcharts = this.$echarts.init(this.$refs.myEchartLine);
            // myEcharts.setOption(this.options);
            let myChart = this.$echarts.init(document.getElementById('line'))
            // 绘制图表
            myChart.setOption(this.options);
            this.getRecordList();
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
        getTimeLong(start, end){
            const s = parseInt(start);
            const e = parseInt(end);
            const long = e - s;
            let min = Math.floor(long / 1000 / 60);
            let sec = Math.floor((long / 1000) % 60);
            min = min < 10 ? `0${min}`: min;
            sec = sec < 10 ? `0${sec}`: sec;
            return `${min}:${sec}`;
        },
    },
}
</script>
<style lang="scss" scoped>
    #my-record{
        .title{
            margin-left: 30px;
            margin-top: 20px;
        }
        .content{
            margin-top: 20px;
            margin-left: 30px;
            color: gray;
            .analysis{
                margin-left: 20px;
                margin-top: 10px;
                .ul{
                    display: flex;
                    justify-content: space-between;
                    width: 80%;
                    .col{
                        display: flex;
                        margin-left: 20px;
                        .text{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            margin-left: 10px;
                        }
                    }
                }
            }
            .statistics{
                margin-left: 20px;
                margin-top: 10px;
            }
            .paper-record{
                width: 85%;
                height: 100px;
                margin-bottom: 100px;
                border-radius: 5px;
                .table{
                    margin-left: 60px;
                    .pagination{
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        margin-top: 20px;
                    }
                }
            }
        }
    }
</style>