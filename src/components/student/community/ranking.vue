<template>
    <div id="teacher-ranking">
        <div class="Top_Record">
            <div class="record_Top"><p>成绩排行榜</p></div>
            <div class="topRec_List">
                <dl>
                    <dd>排行</dd>
                    <dd>用户名</dd>
                    <dd>平均分</dd>
                    <dd>最高分</dd>
                </dl>
                <div class="examscore maquee">
                    <ul>
                        <li v-for="(item, index) in ranking1" :key="index">
                            <div>{{index + 1}}</div>
                            <div>{{item.user[0].username}}</div>
                            <div>{{item.avg.toFixed(3)}}</div>
                            <div>{{item.max}}</div>
                        </li> 
                    </ul>
                </div>
            </div>
        </div> 

        <div class="Top_Record">
            <div class="record_Top"><p>考试数量排行榜</p></div>
            <div class="topRec_List">
                <dl>
                    <dd>排行</dd>
                    <dd>姓名</dd>
                    <dd>考试次数</dd>
                    <dd>平均成绩</dd>
                </dl>
                <div class="examnum maquee">
                    <ul>
                        <li v-for="(item, index) in ranking2" :key="index">
                            <div>{{index +1}}</div>
                            <div>{{item.user[0].username}}</div>
                            <div>{{item.num}}</div>
                            <div>{{item.avg.toFixed(3)}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div> 

        <div class="apple">
            <ul>
                <li><a href="#" target="_blank">你是我的小丫小苹果 </a></li>  
                <li><a href="#" target="_blank">怎么爱你都不嫌多</a></li> 
                <li><a href="#" target="_blank">红红的小脸儿温暖我的心窝 </a></li>  
                <li><a href="#" target="_blank">点亮我生命的火 火火火火</a></li> 
                <li><a href="#" target="_blank">你是我的小丫小苹果 </a></li>  
                <li><a href="#" target="_blank">就像天边最美的云朵</a></li>  
                <li><a href="#" target="_blank">春天又来到了花开满山坡 </a></li>  
                <li><a href="#" target="_blank">种下希望就会收获</a></li> 
            </ul> 
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
export default {
    data(){
        return {
            timer0:0,
            timer1:0,
            timer2:0,
            ranking1: [],
            ranking2: [],
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        getRanking() {
            this.$http.get('/api/threcord/getranking').then(res=>{
                if (res.data.status === 0) {
                    this.$message({type:'error',message:'获取排行失败'})
                }
                this.ranking1 = res.data.data.ranking1;
                this.ranking2 = res.data.data.ranking2;
            })
        },
        autoScroll(obj){  
			$(obj).find("ul").animate({  
				marginTop : "-39px"  
			},500,function(){  
				$(this).css({marginTop : "0px"}).find("li:first").appendTo(this);  
			})
		},
        init(){
            this.timer0 = setInterval(()=>{this.autoScroll(".examnum")},3000);
            this.timer2 = setInterval(()=>{this.autoScroll(".examscore")},3500);
            this.timer1 = setInterval(()=>{this.autoScroll(".apple")},2000);
            this.getRanking();
        }
    },
    destroyed(){
        clearInterval(this.timer0);
        clearInterval(this.timer1);
        clearInterval(this.timer2);
    }
}
</script>
<style lang="scss" scoped>
    #teacher-ranking{
        *{ margin:0px; padding:0px; font-family:'微软雅黑'; -webkit-tap-highlight-color:rgba(0,0,0,0);  }
        li{ list-style:none }
        img{ border:none}
        a{text-decoration:none;} 
        .record_Top{width:90%; height:50px; background:url(../../../assets/ranking/record_Bg.png) center center no-repeat; background-size:contain; text-align:center; line-height:50px; margin:30px auto 0px; color:#fff;}
        .topRec_List dl,.maquee{ width:90%; overflow:hidden; margin:0 auto; color:#7C7C7C}
        .topRec_List dd{ float:left; text-align:center; border-bottom:1px solid #1B96EE; color:#1B96EE;}
        .topRec_List dl dd:nth-child(1){ width:17%; height:40px; line-height:40px; }
        .topRec_List dl dd:nth-child(2){ width:18%; height:40px; line-height:40px; }
        .topRec_List dl dd:nth-child(3){ width:25%; height:40px; line-height:40px; }
        .topRec_List dl dd:nth-child(4){ width:40%; height:40px; line-height:40px; }
        .maquee{ height:195px;}
        .topRec_List ul{ width:100%; height:195px;}
        .topRec_List li{ width:100%; height:38px; line-height:38px; text-align:center; font-size:12px; border-bottom: 1px dashed #aaa;}
        /*.topRec_List li:nth-child(2n){ background:#077cd0}*/
        .topRec_List li div{ float:left;}
        .topRec_List li div:nth-child(1){ width:17%;}
        .topRec_List li div:nth-child(2){ width:18%;}
        .topRec_List li div:nth-child(3){ width:25%;}
        .topRec_List li div:nth-child(4){ width:40%;}

        .apple a{display:block; text-decoration:none;}

        .apple,.aa{ width:90%; height:50px; overflow:hidden; margin:30px auto; border:1px solid #1B96EE;}
        .apple a,.aa a{ width:100%; height:50px; line-height:50px; text-indent:20px; color:#1B96EE;}
        .aa {word-wrap:break-word;line-height:50px;  color:#1B96EE;}

    }
</style>