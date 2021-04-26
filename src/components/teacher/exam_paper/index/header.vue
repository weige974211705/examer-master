<template>
    <div id="questions_list_header">
        <div class="questions_num">
            <h2><i class="el-icon-document"></i>试卷份数({{paperNum}})</h2>
        </div>
        <div class="used_questions">
            <h2><i class="el-icon-edit-outline"></i>考试次数({{usedNum}})</h2>
        </div>
        <div class="classes">
            <h2><i class="el-icon-menu"></i>分类({{classesNum}})</h2>
        </div>
    </div>
</template>
<style lang="scss">
    #questions_list_header{
        width: 95%;
        margin: 20px 5%;
        height: 100px;
        display:flex;
        text-align: center;
        h2{
            margin-top: 35px;
            i{
                margin-right: 5px;
            }
        }
        .questions_num{
            margin-left: 5px;
            margin-right: 5px;
            width: 30%;
            height: 100%;
            background-color:#63b5ef;
            border-radius: 5px;
        }
        .used_questions{
            margin-left: 5px;
            margin-right: 5px;
            width: 30%;
            height: 100%;
            background-color:#92cb7b;
            border-radius: 5px;
        }
        .classes{
            margin-left: 5px;
            margin-right: 5px;
            width: 30%;
            height: 100%;
            background-color:#efd07c;
            border-radius: 5px;
        }
    }
</style>
<script>
export default {
    props: ['paperNum', 'usedNum', 'classesNum']
}
</script>