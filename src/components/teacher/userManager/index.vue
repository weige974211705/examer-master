<template>
    <div id="user-manager">
        <div class="setting">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本配置" name="first">
                    <el-form class="form" ref="form" :model="form1" label-width="80px">
                        <el-form-item label="头像设置">
                            <el-upload
                            class="avatar-uploader"
                            action="/api/upload/img"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="form1.headPortrait" :src="'/api'+form1.headPortrait" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <p style="color:gray;font-size:13px;margin-left:10px;">上传并修改头像</p>
                        </el-form-item>
                        <el-form-item label="用户名">
                            <el-input :disabled="true" v-model="form1.username"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名">
                            <el-input  v-model="form1.realName"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input placeholder="请输入邮箱地址" v-model="form1.email"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码">
                            <el-input placeholder="请输入电话号码" v-model="form1.phone"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="changeBaseInfo">提交</el-button>
<!--                            <el-button @click="init">重置</el-button>-->
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="修改密码" name="second">
                    <el-form class="form" ref="form" :model="form2" label-width="80px">
                        <el-form-item label="原密码">
                            <el-input v-model="form2.oldPass" placeholder="请填写原密码" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码">
                            <el-input v-model="form2.newPass" placeholder="请填写新密码" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码">
                            <el-input v-model="form2.confirmPass" placeholder="请确认密码" show-password></el-input>
                        </el-form-item>
                         <el-form-item>
                            <el-button type="primary" @click="changePassword">确认修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>

            <!-- <div class="row">
                <span>密码</span>
                <el-input placeholder="如需修改密码请输入" show-password v-model="password" @input="()=>{setPass = true;}"></el-input>
                <p style="color:gray;font-size:13px;margin-left:10px;">如需修改请输入</p>
            </div>
            <div class="row" v-if="setPass">
                <span>确认密码</span>
                <el-input placeholder="请重复密码" show-password v-model="setpassword"></el-input>
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
    data() {
      return {
          activeName: 'first',
          form1: {
              headPortrait: '',
              realName: '',
              username: '',
              email: '',
              phone: '',
              token: localStorage.getItem('token')
          },
          form2:{
              oldPass: '',
              newPass: '',
              confirmPass: '',
              token: localStorage.getItem('token')
          },
      };
    },
    created(){
        this.init();
    },
    methods: {
        changePassword() {
            if (this.form2.oldPass=== '' || this.form2.newPass === '' || this.form2.confirmPass === '') {
                this.$message({type:'error', message:'请输入完整'});return;
            }
            if (this.form2.newPass !== this.form2.confirmPass){
                this.$message({type:'error', message:'确认密码失败'});return;
            }
            this.$http.post('/api/teacher/changepass',this.form2).then(res=>{
                if(res.data.status===0){
                    this.$message({type:'error', message:'修改密码失败'});
                } else {
                    this.$message({type:'success', message:'修改密码成功'});
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                }
            })
        },
        check(){
            const emailRex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            const phoneRex = /^[0-9]{11}$/;
            if (this.form1.email.search(emailRex) >= 0 && this.form1.phone.search(phoneRex) >= 0){
                return true;
            }else {
                this.$message('邮箱或电话号码格式错误')
                return false;
            }
        },
        changeBaseInfo(){
            if (!this.check()) return;
            this.$http.post('/api/teacher/update',this.form1).then(res=>{
                if(res.data.status === 1){
                    this.$message({type:'success',message:res.data.msg});
                }else{
                    this.$message({type:'error',message:res.data.msg});
                }
            })
        },
        init(){
            this.getUserInfo();
        },
        getUserInfo() {
            this.$http.get(`/api/teacher/getuser?token=${localStorage.getItem('token')}`).then(res=>{
                console.log(res.data);
                const data = res.data.data;
                if(res.data.status === 1) {
                    this.form1.username = data.username;
                    // this.password = data.password;
                    this.form1.email = data.email;
                    this.form1.phone = data.phone;
                    this.form1.headPortrait = data.headPortrait;
                    this.form1.realName = data.realName;
                }else{
                    this.$message(data.msg);
                }
            })
        },
        handleAvatarSuccess(res, file) {
            this.form1.headPortrait = res.filepath;
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
        }
    }
}
</script>
<style lang="scss" scoped>
    #user-manager{
        margin-left: 30px;
        margin-top: 20px;
        .setting{
            .form{
                width: 30%;
                margin-left:auto;
                margin-right: auto;
            }
            .row{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                span{
                    width: 300px;
                    text-align: right;
                    margin-right: 20px;
                }
                .el-input{
                    width: 360px;
                }
                .btn{
                    margin-left: 500px;
                    margin-top: 20px;
                }
            }
        }
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
</style>
