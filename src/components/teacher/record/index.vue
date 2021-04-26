<template>
    <div id="teacher-record">
        <h2>统计分析</h2>
        <el-row>
            <el-col :span="8" style="margin-left:100px;">
                <div class="grid-content bg-purple">
                    <div class="record-info">
                        <div class="info-header">
                            <h2>统计分析</h2>
                        </div>
                        <div class="info-con">
                            <div class="row">
                                <span>试卷数量</span>
                                <p>{{recordInfo.paperNum}}</p>
                            </div>
                            <div class="row">
                                <span>试题数量</span>
                                <p>{{recordInfo.quesNum}}</p>
                            </div>
                            <div class="row">
                                <span>考试次数</span>
                                <p>{{recordInfo.examNum}}次</p>
                            </div>
                            <div class="row">
                                <span>及格率</span>
                                <p>{{((recordInfo.passNum/(recordInfo.passNum+recordInfo.noPassNum)*100) || 0).toFixed(2)}}%</p>
                            </div>
                            <div class="row">
                                <span>平均分</span>
                                <p>{{Math.floor(recordInfo.avgsocre)}}</p>
                            </div>
                            <div class="row">
                                <span>及格</span>
                                <p>{{recordInfo.passNum}}次</p>
                            </div>
                            <div class="row">
                                <span>不及格</span>
                                <p>{{recordInfo.noPassNum}}次</p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8" style="margin-left:100px;">
                <div class="grid-content bg-purple">
                    <div class="record-info">
                        <div class="info-header">
                            <h2>及格率</h2>
                        </div>
                        <div class="info-content">
                            <div id="circle" ref="myEchartCircle" style="height:300px;width:100%;"></div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="18" style="margin-left:7%;margin-top:20px;">
                <div class="grid-content bg-purple-dark">
                    <div class="examnum">
                        <div class="info-header">
                            <h2>考试综合分析</h2>
                        </div>
                        <div class="info-content" style="margin-top:20px;">
                            <div id="line" ref="myEchartLine" style="height:300px;width:100%;"></div>
                        </div>
                        <div class="info-content" style="margin-top:20px;">
                            <div id="line2" ref="myEchartLine" style="height:300px;width:100%;"></div>
                        </div>
                        <div class="info-content" style="margin-top:20px;">
                            <div id="line3" ref="myEchartLine" style="height:300px;width:100%;"></div>
                        </div>
                        <div class="info-content" style="margin-top:20px;">
                            <div id="histogram" style="height:300px;width:100%;"></div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="18" style="margin-left:7%;margin-top:20px;">
                <div class="grid-content bg-purple-dark">
                    <div class="examnum">
                        <div class="info-header header-green">
                            <h2>考试记录</h2>
                        </div>
                        <div class="info-content" style="margin-bottom:20px;">
                            <div class="table-button">
                                <el-select v-model="stuValue" placeholder="请选择考生">
                                    <el-option
                                    v-for="item in stuList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="paperValue" placeholder="请选择试卷">
                                    <el-option
                                    v-for="item in paperList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button @click="clearFilter" type="info">清除所有过滤器</el-button>
                                <el-button @click="exportExcel" type="primary">下载表格</el-button>
                            </div>
                            <el-table
                            ref="filterTable"
                            :data="showTable"
                            height="500"
                            style="width: 100%">
                            <el-table-column
                            prop="username"
                            label="用户名"
                            sortable
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="realName"
                            label="真实姓名"
                            sortable
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="papertitle"
                            label="试卷"
                            sortable>
                            </el-table-column>
                            <el-table-column
                            prop="score"
                            sortable
                            label="考试分数">
                            </el-table-column>
                            <el-table-column
                            prop="ispass"
                            sortable
                            label="是否及格">
                            </el-table-column>
                            <el-table-column
                            prop="date"
                            sortable
                            label="考试时间">
                            </el-table-column>
                        </el-table>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Export2Excel from '../../../assets/excel/Export2Excel.js';
import Blob from '../../../assets/excel/Blob.js';

export default {
    data(){
        return {
            paperValue: '',
            stuValue: '',
            recordInfo:{
                paperNum:0,
                quesNum:0,
                examNum:0,
                avgsocre:0,
                passNum:0,
                noPassNum:0
            },
            currentPage: 1,
            pageSize: 10,
            tableData:[],
            options1: {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                series : [
                    {
                        name:'是否及格',
                        type:'pie',
                        radius : '60%',
                        data:[
                            {value:100, name:'不及格'},
                            {value:300, name:'及格'},
                        ]
                    }
                ]
            },
            options2:{
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    data:['考试次数']
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'考试次数',
                        type:'line',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                ]
            },
            options3:{
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                color:['orange'],
                legend: {
                    data:['平均成绩']
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name: '平均成绩',
                        type: 'line',
                        data:[],
                    },
                ]
            },
            options4:{
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                color:['green'],
                legend: {
                    data:['发布试卷数量']
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name: '发布试卷数量',
                        type: 'line',
                        data:[],
                    },
                ]
            },
            options5:{
                title: {
                    x: 'center',
                    text: '试题分布',
                },
                tooltip: {
                    trigger: 'item'
                },
                calculable: true,
                grid: {
                    borderWidth: 0,
                    y: 80,
                    y2: 60
                },
                xAxis: [
                    {
                        type: 'category',
                        show: false,
                        data: ['单选题', '多选题', '填空题', '判断题', '问答题']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: false
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [
                                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{b}\n{c}'
                                }
                            }
                        },
                        data: [12,21,10,4,12],
                        markPoint: {
                            tooltip: {
                                trigger: 'item',
                                backgroundColor: 'rgba(0,0,0,0)',
                                formatter: function(params){
                                    return '<img src="' 
                                            + params.data.symbol.replace('image://', '')
                                            + '"/>';
                                }
                            },
                            data: [
                                {xAxis:1, y: 350, name:'Bar', symbolSize:20, symbol: 'image://../asset/ico/柱状图.png'},
                            ]
                        }
                    }
                ]
            },
        }
    },
    computed: {
        paperList() {
            const table = this.tableData.map(e=>{
                return e.papertitle;
            });
            let arr = [];
            for(let i=0;i<table.length;i++){
                if (arr.indexOf(table[i]) < 0) {
                    arr.push(table[i]);
                }
            }
            return arr.map(e=>{
                return {
                    label: e,
                    value: e,
                }
            });
        },
        stuList() {
            const table = this.tableData.map(e=>{
                return e.studentid.realName
            });
            let arr = [];
            for(let i=0;i<table.length;i++){
                if (arr.indexOf(table[i]) < 0) {
                    arr.push(table[i]);
                }
            }
            return arr.map(e=>{
                return {
                    label: e,
                    value: e,
                }
            });
        },
        showTable() {
            // let table = this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
            let table = this.tableData;
            const retable = table.map(e=>{
                return {
                    username: e.studentid.username,
                    realName: e.studentid.realName,
                    papertitle:e.papertitle,
                    score: e.score,
                    ispass: e.ispass?'及格':'不及格',
                    date: this.getLocalTime(e.endTime),
                }
            });
            if (this.stuValue !== '' && this.paperValue === '') {
                return retable.filter(e=>{
                    return e.realName === this.stuValue;
                })
            }
            if (this.stuValue === '' && this.paperValue !== '') {
                return retable.filter(e=>{
                    return e.papertitle === this.paperValue;
                })
            }
            if (this.stuValue !== '' && this.paperValue !== '') {
                return retable.filter(e=>{
                    return e.papertitle === this.paperValue && e.realName === this.stuValue;
                })
            }
            return retable;
        },
    },
    mounted(){
        // this.init();
        this.getRecordInfo();
        this.getRecordLine();
        this.getRecordTable();
    },
    methods:{
        exportExcel() {
            require.ensure([], () => {
                const { export_json_to_excel } = require('../../../assets/excel/Export2Excel.js');
                const tHeader = ['用户名', '真实姓名', '试卷', '考试分数', '是否及格', '考试时间'];
                // 上面设置Excel的表格第一行的标题
                const filterVal = ['username', 'realName', 'papertitle', 'score', 'ispass', 'date'];
                // 上面的index、nickName、name是tableData里对象的属性
                const list = this.showTable;  //把data里的tableData存到list
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '列表excel');
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        clearFilter(){
            this.stuValue = '';
            this.paperValue = '';
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
        getRecordInfo(){
            this.$http.post('/api/threcord/getrecordinfo',{token:localStorage.getItem('token')}).then(res=>{
                if(res.data.status===0){
                    this.$message({type:'error',message:'查询记录失败'})
                }else{
                    this.recordInfo = res.data.data;
                    this.options1.series[0].data[0].value = this.recordInfo.noPassNum;
                    this.options1.series[0].data[1].value = this.recordInfo.passNum;
                    let myChart1 = this.$echarts.init(document.getElementById('circle'))
                    myChart1.setOption(this.options1);
                }
            })
        },
        getRecordLine() {
            this.$http.post('/api/threcord/getrecordline',{token:localStorage.getItem('token')}).then(res=>{
                if(res.data.status===0){
                    this.$message({type:'error',message:'查询记录失败'})
                }else{
                    console.log(res.data)
                    this.options2.xAxis[0].data = res.data.data.dateList.reverse().map(e=>this.getLocalDate(e));
                    this.options3.xAxis[0].data = res.data.data.dateList.reverse().map(e=>this.getLocalDate(e));
                    this.options4.xAxis[0].data = res.data.data.dateList.reverse().map(e=>this.getLocalDate(e));
                    this.options2.series[0].data = res.data.data.numList.reverse();
                    this.options3.series[0].data = res.data.data.avList.reverse();
                    this.options4.series[0].data = res.data.data.publishNum.reverse();
                    this.options5.series[0].data = res.data.data.quesNum;
                    let myChart1 = this.$echarts.init(document.getElementById('line'))
                    // 绘制图表
                    myChart1.setOption(this.options2);
                    let myChart2 = this.$echarts.init(document.getElementById('line2'))
                    // 绘制图表
                    myChart2.setOption(this.options3);
                    let myChart3 = this.$echarts.init(document.getElementById('line3'))
                    // 绘制图表
                    myChart3.setOption(this.options4);
                    let myChart4 = this.$echarts.init(document.getElementById('histogram'))
                    // 绘制图表
                    myChart4.setOption(this.options5);
                }
            })
        },
        getRecordTable(){
            this.$http.post('/api/threcord/getrecordtable',{token:localStorage.getItem('token')}).then(res=>{
                this.tableData = res.data.data;
            })
        },
    },
}
</script>
<style lang="scss" scoped>
    #teacher-record{
        margin-left:30px;
        margin-top:20px;
        .record-info{
            width: 100%;
            height: 300px;
            border:1px solid #1bbc9b;
            .info-header{
                width: 100%;
                height:45px;
                background-color: #1bbc9b;
                border:1px solid #1bbc9b;
                h2{
                    line-height: 45px;
                    margin: 0;
                    padding: 0;
                    margin-left: 20px;
                    color: white;
                }
            }
            .info-con{
                .row{
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    margin-top: 13px;
                    span{
                        margin-left: 50px;
                    }
                    p{
                        margin:0;
                        margin-right: 100px;
                    }
                }
            }
        }
        .examnum{
            .info-header{
                width: 100%;
                height:45px;
                background-color: #e26a6a;
                border:1px solid #e26a6a;
                h2{
                    line-height: 45px;
                    margin: 0;
                    padding: 0;
                    margin-left: 20px;
                    color: white;
                }
            }
            .table-button{
                margin-top: 20px;
            }
            .header-green{
                background-color: rgb(84, 194, 84);
                border:0;
            }
        }
    }
</style>