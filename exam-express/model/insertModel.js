/** 
 * 本文件专门用于插入数据库
 * 直接node运行本脚本
*/
//引入schema
const Teacher = require('./M_teacher')
const Student = require('./M_student')

//引入假数据
const insertData = require('./insertData')
const data_Teacher = insertData.teacher //教师数据
const data_Student = insertData.student //教师数据

/** 
 * 插入老师数据
*/
const insertTeacher = ()=>{
    
    Teacher.insertMany(data_Teacher,(err,data)=>{
        if(err) throw err;
        console.log(data)
    })
}

// insertTeacher()


/** 
 * 插入学生数据
*/
const insertStudent = ()=>{
    
    Student.insertMany(data_Student,(err,data)=>{
        if(err) throw err;
        console.log(data)
    })
}
insertStudent();