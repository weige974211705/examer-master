<template>
    <div id="register">
        <div class="img">
            <img src="/static/superlogin.jpg" alt="">
        </div>
        <div class="container">
            <h2>在线考试系统用户注册</h2>
            <div class="username">
                <label>用户名:</label>
                <el-input v-model="username" placeholder="请输入用户名"></el-input>
            </div>
            <div class="password">
                <label>密码:</label>
                <el-input v-model="password" placeholder="请输入密码" type="password"></el-input>
            </div>
            <div class="select">
                <label>身份:</label>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in identity"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="verify">
                <label>验证码:</label>
                <el-input placeholder="请输入验证码" type="text" v-model="verify"></el-input>
                <div class="svg" v-html="verifysvg" @click="getVerify"></div>
            </div>
            <div class="helper">
                <!-- <a href="#">忘记密码？</a> -->
                <!-- <a href="#">登录</a> -->
                <router-link to="/login">已有用户，登录</router-link>
            </div>
            <div class="button">
                <el-button type="success" @click="register">完成注册</el-button>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    #register{
        position: relative;
        width:100%;
        height: 100%;
        // overflow: hidden;
        .img{
            width: 100%;
            height: 100%;
            overflow: hidden;
            img{
                width: 100%;
            }
        }
        .container{
            // color: #ffffff;
            width: 23%;
            min-width: 354px;
            height: 400px;
            position: absolute;
            left: 33%;
            top:130px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
            padding: 30px 80px;
            h2{
                text-align: center;
            }
            .username,.password,.select{
                display: flex;
                margin: 20px 0;
                label{width: 70px;line-height: 35px}
                input{
                    width: 300px;
                    border-radius:10px;
                }
            }
            .verify{
                display: flex;
                margin: 20px 0;
                label{width: 130px;line-height: 35px}
                input{
                    width: 150px;
                    border-radius:10px;
                }
                .svg{
                    cursor: pointer;
                }
            }
            button{
                width: 100%;
            }
            .helper{
                width: 100%;
                // display:flex;
                // justify-content: space-between;
                margin-bottom: 5px;
                // flex-direction: row-reverse;
            }
        }
    }

</style>
<script>
export default {
    data(){
        return {
            identity:['教师','学生'],
            value:'',
            username:'',
            password:'',
            verify:'',
            verifysvg:''
        }
    },
    methods:{
        getVerify(){
            this.$http.get('/api/global/verifysvg').then(res=>{
                this.verifysvg=res.data
            },err=>{
                console.log(err)
            })
        },
        register(){
            var registerUrl,user;
            if(this.value=='教师'){registerUrl='/api/teacher/register';user='teacher'}
            else if(this.value=='学生'){registerUrl='/api/student/register';user='student'}
            else{this.$message('请选择注册角色')}
            if(this.username==''||this.password==''||this.verify==''||this.value==''){this.$message('请将内容填写完整')}else{
                this.$http.post(registerUrl,{username:this.username,password:this.password,verify:this.verify}).then(res=>{
                    if(res.data.status==1){
                        this.$message({type:'success',message:'注册成功'})
                        this.$router.push('/login')
                    }else{
                        this.$message({type:'error',message:res.data.msg})
                    }
                },err=>{
                    this.$message({type:'error',message:'注册失败'})
                })
            }
            this.getVerify();
        }
    },
    created () {
        this.getVerify();
    }
}
</script>
