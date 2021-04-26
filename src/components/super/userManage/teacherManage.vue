<template>
    <div id="teacher-list">
        <el-row>
            <el-col :span="20">
                <div class="lheader">
                    <h2 style="margin-right:10px;">教师管理</h2>
                    <el-input style="width:300px;" v-model="search" placeholder="请输入内容"></el-input>
                    <el-button style="margin-left:10px;" type="primary" icon="el-icon-search" circle @click="searchkey"></el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20">
                <div class="lcontent">
                     <el-table
                        :data="showData"
                        :border="true"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                        <el-table-column
                        prop="username"
                        label="用户名"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="realName"
                        label="真实姓名"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="phone"
                        label="电话">
                        </el-table-column>
                        <el-table-column
                        prop="email"
                        label="邮箱">
                        </el-table-column>
                        <el-table-column
                        align="center">
                        <template slot="header">
                            <span>操作</span>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="show(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="del(scope.row)">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20">
                <div class="pagination">
                    <el-pagination
                    @current-change="pageChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="table.length">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="用户详情" :visible.sync="dialogShow">
            <div class="drow">
                <div class="img">
                    <img :src="'/api'+diaData.headPortrait">
                </div>
            </div>
            <div class="drow" style="margin-top:20px;">
                <div style="width:30%;">
                    <el-form label-position="right" label-width="80px">
                        <el-form-item label="用户名">
                            <span style="margin-left:20px;">{{diaData.username}}</span>
                        </el-form-item>
                        <el-form-item label="真实姓名">
                            <span style="margin-left:20px;">{{diaData.realNmae}}</span>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <span style="margin-left:20px;">{{diaData.email}}</span>
                        </el-form-item>
                        <el-form-item label="电话">
                            <span style="margin-left:20px;">{{diaData.phone}}</span>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [],
            table: [],
            search: '',
            currentPage: 1,
            pageSize: 10,
            dialogShow: false,
            diaData: {},
        }
    },
    computed:{
        showData() {
            return this.table.slice((this.currentPage -1) *this.pageSize,this.currentPage*this.pageSize);
        },
    },
    created() {
        this.get();
    },
    methods:{
        searchkey() {
            const _this = this;
            _this.table = _this.tableData;
            if (this.search === '') return;
            _this.table = _this.table.filter(data=>{
                const reg = new RegExp(_this.search);
                if (!data.username) {
                    return false;
                }
                let b = data.username.match(reg) !== null;
                return  b;
            })
        },
        show(row) {
            this.dialogShow = true;
            this.diaData = row;
        },
        pageChange(val) {
            this.currentPage = val;
        },
        get(){
            this.$http.post('/api/usermanage/getteacherlist',{
                token:localStorage.getItem('token')
            }).then(res=>{
                this.tableData = res.data.data;
                this.table = [].concat(this.tableData);
            })
        },
        del(row) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http.post('/api/usermanage/delteacher',{
                        token:localStorage.getItem('token'),
                        userid: row._id,
                    }).then(res=>{
                        if (res.data.status === 0) {
                            this.$message({type:'error',message:'删除失败'})
                        }else {
                            this.$message({type:'success',message:'删除成功'})
                            this.get();
                        }
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
            return 'warning-row';
            } else if (rowIndex === 3) {
            return 'success-row';
            }
            return '';
        }
    }
}
</script>
<style lang="scss">
    #teacher-list{
        padding-top: 30px;
        .drow{
            display: flex;
            justify-content: center;
            .img{
                width: 80px;
                height: 80px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    height: 100%;
                }
            }
        }
        .lheader{
            margin-left: 80px;
            display: flex;
            align-items: center;
            height: 60px;
            background-color: #f5f5f5;
            border-left: 5px solid blue;
            padding-left: 50px;
        }
        .lcontent{
            margin-left: 80px;
            background-color: #f5f5f5;
            border-left: 5px solid blue;
        }
        .pagination{
            margin-left: 80px;
            margin-top: 20px;
        }
    }
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>