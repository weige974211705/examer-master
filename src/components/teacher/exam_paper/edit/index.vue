<template>
    <div id="paper-edit">
        <div class="paper-edit-header">
            <h2>添加试卷</h2>
            <el-steps :space="600" :active="currentActive + 1" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="选择试题"></el-step>
                <el-step title="试卷设置"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <div class="paper-edit-content">
                <div class="content-1" v-if="currentActive === 0">
                    <h3>试卷标题</h3>
                    <el-input style="width:500px;" placeholder="请输入" v-model="paperData.title"></el-input>
                    <h3>试卷描述</h3>
                    <el-input
                    style="width:500px;"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="paperData.desc"
                    >
                    </el-input>

                    <h3>添加图片</h3>
                    <el-upload
                        class="avatar-uploader"
                        action="/api/upload/img/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>

                    <h3>试卷分类</h3>
                    <el-select v-model="paperData.paperCla" placeholder="请选择" style="width:500px;">
                        <el-option
                        v-for="item in paperclasses"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                    <br/>
                    <el-checkbox style="margin-top:30px;" v-model="paperData.privateChecked"><h3>设为私有试卷</h3></el-checkbox>
                    <br/>
                    <el-button @click="addCurrentActive" type="primary" style="width:200px;margin:10px;">下一步</el-button>
                </div>
                <div class="content-2" v-if="currentActive === 1">
                    <h3>选择试题</h3>
                    <el-radio v-model="paperData.questionModel" label="custom">自定义试题</el-radio>
                    <el-radio v-model="paperData.questionModel" label="random">随机试题</el-radio>
                    <h3 v-if="paperData.questionModel === 'custom'">总分: {{paperData.score}}</h3>
                    <div style="display:flex;align-items:center;"  v-if="paperData.questionModel === 'random'" >
                        <h3>总分设置: </h3>
                        <el-input-number v-model="paperData.score" placeholder="请设置试卷总分" style="width:200px;margin-left:20px;"></el-input-number>
                    </div>
                    <Transfer style="margin-top:30px;" @getUseList="getUseList"></Transfer>
                    <br/>
                    <el-button @click="addCurrentActive" type="primary" style="width:200px;margin:10px;margin-top:30px;">下一步</el-button>
                </div>
                <div class="content-3" v-if="currentActive === 2">
                    <h3>试卷开放时间</h3>
                    <el-radio v-model="paperData.timeOption" label="1">
                        <span style="margin-right:10px;">开放时间</span>
                        <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="starttimetoend"
                        type="datetimerange"
                        :picker-options="pickerOptions2"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                        </el-date-picker>
                    </el-radio>
                    <br/><br/>
                    <el-radio v-model="paperData.timeOption" label="2">永久有效</el-radio>
                    <br/><br/>
                    <el-radio v-model="paperData.timeOption" label="3">不可用</el-radio>
                    <h3>权限认证</h3>
                    <el-radio v-model="paperData.so" label="1">对所有人可见</el-radio>
                    <el-radio v-model="paperData.so" label="2">通过访问码考试</el-radio>
                    <div class="fangwenma" v-if="paperData.so === '2'">
                        <h3>访问码: {{paperData.fangwenma}}</h3>
                        <el-button type="primary" class="btn"
                        v-clipboard:copy="paperData.fangwenma"
                        v-clipboard:success="onCopy"
                        >复制</el-button>
                        <el-button @click="createFanwenma">重新生成访问码</el-button>
                    </div>
                    <h3>考试时间</h3>
                    <el-input-number v-model="paperData.timeLong" @change="numberChange" :min="1" :max="120" label="考试时长"></el-input-number><span>  分钟</span>
                    <h3>及格分数</h3>
                    <el-input-number v-model="paperData.paperPassScore" @change="scorePassChange" :min="1" :max="100" label="及格分数"></el-input-number><span>  分</span>
                    <h3>考试说明</h3>
                    <quill-editor 
                    v-model="paperData.paperInfo"
                    ref="myQuillEditor" 
                    :options="editorOption" >
                    </quill-editor>
                    <el-button @click="Save" type="primary" style="width:200px;margin:10px;margin-top:30px;">完成</el-button>
                </div>
                <div class="content-4" v-if="currentActive === 3">
                    <h1 style="text-align:center;width:80%;">{{paperData.title}}</h1>
                    <div class="success-wrap">
                        <div class="svg">
                            <svg width="200" height="200" class="done" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="circle" cx="26" cy="26" r="25" fill="none" />
                                <path class="check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <h3 style="width:100%; text-align:center;margin-top:50px;">试卷创建成功</h3>
                        <p style="width:100%; text-align:center;margin-top:50px;">试卷开放时间:</p>
                        <p style="width:100%; text-align:center;" v-if="paperData.timeOption == '1'">{{starttimetoend[0]}} 至 {{starttimetoend[1]}}</p>
                        <p style="width:100%; text-align:center;" v-if="paperData.timeOption == '2'">永久有效</p>
                        <p style="width:100%; text-align:center;" v-if="paperData.timeOption == '3'">不可用</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Transfer from './transfer'
import { quillEditor } from 'vue-quill-editor'
import Clipboard from 'clipboard'


export default {
    data(){
        return {
            copyValue: '',
            paperclasses: [],
            timeLong: 0,
            fangwenma: '12345',
            useradio:'1',
            currentActive:0,
            imageUrl:'',
            selectdata:'',
            options:[],
            radio:'1',
            opentimeradio:'',
            pickerOptions2: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }]
            },
            value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
            value5: '',
            editorOption:{
                modules:{
                    toolbar:[
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block','image']
                    ]
                }
            },
            starttimetoend: [],
            paperData:{
                title: '', //标题
                desc: '', //描述
                imgurl: '', //封面地址
                paperCla: '', //试卷分类
                privateChecked: false, //是否私有
                questionModel:'custom', //试题模式，自定义和随机
                questionsList: [], //试题列表
                timeOption: '1', //时间模式设定， 1自定义时间， 2永久有效，3不可用
                timestend:[], //如果时间自定义，这就是时间戳开始到结束
                so: '1', //试卷开放模式，1为对所有人可见，2为访问码加入
                fangwenma: '', //如果试卷加入模式为访问码则有效
                timeLong: 60, //考试时长，默认60分钟
                paperInfo: '', //试卷说明信息
                paperPassScore: 60, //试卷及格分数
                score: 0, //总分
            },
        }
    },
    components:{ Transfer, quillEditor },
    methods:{
        onCopy(e){
            this.$message('已复制到剪贴板');
        },
        addCurrentActive() {
            if ((this.paperData.title==''||!this.paperData.desc||!this.paperData.imgurl||!this.paperData.paperCla)&&this.currentActive==0){
                this.$message('请填写完整.');
            } else if(this.currentActive==2&&((this.paperData.timeOption=='1'&&!this.paperData.timestend))) {
                this.$message('请填写完整.');
            } else {
                this.currentActive += 1;
            }
        },
        Save(){
            var starttime = (new Date(this.starttimetoend[0])).getTime();
            var endtime = (new Date(this.starttimetoend[1])).getTime();
            this.paperData.timestend = [starttime, endtime];
            this.$http.post('/api/papers/addpaper',{paperData:this.paperData, token: localStorage.getItem('token')}).then((res)=>{
                if (res.data.status == 1) {
                    this.$message({type:'success', message: '添加试卷成功'})
                } else {
                    this.$message({type:'error', message: '添加试卷失败'})
                }
                console.log(res.data);
            }).catch(e=>{
                this.$message({type:'error', message: '添加试卷失败'})
            })
            this.currentActive += 1;
        },
        getUseList(list, score){
            this.paperData.questionsList = list;
            this.paperData.score = score
        },
        submitPaper(){
            console.log(this.paperData);
        },
        numberChange(val){

        },
        scorePassChange(val) {

        },
        handleAvatarSuccess(res, file) {
            
            this.imageUrl ='/api'+ res.filepath;
            this.paperData.imgurl = this.imageUrl;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        createFanwenma(){
            this.fangwenma = Math.random().toString(36).substr(2);
            this.paperData.fangwenma = Math.random().toString(36).substr(2);
        }
    },
    created(){
        this.createFanwenma();

        this.$http.get(`/api/teacher/getpapercla?user=${this.$store.state.userdata.username}`).then(res=>{
            this.paperclasses = res.data.paperclasses;
        }).catch(err =>{
            console.log(err);
        })

        const btnCopy = new Clipboard('btn');
        this.copyValue = this.paperData.fangwenma;//正在做复制访问码
    },
}
</script>
<style lang="scss">
    #paper-edit{
        .svg{
            width: 200px;
            height: 200px;
            margin-left: auto;
            margin-right: auto;
            margin-top: 100px;
            .done {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                display: block;
                stroke-width: 2;
                stroke: #fff;
                stroke-miterlimit: 10;
                margin: 20px auto;
                box-shadow: inset 0px 0px 0px #7ac142;
                animation: fill-green 0.5s ease-in-out 0.5s forwards, scale 0.3s ease-in-out 0.7s both;
            }
            .done .circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                stroke-width: 2;
                stroke-miterlimit: 10;
                stroke: #7ac142;
                fill: none;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }
            .done .check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                animation: stroke 0.7s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
            }
            @keyframes stroke {
                100% {
                    stroke-dashoffset: 0;
                }
            }
            @keyframes scale {
                0%, 100% {
                    transform: none;
                }
                50% {
                    transform: scale3d(1.2, 1.2, 1);
                }
                80% {
                    transform: scale3d(0.8, 0.8, 1);
                }
            }
            @keyframes fill-green {
                100% {
                    box-shadow: inset 0px 0px 0px 25px #7ac142;
                }
            }
        }
        margin-left: 50px;
        margin-top: 20px;
        .paper-edit-content{
            .avatar-uploader .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .avatar-uploader .el-upload:hover {
                border-color: #409EFF;
            }
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }
        }
        .success-wrap{
            width:500px;
            height: 500px;
            background-color: #00ffff;
            margin-left: 20%;
            margin-top: 20px;
            margin-bottom: 50px;
            overflow: hidden;
        }
    }
</style>