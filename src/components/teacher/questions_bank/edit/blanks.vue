<template>
    <div id="single_election">

        <h3>试题</h3>
        <quill-editor 
        v-model="postData.question" 
        ref="myQuillEditor" 
        :options="editorOption" >
        </quill-editor>

        <el-alert
            title="如果您的一个空可以有多个正确答案, 正确答案请用竖线 | 分开，例如：大象|象"
            type="warning" style="margin-top:10px;">
        </el-alert>

        <el-alert
            title="如果您的题含有不止一个空，您可以点击下面的按钮增加更多的空"
            type="warning" style="margin-top:10px;">
        </el-alert>
 

        <h3>正确答案</h3>
        <div class="options" v-for="(item,index) in answer_num" :key="index">
            <h3>({{answer_label[index]}})</h3>
            <el-input v-model="postData.right_answer[index]"></el-input>
            <!-- <quill-editor 
            v-model="postData.right_answer[index]"
            ref="myQuillEditor" 
            :options="editorOption" >
            </quill-editor> -->
        </div>
        <div class="option_button">
            <el-button type="primary" plain @click="addAnswer">添加选项<i class="el-icon-check"></i></el-button>
            <el-button type="info" plain @click="delAnswer">删除选项<i class="el-icon-close"></i></el-button>
        </div>


        <h3>题目解析</h3>
        <quill-editor 
        v-model="postData.analysis" 
        ref="myQuillEditor" 
        :options="editorOption" >
        </quill-editor>
        <div class="classes_score">
            <h3>分类</h3>
            <el-select v-model="postData.classes" placeholder="请选择">
                <el-option
                v-for="(item,index) in cla"
                :key="index"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
            <h3>分数</h3>
            <el-input-number v-model="postData.default_score" :min="1" :max="100"></el-input-number>
        </div>
        
        <div class="label">
            <div class="tag">
            <p>试题标签:</p>
                <el-tag v-for="(item,index) in postData.label" :key="index" closable 
                @close="delTag(index)">{{item}}</el-tag>
            </div>
            <div class="addtag">
                <el-input v-model="add_label" @keyup.enter.native="addLabel"></el-input>
                <el-button @click="addLabel">添加标签</el-button>
            </div>
        </div>
        <hr>
        <el-button type="success" style="margin-bottom:30px" @click="save">
            <span v-if="!isAlert">保存</span>
            <span v-if="isAlert">修改</span>
        </el-button>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
export default {
    data(){
        return {
            cla:[],
            add_label:'',
            // label_color:['','danger','success','info','warning'],
            answer_num:1,
            answer_label:['A','B','C','D','E','F','G','H','I','J','K','L','M'],

            postData:{
                question:'',
                
                // answer_options:[],
                right_answer:[],
                analysis:'',
                label:[],
                classes:'',
                default_score:1
            },

            editorOption:{
                modules:{
                    toolbar:[
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block','image']
                    ]
                }
            }
        }
    },
    props: ['row','isAlert'],
    methods:{
        addAnswer(){
            if(this.answer_num>=13){
                this.$message({
                    type:'error',message:'答案数量最大为16'
                })
                return
            }
            this.answer_num++;
        },
        delAnswer(){
            if(this.answer_num<=1){
                this.$message({
                    type:'error',message:'答案数量最小为1'
                })
                return
            }
            this.answer_num--;
        },
        addLabel(){
            this.postData.label.push(this.add_label)
            this.add_label=''
        },
        delTag(index){
            this.postData.label.splice(index,1)
        },
        save(){
            // console.log(this.postData)
            if(this.postData.question==''||this.postData.classes==''){
                this.$message({type:'error',message:'请填写完整'})
                return
            }
            this.postData.publisher=this.$store.state.userdata.username
            this.postData.type="填空题"
            this.postData.token=localStorage.getItem("token")
            let posturl = '/api/questions/add'
            if(this.isAlert)posturl='/api/questions/update'
            this.$http.post(posturl,this.postData).then(res=>{
                if(this.isAlert){
                    this.$message({type:'success',message:"试题修改成功"})
                }else{
                    this.$message({type:'success',message:"试题添加成功"})
                }
                this.$router.push('/manage/teacher/questions/list')
            },err=>{
                if(this.isAlert){
                    this.$message({type:'success',message:"试题修改失败"})
                }else{
                    this.$message({type:'success',message:"试题添加失败"})
                }
            })
        }
    },
    created(){
        if(this.isAlert){
            this.postData = this.row
        }
        this.$http.get(`/api/teacher/getcla?user=${this.$store.state.userdata.username}`).then(res=>{
            this.cla=res.data.classes
        },err=>{
            this.$message({type:'error',message:'获取分类失败，请刷新'})
        })
    }
}
</script>
<style lang="scss">
    #single_election{
        .option_button{
            display: flex;
            button{
                margin: 10px;
            }

        }
        .classes_score{
            display: flex;
            margin: 20px 0;
            h3{
                line-height: 5px;
                // margin-right: 5px;
                margin-left: 10px;
                min-width: 60px;
            }
            input:nth-child(0){
                width: 200px;
                display: block;
            }

        }
        .label{
            .tag{
                display: flex;
                flex-wrap: wrap;
                span{
                    margin: 5px 10px;
                }
                margin-bottom: 10px;
                p{
                    line-height: 5px;
                }
            }
            .addtag{
                display: flex;
                width: 500px;
                // input{
                //     margin: 5px 5px;
                // }
            }
        }
    }
</style>