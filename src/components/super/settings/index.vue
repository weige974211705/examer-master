<template>
    <div id="super-manager">
        <div class="setting">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="系统配置" name="first">
                    <div class="row">
                        <span>头像设置</span>
                        <el-upload
                        class="avatar-uploader"
                        action="/api/upload/img"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="configObj.headPortrait" :src="'/api'+configObj.headPortrait" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <p style="color:gray;font-size:13px;margin-left:10px;">上传并修改头像</p>
                    </div>
                    <div class="row">
                        <span>用户名</span>
                        <el-input v-model="configObj.username"></el-input>
                    </div>
                    <div class="row">
                        <span>邮箱</span>
                        <el-input placeholder="请输入邮箱地址" v-model="configObj.email"></el-input>
                    </div>
                    <div class="row">
                        <span>电话号码</span>
                        <el-input placeholder="请输入电话号码" v-model="configObj.phone" maxlength="11"></el-input>
                    </div>
                    <div class="row">
                        <span>主题设置</span>
                        <el-color-picker v-model="configObj.theme"></el-color-picker>
                    </div>
                    <div class="row">
                        <span>底部信息</span>
                        <el-input v-model="configObj.desc"></el-input>
                    </div>
                    <div class="row">
                        <span>广告代码</span>
                        <el-input
                            style="width:400px"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="configObj.ad">
                        </el-input>
                    </div>
                    <div class="row">
                        <span>友情链接</span>
                        <div style="flex-direction: column;">
                            <div class="in-friend" style="margin-bottom: 5px;" v-for="(item, index) in configObj.friend_chain" :key="index">
                                <el-input placeholder="名称" v-model="configObj.friend_chain[index].label"></el-input>
                                <el-input placeholder="链接" v-model="configObj.friend_chain[index].href"></el-input>
                                <el-button type="error" @click="delFriend(index)" v-if="index < configObj.friend_chain.length -1">删除</el-button>
                                <el-button type="primary" @click="addFriend" v-if="index === configObj.friend_chain.length -1">添加</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <span>公告</span>
                        <div style="flex-direction: column;">
                            <div class="in-friend" style="margin-bottom: 5px;" v-for="(item, index) in configObj.announcement" :key="index">
                                <el-input placeholder="请输入" v-model="configObj.announcement[index]"></el-input>
                                <el-button type="error" @click="delAnn(index)" v-if="index < configObj.announcement.length -1">删除</el-button>
                                <el-button type="primary" @click="addAnn" v-if="index === configObj.announcement.length -1">添加</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="btn">
                            <el-button type="success" @click="post">提交</el-button>
                            <el-button type="info" @click="init">重置</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="管理员密码修改" name="second">
                    <el-form label-width="80px">
                        <div style="width:30%;">
                            <el-form-item label="原密码">
                                <el-input v-model="passObj.oldPass" show-password></el-input>
                            </el-form-item>
                            <el-form-item label="新密码">
                                <el-input v-model="passObj.newPass" show-password></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码">
                                <el-input v-model="passObj.confirmPass" show-password></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="changePass">修改密码</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
export default {
    data() {
      return {
          passObj:{
              oldPass: '',
              newPass: '',
              confirmPass: '',
          },
          configObj: {
              headPortrait: '',
              title: '',
              desc: '',
              username:'',
              email: '',
              phone: '',
              theme: '', //主题
              ad:'',
              friend_chain:[
                  {label:'',href:''}
              ],
              announcement: [],
          },
          activeName: 'first',
      };
    },
    created(){
        this.init();
    },
    methods: {
        delFriend(index) {
            this.configObj.friend_chain.splice(index, 1);
        },
        addFriend() {
            this.configObj.friend_chain.push({
                label: '',
                href: '',
            });
        },
        delAnn(index) {
            this.configObj.announcement.splice(index, 1);
        },
        addAnn() {
            this.configObj.announcement.push('');
        },
        changePass() {
            if(this.passObj.newPass !== this.passObj.confirmPass) {
                this.$message({type:'error',message:'确认密码失败'});
                return;
            }
            this.$http.post('/api/super/changepassword',{
                token: localStorage.getItem('token'),
                oldPass: this.passObj.oldPass,
                newPass: this.passObj.newPass,
                }).then(res=>{
                if(res.data.status === 1){
                    this.$message({type:'success',message:res.data.msg});
                }else{
                    this.$message({type:'error',message:res.data.msg});
                }
            })
        },
        check(){
            const emailRex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            const phoneRex = /^[0-9]{11}$/;
            if (this.configObj.email.search(emailRex) >= 0 && this.configObj.phone.search(phoneRex) >= 0){
                return true;
            } else {
                this.$message('邮箱或电话格式错误')
                return false;
            }
        },
        getallconfig() {
            this.$http.get('/api/super/allgetconfig').then(res=>{
                this.$store.commit('setConfig', res.data.data)
            })
        },
        getConfig() {
            this.$http.post('/api/super/getconfig',{
                token:localStorage.getItem('token'),
            }).then(res=>{
                if(res.data.status === 1){
                    this.configObj = res.data.data;
                    this.configObj.email = res.data.data.email;
                }else{
                    this.$message({type:'error',message:res.data.msg});
                }
            })
        },
        post(){
            if (!this.check()) return;
            this.$http.post('/api/super/updateoption',{
                token: localStorage.getItem('token'),
                config: this.configObj,
                }).then(res=>{
                if(res.data.status === 1){
                    this.$message({type:'success',message:res.data.msg});
                    this.getallconfig();
                }else{
                    this.$message({type:'error',message:res.data.msg});
                }
            })
        },
        init(){
            this.getConfig();
        },
        handleAvatarSuccess(res, file) {
            this.configObj.headPortrait = res.filepath;
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
    #super-manager{
        margin-left: 30px;
        margin-top: 20px;
        .setting{
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
                .theme-1{
                    width: 20px;
                    height: 20px;
                    background-color: #0080c0;
                    margin-right: 20px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .theme-2{
                    width: 20px;
                    height: 20px;
                    background-color: #ff8040;
                    border-radius: 5px;
                    cursor: pointer;
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