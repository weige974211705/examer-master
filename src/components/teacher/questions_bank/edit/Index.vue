<template>
    <div id="questions_edit">
        <div class="edit_wrapper">
            <div class="post-header"><h3><i class="el-icon-circle-plus"></i>新增试题</h3></div>
            <div class="content">
                <el-tabs v-model="activeName"  class="tab">
                    <el-tab-pane label="单选题" name="first"><single></single></el-tab-pane>
                    <el-tab-pane label="多选题" name="second"><multiple></multiple></el-tab-pane>
                    <el-tab-pane label="判断题" name="third"><judge></judge></el-tab-pane>
                    <el-tab-pane label="填空题" name="fourth"><blanks></blanks></el-tab-pane>
                    <el-tab-pane label="问答题" name="five"><essay></essay></el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import single from './Single_selection'
import multiple from './Multiple_selection'
import judge from './judge_selection'
import blanks from './blanks'
import essay from './essay'
export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    components:{single,multiple,judge,blanks,essay},
    // methods: {
    //   handleClick(tab, event) {
    //     console.log(tab, event);
    //   }
    // }
}
</script>
<style lang="scss" >
    #questions_edit{
        .edit_wrapper{
            width: 70%;
            margin:30px 60px;
            min-height: 600px;
            border:1px solid #0080c0;
            .post-header{
                color: rgb(247, 245, 245);
                // height:50px;
                border:1px solid #154c6b;
                background-color: #0080c0;
                h3{
                    line-height: 100%;
                    margin-left: 10px;
                    i{margin-right: 3px;}
                }
            }
            .content{
                width: 90%;
                margin: 3px auto;
            }
            
        }
    }
</style>