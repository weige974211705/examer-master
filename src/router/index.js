import Vue from 'vue'
import store from '../store/store'
import axios from 'axios'
import Router from 'vue-router'
import JsToken from 'jsonwebtoken'

import Login from './../components/Login.vue'
import Register from './../components/Register.vue'
import SuperManage from './../components/super/Manage.vue'
import Notfound from './../components/404'
import Index from '../components/Index'
import StudentManage from '../components/student/Manage.vue'
import TeacherManage from '../components/teacher/Manage.vue'
import Manage from '../components/Manage'
import SuperTeacherManage from '../components/super/userManage/teacherManage.vue'
import SuperStudentManage from '../components/super/userManage/studentManage.vue'
import Questions_bank from './../components/teacher/questions_bank/Index.vue'
import Questions_edit from './../components/teacher/questions_bank/edit/Index.vue'
import Questions_list from './../components/teacher/questions_bank/list/Index.vue'
import Exam_paper from './../components/teacher/exam_paper/Index.vue'
import Exam_paper_index from './../components/teacher/exam_paper/index/Index.vue'
import Exam_paper_edit from './../components/teacher/exam_paper/edit/index.vue'
import StudentCenter from './../components/student/center/index.vue'
import teacherCenter from './../components/teacher/center/index.vue'
import StartExam from './../components/student/startExam/index.vue'
import MyRecord from './../components/student/record/index.vue'
import teacherRecord from './../components/teacher/record/index.vue'
import sutdentUserManager from './../components/student/userManager/index.vue'
import teacherUserManager from './../components/teacher/userManager/index.vue'
import sutdentChat from './../components/student/chat/index.vue'
import teacherChat from './../components/teacher/chat/index.vue'
import Examing from './../components/Examing.vue'
import teacherHelp from './../components/teacher/help/index.vue'
import studentHelp from './../components/student/help/index.vue'
import studentRanking from './../components/student/community/ranking.vue'
import studentAsk from './../components/student/community/ask.vue'
import studentCircle from './../components/student/community/circle.vue'
import superCenter from './../components/super/center/index.vue'
import superSettings from './../components/super/settings/index.vue'
import examAnalysis from './../components/exam/analysis.vue'
import wrongPractice from './../components/exam/wrong.vue'
import superHelp from './../components/super/help/index.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    {path:'/',component:Index, redirect: '/login'},
    {path: '/login',name: 'Login',component: Login},
    {path:'/register',component:Register},
    {path:'/examing/:id', component:Examing},
    {path:'/analysis/:id', component: examAnalysis},
    {path:'/manage',component:Manage,children:[

      //超级管理界面
      {path:'super',component:SuperManage,children:[
        {path:'teacherManage',component:SuperTeacherManage},
        {path:'studentManage',component:SuperStudentManage},
        {path:'center',component:superCenter},
        {path:'settings',component:superSettings},
        {path:'help',component:superHelp},
      ],beforeEnter:(to,from,next)=>{
        if(store.state.userdata.identity!='super')next('/login')
        else{next()}
      }},


      //教师管理界面
      {path:'teacher',component:TeacherManage,children:[
        {path:'questions',component:Questions_bank,children:[
          {path:'edit',component:Questions_edit},
          {path:'list',component:Questions_list}
        ]},
        {path:'paper',component:Exam_paper,children:[
          {path:'index',component:Exam_paper_index},
          {path:'edit',component:Exam_paper_edit},
        ]},
        {path:'chat',component:teacherChat},
        {path:'usermanager', component:teacherUserManager,},
        {path:'center', component:teacherCenter,},
        {path:'record', component:teacherRecord,},
        {path:'help', component:teacherHelp,},
      ],beforeEnter:(to,from,next)=>{
        if(store.state.userdata.identity!='teacher')next('/login')
        else{
          next()
        }
      }},


      //学生管理界面
      {path:'student',component:StudentManage,children:[
        {path:'center', component:StudentCenter,},
        {path:'startexam', component:StartExam,},
        {path:'record', component:MyRecord,},
        {path:'chat', component:sutdentChat,},
        {path:'usermanager', component:sutdentUserManager,},
        {path:'help', component:studentHelp,},
        {path:'ranking', component:studentRanking,},
        {path:'circle', component:studentCircle,},
        {path:'ask', component:studentAsk,},
        {path:'wrong',component: wrongPractice},
      ],beforeEnter:(to,from,next)=>{
        if(store.state.userdata.identity!='student')next('/login')
        else{
          next()
        }
      }},
    ]},
    {path:'*',component:Notfound}
  ]
})

router.beforeEach((to, from, next) => {
  axios.get('/api/super/allgetconfig').then(res=>{
    store.commit('setConfig', res.data.data)
  })

  //当访问后台管理的时候必须要token
  if(to.path.indexOf('/manage')+1&&!localStorage.getItem('token')){
    next('login')
  }else if(to.path.indexOf('/manage')+1&&localStorage.getItem('token')){
    axios.post('/api/global/loginStatus',{token:localStorage.getItem('token')}).then((res)=>{
      if(res.data.status==1){  //token合法
        store.commit('setUserdata', res.data.data)
        // console.log(res.data.data.identity)
          console.log(res.data.data);
          next()
        // }
      }else{
        localStorage.setItem('token','')
        next('/login')
      }
    },err=>{
      next('/login')
    })
  }
  else{
    next()
  }
})
  

export default router