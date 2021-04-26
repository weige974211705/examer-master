<template>
    <div id="exam-complete">
        <div class="wrap">
            <div class="svg">
                <svg width="200" height="200" class="done" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="circle" cx="26" cy="26" r="25" fill="none" />
                    <path class="check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
            </div>
            <h2>答题已结束，感谢您的参与！</h2>
            <span v-if="examCompleteInfo.haveEassay">试卷中包含问答题，需要等待教师批改试卷！</span>
            <span v-if="!examCompleteInfo.haveEassay">您的分数是 {{examCompleteInfo.score}} 分！{{examCompleteInfo.ispass?'及格':'不及格'}}！</span>
            <h3>考试者：huangnan</h3>
            <router-link :to="'/analysis/'+this.$route.params.id">
                <el-button>查看考试解析</el-button>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            examCompleteInfo: {},
        }
    },
    created() {
        this.getCompleteInfo();
    },
    methods: {
        getCompleteInfo() {
            this.$http.post('/api/exam/getexamlistbyid', {
                token: localStorage.getItem('token'),
                id: this.$route.params.id,
            }).then(res=> {
                this.examCompleteInfo = res.data.data;
            })
        },
    },
}
</script>
<style lang="scss" scoped>
    #exam-complete{
        .wrap{
            display:flex;
            flex-direction: column;
            align-items: center;
            .svg{
                width: 200px;
                height: 200px;
                margin-left: auto;
                margin-right: auto;
                margin-top: 50px;
                .done {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 2;
                    stroke: #fff;
                    stroke-miterlimit: 10;
                    margin: 20px auto;
                    box-shadow: inset 0px 0px 0px #7ac142;
                    animation: fill-green 0.5s ease-in-out 0.5s forwards, scale 0.3s ease-in-out 0.7s both;
                }
                .done .circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 2;
                    stroke-miterlimit: 10;
                    stroke: #7ac142;
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .done .check {
                    transform-origin: 50% 50%;
                    stroke: #7ac142;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.7s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }
                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes scale {
                    0%, 100% {
                        transform: none;
                    }
                    50% {
                        transform: scale3d(1.2, 1.2, 1);
                    }
                    80% {
                        transform: scale3d(0.8, 0.8, 1);
                    }
                }
                @keyframes fill-green {
                    100% {
                        box-shadow: inset 0px 0px 0px 25px #7ac142;
                    }
                }
            }
        }
    }    
</style>