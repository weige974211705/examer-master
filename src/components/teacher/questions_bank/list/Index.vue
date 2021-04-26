<template>
    <div id="questions_list">
        <See v-if="seeShow" :row="seeData" @closeSee="seeShow=false"></See>
        <AlertEdit v-if="editShow" :row="seeData" @closeSee="editShow=false"></AlertEdit>
        <listheader :questionNum="tableData.length" :usedNum="usedNum" :classesNum="classeslist.length"></listheader>
        <div class="list-content">
            <div class="fenlei">
                <h2>试题分类列表</h2>
                <el-alert
                    title="下方可以添加分类"
                    type="info" style="margin-bottom:10px;">
                </el-alert>
                <div class="search" style="display:flex;">
                    <el-input v-model="addClass"></el-input>
                    <el-button @click="addCla"><i class="el-icon-zoom-in"></i></el-button>
                </div>
                <div class="fenlei-list">
                    <div class="loading" style="height:30px;" v-loading="classisok" v-if="classisok"></div>
                    <div class="lei">
                        <a href="#" @click="searchCla('')">
                            <i class="el-icon-tickets" style="margin-right:3px; margin-top:5px;margin-top:5px;"></i>
                            所有试题
                        </a>
                        <!-- <i class="el-icon-delete" style="float:right;margin-top:5px;cursor: pointer;" @click="delCla(item)"></i> -->
                    </div>
                    <div class="lei" v-for="(item,index) in classeslist" :key="index">
                        <a href="#" @click="searchCla(item)">
                            <i class="el-icon-tickets" style="margin-right:3px; margin-top:5px;margin-top:5px;"></i>
                            {{item}}
                        </a>
                        <i class="el-icon-delete" style="float:right;margin-top:5px;cursor: pointer;" @click="delCla(item)"></i>
                    </div>
                </div>
            </div>
            <div class="list">
                <div class="title">
                    <h2>题库列表</h2>
                    <el-button type="primary" style="height:40px;margin-top:15px;margin-left:10px;">
                        <router-link to="/manage/teacher/questions/edit">添加试题</router-link>
                    </el-button>
                    <el-button type="info" style="height:40px;margin-top:15px;margin-left:10px;" @click="delQues">批量删除</el-button>
                    <el-button type="success" style="height:40px;margin-top:15px;margin-left:10px;" @click="exportExcel">导出试题</el-button>
                    <div style="position:relative">
                        <el-button type="warning" style="height:40px;margin-top:15px;margin-left:10px;">导入试题</el-button>
                        <input class="import" type="file" @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                    </div>
                </div>
                <el-progress v-show="percentShow" :percentage="percent || 0"></el-progress>
                <el-table
                    @selection-change="selectChange"
                    :data="showTableData"
                    border
                    stripe
                    style="width: 100%">
                    <el-table-column type="selection">
                    </el-table-column>
                    <el-table-column
                    :show-overflow-tooltip="true"
                    prop="question"
                    label="问题"
                    width="280">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="类型">
                    </el-table-column>
                    <el-table-column
                    prop="classes"
                    label="分类"
                    ></el-table-column>
                    <!-- <el-table-column
                    prop="isopen"
                    label="是否公开"
                    ></el-table-column> -->
                    <el-table-column
                    prop="default_score"
                    label="分数"
                    ></el-table-column>
                    <el-table-column
                    prop="label"
                    label="标签"
                    ></el-table-column>
                    <!-- <el-table-column
                    prop="_id"
                    label="id"
                    width="230">
                    </el-table-column> -->
                    <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="see(scope.row)" type="text" size="small">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                <i class="el-icon-view"></i>
                            </el-tooltip>
                        </el-button>
                        <el-button @click="alertEdit(scope.row)" type="text" size="small">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit"></i>
                            </el-tooltip>
                        </el-button>
                        <el-button type="text" size="small" @click="delQue(scope.row)">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete"></i>
                            </el-tooltip>
                        </el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="showTableNum"
                layout="prev, pager, next, jumper"
                :total="getPageNum">
                </el-pagination>
            </div>
        </div>
    </div >
</template>
<script>
import listheader from './header.vue'
import See from './see'
import AlertEdit from './alertEdit'
import Export2Excel from '../../../../assets/excel/Export2Excel.js';
import Blob from '../../../../assets/excel/Blob.js';

export default {
    components:{listheader, See, AlertEdit},
    data(){
        return {
            usedNum: 0,
            editShow:false,
            seeShow:false,
            seeData:{},

            addClass:'',
            classeslist:[],
            classisok:true,
            tableData:[],

            showTableNum:6,//每页展示数量

            checkBoxData:[],

            currentPage:1,

            searchclass:'',
            excelData:[],
            postQues: [],
            quesPostNum: 0,
            percentShow: false,
        }
    },
    computed:{
        percent(){
            return Math.floor(this.quesPostNum/this.postQues.length *100) ;
        },
        showTableData(){
            let list = [];
            this.tableData.forEach(e=>{
                let obj = Object.assign({},e);
                Object.assign(obj, {
                    question: e.question.replace(/<[^>]+>/g,""),
                })
                list.push(obj);
            })
            if(this.searchclass==''){
                return list.slice((this.currentPage-1)*this.showTableNum,this.currentPage*this.showTableNum)
            }else{
                return list.filter(x=>{return x.classes==this.searchclass})
                .slice((this.currentPage-1)*this.showTableNum,this.currentPage*this.showTableNum)
            }
        },
        getPageNum(){
            return this.tableData.length;
        }
    },
    methods:{
        importf(obj) {
            this.quesPostNum = 0;
            this.percentShow = true;
        let _this = this;  
        this.file = event.currentTarget.files[0];  
        var rABS = false; //是否将文件读取为二进制字符串  
        var file = this.file; 

        FileReader.prototype.readAsBinaryString = function(f) {  
            var binary = "";  
            var rABS = false; //是否将文件读取为二进制字符串  
            var pt = this;  
            var workbook; //读取完成的数据  
            // var excelData;  
            var reader = new FileReader(); 
            reader.onprogress = function(e) { 
            let total = file.size;
            _this.progress = (e.loaded/total)*100;
            console.log( _this.progress);
            };   
            reader.onload = function(e) {
            try {
                var bytes = new Uint8Array(reader.result);  
                var length = bytes.byteLength;  
                for(var i = 0; i < length; i++) {  
                binary += String.fromCharCode(bytes[i]);  
                }  
                if(rABS) {  
                workbook = XLSX.read(btoa(fixdata(binary)), { //手动转化  
                    type: 'base64'  
                });  
                }else {  
                workbook = XLSX.read(binary, {  
                    type: 'binary'  
                });  
                } 
                // excelData = []; 
            } catch(e) {
                console.log('文件类型不正确');
                return;
            }
            var fromTo = '';
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                fromTo = workbook.Sheets[sheet]['!ref'];
                _this.excelData = _this.excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                }
            }
            // console.log(_this.excelData);
            _this.excelData.forEach(e=>{
                _this.postQues.push({
                    type: e['类型'],
                    question: e['问题'],
                    answer_options: e['选项'].split(','),
                    right_answer: e['正确答案'].split(','),
                    analysis: e['题目解析'],
                    classes: e['分类'],
                    default_score: parseInt(e['分数']),
                    label: e['标签'].split(','),
                    publisher: e['发布者'],
                })
            });
            _this.postQues.forEach(e=>{
                _this.$http.post('/api/questions/import',{
                    token:localStorage.getItem('token'),
                    ques: e,
                }).then(res=>{
                    _this.quesPostNum ++;
                    if (_this.quesPostNum >= _this.postQues.length) {
                        _this.percentShow = false;
                        _this.init();
                    }
                })
            })
            console.log(_this.postQues);
            };
            reader.readAsArrayBuffer(f);  
        }
            var reader = new FileReader();
            if(rABS) {  
                reader.readAsArrayBuffer(file);  
            }else {  
                reader.readAsBinaryString(file);  
            }
        },
        exportExcel() {
            require.ensure([], () => {
                const { export_json_to_excel } = require('../../../../assets/excel/Export2Excel.js');
                const tHeader = ['类型', '问题', '选项', '正确答案', '题目解析', '分类', '分数', '标签', '发布者'];
                // 上面设置Excel的表格第一行的标题
                const filterVal = ['type', 'question', 'answer_options', 'right_answer', 'analysis', 'classes', 'default_score', 'label', 'publisher'];
                // 上面的index、nickName、name是tableData里对象的属性
                const list = this.tableData;  //把data里的tableData存到list
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '列表excel');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        getQuestionsUsedNum() {
            this.$http.post('/api/teacher/getquestionsusednum',{token:localStorage.getItem('token')}).then(res=>{
                if(res.data.status===0) {
                    this.$message({type:'error',message:res.data.msg})
                }else {
                    this.usedNum = res.data.data
                }
            })
        },
        alertEdit(row){
            this.seeData = row;
            this.editShow = true;
        },
        see(row){
            this.seeData = row;
            this.seeShow = true;
        },
        addCla(){
            this.$confirm('确认添加这个分类吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(()=>{
                for(var i=0;i<this.classeslist.length;i++){
                    if(this.addClass==this.classeslist[i]){
                        this.$message({type:'error',message:'分类已存在'})
                        return;
                    }
                }
                this.$http.post('/api/teacher/addcla',{token:localStorage.getItem('token'),cla:this.addClass}).then(res=>{
                    if(res.data.status==1){
                        this.$message({type:'success',message:'添加成功'})
                        this.getcla()
                    }else{
                        this.$message({type:'error',message:'添加失败'})
                    }
                })
            }
            ).catch(()=>{
                this.$message({type:'error',message:'取消添加'})
            })
        },
        delCla(cla){
            this.$confirm('确认删除这个分类吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(()=>{
                this.$http.post('/api/teacher/delcla',{token:localStorage.getItem('token'),cla}).then(res=>{
                    if(res.data.status==1){
                        this.$message({type:'success',message:'删除成功'})
                        this.getcla()
                    }else{
                        this.$message({type:'error',message:'删除失败'})
                    }
                })
            }).catch(()=>{
                this.$message({type:'error',message:'取消删除'})
            })
        },
        getcla(){
            this.$http.get(`/api/teacher/getcla?user=${this.$store.state.userdata.username}`).then(res=>{
                this.classeslist = res.data.classes
                // console.log(this.$store.userdata)
                // console.log(this.classeslist)
                this.classisok=false
            }).catch(err=>{
                this.$message({type:'error',message:'获取分类失败。。。'})
            })
        },
        selectChange(val){
            this.checkBoxData=val
            console.log(this.checkBoxData)
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        getQuestions(){
            this.$http.get(`/api/questions/getlist?token=${localStorage.getItem('token')}`).then(res=>{
                this.tableData = res.data.data
                this.tableData = this.tableData.reverse();
                // for(var i=0;i<this.tableData.length;i++){
                //     if(this.tableData[i].isopen){
                //         this.tableData[i].isopen='是'
                //     }else{
                //         this.tableData[i].isopen='否'
                //     }
                // }
                console.log(this.tableData)
            }).catch(err=>{
                this.$message({type:'error',message:'获取题库发生错误'})
            })
        },
        delQues(){
            this.$http.post('/api/questions/delete',{ids:this.checkBoxData.map(arr=> arr._id),token:localStorage.getItem('token')}).then(res=>{
                if(res.data.status==0){
                    this.$message({type:'error',message:'删除失败'})
                }else{
                    this.$message({type:'success',message:'删除成功'})
                    this.getQuestions()
                }
            }).catch(err=>{
                this.$message({type:'error',message:'删除失败'})
            })
        },
        delQue(row){
            this.$http.post('/api/questions/delete',{ids:[row._id],token:localStorage.getItem('token')}).then(res=>{
                if(res.data.status==0){
                    this.$message({type:'error',message:'删除失败'})
                }else{
                    this.$message({type:'success',message:'删除成功'})
                    this.getQuestions()
                }
            }).catch(err=>{
                this.$message({type:'error',message:'删除失败'})
            })
        },
        searchCla(cla){
            this.searchclass=cla
        },
        init() {
            this.getcla();
            this.getQuestions();
            this.getQuestionsUsedNum();
        },
    },
    created(){
        this.init();
    }
}
</script>
<style lang="scss">
    #questions_list{
        .import{
            position:absolute;
            width: 100px;
            height: 45px;
            left: 10px;
            top:20px;
            opacity: 0;
        }
        position: relative;
        .list-content{
            display: flex;
            width: 90%;
            margin-left: 6%;
            .fenlei{
                width: 25%;
                min-height: 220px;
                border: 1px solid #c0c0c0;
                padding-left: 10px;
                padding-right:10px;
                .fenlei-list{
                    margin-top: 15px;
                }
            }
            .list{
                width:67%;
                min-height: 100px;
                border: 1px solid #c0c0c0;
                margin-left: 5px;
                padding-left: 10px;
                padding-right:10px;
                .pagination{
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                .title{
                    display:flex;
                }
            }
        }
    }
</style>