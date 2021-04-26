<template>
    <div id="teacher-center">
        <edit v-if="editIsShow" @close="closeEdit"></edit>
        <div class="left">
            <h2>您好! {{this.$store.state.userdata.username}}</h2>
            <div class="info">
                <div class="row1">
                    <p><span>{{examingNum}}</span>人正在考试</p>
                    <p style="margin-left:20px;">共<span @click="alertEdit" style="cursor:pointer">{{waitNum}}</span>份试卷需要批改</p>
                </div>
                <div class="row2">
                    <div id="centerline" ref="centerline" style="height:500px;width:100%;"></div>
                </div>
            </div>
        </div>
<!--        <div class="right">-->
<!--            <div class="info">-->
<!--                <h3>系统公告</h3>-->
<!--                <div class="message">-->
<!--                    <span v-for="(item,index) in this.$store.state.config.announcement" :key="index">{{item}}</span>-->
<!--                </div>-->
<!--                <el-divider></el-divider>-->
<!--            </div>-->
<!--            <div class="ad">-->
<!--                <h3>广告</h3>-->
<!--                <div class="html" v-html="this.$store.state.config.ad"></div>-->
<!--                <el-divider></el-divider>-->
<!--            </div>-->
<!--            <div class="friend">-->
<!--                <h3>友情链接</h3>-->
<!--                <div class="friend_list">-->
<!--                    <el-link :href="item.href" type="info" v-for="(item, index) in this.$store.state.config.friend_chain" :key="index">{{item.label}}</el-link>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>
<script>
import edit from './alert'
export default {
    components:{edit},
    data(){
        return{
            editIsShow: false,
            examingNum: 0,
            waitNum: 0,
            options: {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['考试次数']
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
                        name:'考试次数',
                        type:'line',
                        data:[1, 2, 3, 5, 6, 3, 2]
                    },
                ]
            }
        }
    },
    mounted(){
        this.getCenterInfo();
    },
    methods:{
        closeEdit() {
            this.editIsShow = false;
            this.getCenterInfo();
        },
        alertEdit() {
            this.editIsShow = true;
        },
        init() {
            // let myEcharts = this.$echarts.init(this.$refs.myEchartLine);
            // myEcharts.setOption(this.options);
            let myChart = this.$echarts.init(document.getElementById('centerline'))
            // 绘制图表
            myChart.setOption(this.options);
        },
        getCenterInfo() {
            this.$http.post('/api/teacher/getcenterline',{
                token: localStorage.getItem('token')
            }).then(res=>{
                if (res.data.status === 0) {
                    this.$message({type:'error',message:res.data.msg})
                }else {
                    const data = res.data.data;
                    this.options.series[0].data = data.examNumList.reverse();
                    this.options.xAxis[0].data = [];
                    for (let i=data.dateList.length-1;i>-1; i--){
                        this.options.xAxis[0].data.push(this.getLocalDate(data.dateList[i]));
                    }
                    this.examingNum = data.examingNum;
                    this.waitNum = data.waitNum;
                    this.init();
                }
            })
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
    }
}
</script>
<style lang="scss" scoped>
    #teacher-center{
        display: flex;
        .friend_list{
            display: flex;
            width: 300px;
            justify-content: flex-start;
            a{
                margin-left: 5px;
            }
        }
        .ad{
            width: 100%;
        }
        .left{
            width: 100%;
            margin-left: 80px;
            margin-top: 20px;
            h2{
                color: rgb(65, 63, 63);
            }
            .info{
                .row1{
                    display: flex;
                    // margin-left: 50px;
                    justify-content: center;
                    p{
                        span{
                            font-size: 50px;
                            color: green;
                        }
                    }
                }
            }
        }
        .right{
            width:20%;
            margin-top: 100px;
            .info{
                .message{
                    display: flex;
                    flex-direction: column;
                    span{
                        margin-top: 10px;
                    }
                }
            }
        }
    }
</style>
