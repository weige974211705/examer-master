<template>
    <div id="exam_paper">
        <!-- this is questions_bank -->
        <transition name="edit">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss">
    #questions_bank{
        .edit-enter{// 组件显示前的状态
            opacity: 0;
            // margin-top: 100px;
            margin-left: 100px;
        }
        .edit-enter-active{// 组件显示时的状态
            transition: all 0.3s linear;
        }
    }
</style>