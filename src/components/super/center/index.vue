<template>
  <div id="super_center">
    <div class="wrap">
      <el-row>
        <el-col :span="6">
          <h3 style="color:gray;">学生总数<span>{{studentNum}}</span>人</h3>
        </el-col>
        <el-col :span="6">
          <h3 style="color:gray;">教师总数<span>{{teacherNum}}</span>人</h3>
        </el-col>
        <el-col :span="6">
          <h3 style="color:gray;">试卷数量<span>{{paperNum}}</span>份</h3>
        </el-col>
        <el-col :span="6">
          <h3 style="color:gray;">试题数量<span>{{questionsNum}}</span>题</h3>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <h2 style="color:gray;">已考试<span>{{isExamNum}}</span>次</h2>
        </el-col>
        <el-col :span="12">
          <h2 style="color:gray;">未完成考试还剩<span>{{noExamNum}}</span>场</h2>
        </el-col>
      </el-row>
      <div class="data">
          <div id="histogram" style="height:300px;width:100%;"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            teacherNum:0,
            studentNum:0,
            paperNum:0,
            questionsNum:0,
            isExamNum:0,
            noExamNum:0,
            options:{
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
    mounted() {
        this.get();
    },
    methods: {
        get() {
            this.$http.post('/api/surecord/getrecord',{
                token: localStorage.getItem('token')
            }).then(res=>{
                this.options.series[0].data = res.data.data.quesNumList;
                let myChart = this.$echarts.init(document.getElementById('histogram'))
                myChart.setOption(this.options);
                let data =  res.data.data;
                this.teacherNum = data.teacherNum;
                this.studentNum = data.studentNum;
                this.paperNum = data.paperNum;
                this.questionsNum = data.questionsNum;
                this.isExamNum = data.isExamNum;
                this.noExamNum = data.noExamNum;
            })
        },
    }
}
</script>
<style lang="scss" scoped>
#super_center {
  width: 100%;
  margin-left: 20px;
//   display: flex;
//   justify-content: center;
  .wrap {
    width: 70%;
    margin-top: 30px;
    h2,
    h3 {
      text-align: center;
    }
    h2 span {
      font-size: 30px;
      color: green;
    }
    h3 span {
      font-size: 30px;
      color: orange;
    }
  }
  .data{
      margin-top: 30px;
  }
}
</style>