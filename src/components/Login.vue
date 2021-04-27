<template>
  <div id="login">
    <!--    <div class="img">-->
    <!--      <img src="/static/superlogin.jpg" alt="">-->
    <!--    </div>-->
    <div class="container">
      <h2>课程考核管理系统登录</h2>
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
        <el-select v-model="value" placeholder="请选择" clearable>
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
        <el-input @keyup.enter.native="login" placeholder="请输入验证码" type="text" v-model="verify"></el-input>
        <div class="svg" v-html="verifysvg" @click="getVerify"></div>
      </div>
      <div class="helper">
        <a href="#">忘记密码？</a>
        <!-- <a href="#">注册</a> -->
        <router-link to="/register">注册</router-link>
      </div>
      <div class="button">
        <el-button type="success" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  #login {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("../../static/superlogin.jpg");

    // overflow: hidden;
    /*.img {*/
    /*  width: 100%;*/
    /*  height: 100%;*/
    /*  overflow: hidden;*/

    /*  img {*/
    /*    width: 100%;*/
    /*  }*/
    /*}*/

    .container {
      // color: #ffffff;
      width: 23%;
      min-width: 354px;
      height: 400px;
      position: absolute;
      left: 33%;
      top: 130px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 30px;
      padding: 30px 80px;

      h2 {
        text-align: center;
      }

      .username, .password, .select {
        display: flex;
        margin: 20px 0;

        label {
          width: 70px;
          line-height: 35px
        }

        input {
          width: 300px;
          border-radius: 10px;
        }
      }

      .verify {
        display: flex;
        margin: 20px 0;

        label {
          width: 130px;
          line-height: 35px
        }

        input {
          width: 150px;
          border-radius: 10px;
        }

        .svg {
          cursor: pointer;
        }
      }

      button {
        width: 100%;
      }

      .helper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
    }
  }

</style>
<script>
  export default {
    data() {
      return {
        identity: [/*'超级管理员',*/'教师', '学生'],
        value: '',
        username: '',
        password: '',
        verify: '',
        verifysvg: ''
      }
    },
    methods: {
      getVerify() {
        this.$http.get('/api/global/verifysvg').then(res => {
          this.verifysvg = res.data
        }, err => {
          console.log(err)
        })
      },
      //获取配置中的所有分类，放到store中
      // getClasses(){
      //     this.$http.get('/api/global/getclass').then(res=>{
      //         this.$store.commit('setClasses',res.data.data)
      //     },err=>{
      //         this.$message({type:'error',message:'获取分类失败，请刷新'})
      //     })
      // },
      login() {
        var loginUrl, user;
        if (this.value == '超级管理员') {
          loginUrl = '/api/super/login';
          user = 'super'
        } else if (this.value == '教师') {
          loginUrl = '/api/teacher/login';
          user = 'teacher'
        } else if (this.value == '学生') {
          loginUrl = '/api/student/login';
          user = 'student'
        } else {
          this.$message('请选择登录角色')
        }
        if (this.username == '' || this.password == '' || this.verify == '' || this.value == '') {
          this.$message('请将内容填写完整')
        } else {
          this.$http.post(loginUrl, {
            username: this.username,
            password: this.password,
            verify: this.verify
          }).then(res => {
            if (res.data.status == 1) {
              localStorage.setItem('token', res.data.token)
              // this.$store.commit('setIdentity',user)
              this.$message({message: '登录成功', type: 'success'})
              this.$router.push('/manage/' + user + '/center')
            } else {
              this.$message({message: res.data.msg, type: 'error'})
            }

            // console.log(this.$store)
          }, err => {
            this.$message({message: '登录失败', type: 'error'})
          })
        }
        this.getVerify()
        // this.getClasses()
      }
    },
    created() {
      // console.log(this)
      this.getVerify()
    }
  }
</script>
