<template>
  <el-transfer v-model="value" :data="data" :titles="['未选试题', '已选试题']"></el-transfer>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        value: [],
        resdata: [],
      };
    },
    created(){
        const _this = this;
        this.$http.get(`/api/questions/getlist?token=${localStorage.getItem('token')}`).then(res =>{
            console.log(res.data);
            this.resdata = res.data.data
            res.data.data.forEach(e => {
                _this.data.push({key:e._id, label:e.question,disabled:false})
                _this.score += e.default_score
                // debugger;
            });
            
        }).catch(err=>{
            console.log(err);
        })
    },
    computed: {
      score() {
        let s = 0;
        this.value.forEach((item) => {
          this.resdata.forEach((e)=>{
            if (e._id === item) {
              s += e.default_score;
            }
          });
        });
        return s;
      }
    },
    updated(){
        console.log(this.value);
        this.$emit('getUseList',this.value, this.score);
    }
  };
</script>

<style lang="scss">
    .el-transfer-panel{
        width:330px;
    }
</style>