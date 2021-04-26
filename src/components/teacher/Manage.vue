<template>
    <div id="teacher-manage">
        <div class="header" :style="'background-color:' + this.$store.state.config.theme">
            <div class="title">
                <h1>在线考试系统</h1>
            </div>
            <div class="info">
                <div class="img">
                    <img :src="'/api'+this.$store.state.userdata.headPortrait" alt="touxiang">
                </div>
                <el-dropdown @command="logout">
                    <span class="el-dropdown">
                        {{this.$store.state.userdata.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="wrapper">
            <div class="menu" :style="'background-color:' + this.$store.state.config.theme">
                <el-menu
                :style="collapse?'':'width:160px;'"
                :collapse="collapse"
                default-active="1"
                class="el-menu"
                background-color="#154c6b"
                text-color="white"
                active-text-color="#ffd04b"
                @open="handleOpen"
                @close="handleClose">
                    <router-link to="/manage/teacher/center">
                        <el-menu-item index="1">
                            <i class="el-icon-menu"></i>
                            <span slot="title">控制中心</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/manage/teacher/paper/index">
                        <el-menu-item index="2">
                            <i class="el-icon-document"></i>
                            <span slot="title">试卷管理</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/manage/teacher/questions/list">
                        <el-menu-item index="3">
                                <i class="el-icon-sold-out"></i>
                                <span slot="title">题库管理</span>
                        </el-menu-item>
                    </router-link>
<!--                    <router-link to="/manage/teacher/chat">-->
<!--                        <el-menu-item index="4">-->
<!--                            <i class="el-icon-service"></i>-->
<!--                            <span slot="title">在线交流</span>-->
<!--                        </el-menu-item>-->
<!--                    </router-link>-->
                    <router-link to="/manage/teacher/record">
                        <el-menu-item index="5">
                            <i class="el-icon-mobile-phone"></i>
                            <span slot="title">统计分析</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/manage/teacher/usermanager">
                        <el-menu-item index="7">
                            <i class="el-icon-setting"></i>
                            <span slot="title">账号管理</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/manage/teacher/help">
                        <el-menu-item index="8">
                            <i class="el-icon-question"></i>
                            <span slot="title">遇到问题</span>
                        </el-menu-item>
                    </router-link>
                </el-menu>
            </div>
            <div class="content">
                <div style="min-height:700px;">
                    <transition name="teacher-content">
                        <router-view></router-view>
                    </transition>
                </div>
<!--                <div class="footer">-->
<!--                    <p>{{this.$store.state.config.desc}}</p>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    #teacher-manage{
        .header{
            position: fixed;
            display: flex;
            justify-content: space-between;
            border:1px solid #154c6b;
            width: 100%;
            z-index: 999;
            height: 50px;
            background-color: #154c6b;
            color:white;
            .title h1{
                margin: 0;
                padding: 0;
                font-size: 28px;
                line-height: 50px;
                margin-left: 30px;
            }
            .info{
                display: flex;
                .img{
                    margin-top: 3px;
                    height: 40px;
                    width: 40px;
                    overflow: hidden;
                    border-radius: 50%;
                    img{
                        height: 100%;
                    }
                }
                .el-dropdown{
                    color: white;
                    margin: 0 10px;
                    line-height: 50px;
                    cursor: pointer;
                }

            }
        }
        .wrapper{
            display:flex;
            height: 703px;
            .menu{
                position:fixed;
                top:50px;
                height: 100%;
                background-color: #0f527c;
                .el-menu{
                    // width: 100%;
                    overflow: hidden;
                    color: white;
                    height: 100%;
                }
            }
            .content{
                // background-color: #004080;
                margin-top: 55px;
                margin-left: 10%;
                flex-grow: 1;
                position: relative;
                .footer{
                    position: relative;
                    width: 100%;
                    height: 50px;
                    border-top: 1px solid #c0c0c0;
                    text-align: center;
                    background-color: #c0c0c0;
                    z-index: -1;
                }
                .teacher-content-enter{// 组件显示前的状态
                    opacity: 0;
                    margin-top: 100px;
                }
                .teacher-content-enter-active{// 组件显示时的状态
                    transition: all 0.3s linear;
                }
                // .super-content-leave-active{// 组件消失时候的状态
                //     transition: all 0.3s linear;
                //     opacity: 0;
                // }
                // .super-content-leave{

                // }
            }
        }


    }
</style>
<script>
 export default {
    data(){
         return {
             collapse: false,
             timer:0,
         }
     },
     mounted(){
         this.timer = setInterval(()=>{this.getWidth()},300);
     },
     destroyed(){
         clearInterval(this.timer);
     },
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.$router.push('/login');
        },
        getWidth(){
            const width = document.body.clientWidth;
            if (width<1000){
                this.collapse = true;
            }else {
                this.collapse = false;
            }
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        }
    }
  }
</script>
