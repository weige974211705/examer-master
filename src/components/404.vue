<template>
    <div id="notfound">
        <div class="img">
            <img src="/static/notfound.png" alt="notfound" width="500px">
        </div>
        <div class="text">
            <h1>404</h1>
            <h2>抱歉，你访问的页面不存在</h2>
            <el-button @click="retohome">返回首页</el-button>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        retohome(){
            this.$router.push('/')
        }
    }
}
</script>
<style lang="scss">
    #notfound{
        width: 100%;
        height: 100%;
        background-color: #58b9f0;
        color: white;
        display: flex;
        .img{
            margin-top:150px;
            margin-left: 200px;
        }
        .text{
            h1{
                font-size: 150px;
                line-height: 10px;
                padding: 0;
            }
            button{
                margin-top: 20px;
            }
            margin-top:150px;
            margin-left: 150px;
            text-align: center;
        }
    }
</style>