<template>
    <div id="center">
        <h1>考生控制中心</h1>
        <div class="center-content">
            <router-link to="/manage/student/startexam">
                <div class="start-exam">
                    <img src="@/assets/svg/exam.svg" width="70" height="70">
                </div>
            </router-link>
            <router-link to="/manage/student/record">
                <div class="exam-record">
                    <img src="@/assets/svg/record.svg" width="70" height="70">
                </div>
            </router-link>
            <router-link to="/manage/student/wrong">
                <div class="error-exam">
                    <img src="@/assets/svg/book.svg" width="70" height="70">
                </div>
            </router-link>
        </div>
        <div class="text">

            <p>开始做题</p>
            <p>考试记录</p>
            <p>错题练习</p>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    #center{
        margin-top: 100px;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        h1{
            text-align: center;
            margin-top:30px;
        }
        .center-content{
            display: flex;
            justify-content: center;
            margin-top: 50px;
            .start-exam{
                width: 130px;
                height: 130px;
                background-color: #00b8ef;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 20px;
                border:10px solid #ffffff;
            }
            .start-exam:hover, .exam-record:hover, .error-exam:hover{
                border:10px solid rgb(190, 177, 177);
            }
            .exam-record{
                width: 130px;
                height: 130px;
                background-color: #4dd5b5;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 20px;
                border:10px solid #ffffff;
            }
            .error-exam{
                width: 130px;
                height: 130px;
                background-color: #f9c83d;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 20px;
                border:10px solid #ffffff;
            }
        }
        .text{
            display:flex;
            justify-content: center;
            p{
                margin:0 60px;
            }
        }  
    }
</style>