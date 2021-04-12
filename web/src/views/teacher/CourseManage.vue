<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading">
      <el-header>
        <el-button style="height:100%;"
                   type="text"
                   @click="addCourseVisible = true"><i class="el-icon-plus"></i>添加</el-button>
      </el-header>
      <el-main>
        <el-table stripe
                  class="course-table"
                  :data="courses"
                  max-height="600"
                  border>
          <el-table-column prop="cno"
                           label="课程号"></el-table-column>
          <el-table-column prop="courseName"
                           label="课程名"></el-table-column>
          <el-table-column prop="year"
                           label="学年"></el-table-column>
          <el-table-column prop="teacher.teacherName"
                           label="教师"></el-table-column>
          <el-table-column label="操作"
                           width="100">
            <template slot-scope="scope">
              <el-button @click="showUpdate(scope.row)"
                         type="text"
                         size="small">编辑</el-button>
              <el-button @click="showDelete(scope.row)"
                         type="text"
                         size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <!--添加对话框-->
    <el-dialog title="添加"
               width="400px"
               :visible.sync="addCourseVisible">
      <el-form :model="addForm"
               ref="addForm"
               :rules="rules">
        <el-form-item label="课程号"
                      prop="cno">
          <el-input v-model="addForm.cno"></el-input>
        </el-form-item>
        <el-form-item label="课程名"
                      prop="courseName">
          <el-input v-model="addForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="学年"
                      prop="year">
          <el-date-picker style="width: 100%;"
                          value-format="yyyy"
                          v-model="addForm.year"
                          type="year"
                          placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授课教师">
          <el-table stripe
                    :data="teachers"
                    max-height="300"
                    highlight-current-row
                    @current-change="addTeacherChange">
            <el-table-column type="index"
                             width="40"></el-table-column>
            <el-table-column property="tno"
                             label="工号"></el-table-column>
            <el-table-column property="teacherName"
                             label="姓名"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addCourseVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCourse">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="删除"
               width="400px"
               :visible.sync="delCourseVisible">
      <span>确定要删除吗？</span>
      <span slot="footer">
        <el-button @click="delCourseVisible = false">取 消</el-button>
        <el-button type="danger"
                   @click="deleteCourse">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑"
               width="400px"
               :visible.sync="updateCourseVisible">
      <el-form :model="updateForm"
               ref="updateForm"
               :rules="rules">
        <el-form-item label="课程号"
                      prop="cno">
          <el-input v-model="updateForm.cno"></el-input>
        </el-form-item>
        <el-form-item label="课程名"
                      prop="courseName">
          <el-input v-model="updateForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="学年"
                      prop="year">
          <el-date-picker style="width: 100%;"
                          value-format="yyyy"
                          v-model="updateForm.year"
                          type="year"
                          placeholder="选择学年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授课教师">
          <el-table stripe
                    border
                    :data="teachers"
                    max-height="300"
                    highlight-current-row
                    @current-change="updateTeacherChange">
            <el-table-column type="index"
                             width="40"></el-table-column>
            <el-table-column property="tno"
                             label="工号"></el-table-column>
            <el-table-column property="teacherName"
                             label="姓名"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="updateCourseVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateCourse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
export default {
  name: "CourseManage",
  components: {
    Loading
  },
  data() {
    return {
      isLoading: true,
      courses: [],
      teachers: [],
      addCourseVisible: false,
      delCourseVisible: false,
      updateCourseVisible: false,
      delCourseId: "",
      addForm: {
        cno: "",
        courseName: "",
        year: "",
        teacher: ""
      },
      updateForm: {
        id: "",
        cno: "",
        courseName: "",
        year: ""
      },
      rules: {
        cno: [{ required: true, message: "请输入课程号", trigger: "blur" }],
        courseName: [
          { required: true, message: "请输入课程名", trigger: "blur" }
        ],
        year: [{ required: true, message: "请选择学年", trigger: "blur" }]
      }
    };
  },
  created() {
    this.axios
      .get("/api/course")
      .then(res => {
        this.courses = res.data;
        this.isLoading = false;
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
    this.axios
      .get("/api/teacher")
      .then(res => {
        this.teachers = res.data;
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    addTeacherChange(val) {
      this.addForm.teacher = val.id;
    },
    updateTeacherChange(val) {
      this.updateForm.teacher = val.id;
    },
    showUpdate(row) {
      this.updateForm.id = row.id;
      this.updateForm.cno = row.cno;
      this.updateForm.courseName = row.courseName;
      this.updateForm.year = row.year;
      this.updateForm.teacher = row.teacher.id;
      this.updateCourseVisible = true;
    },
    showDelete(row) {
      this.delCourseVisible = true;
      this.delCourseId = row.id;
    },
    getTeacher() {
      this.axios
        .get("/api/teacher")
        .then(res => {
          this.teachers = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    getCourse() {
      this.axios
        .get("/api/course")
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    addCourse() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          const { cno, courseName, year, teacher } = this.addForm;
          if (!teacher) {
            this.$message({ message: "请选择授课教师", type: "warning" });
          } else {
            this.axios
              .post("/api/course", { cno, courseName, year, teacher })
              .then(res => {
                console.log(res);
                this.$message({ message: "添加成功", type: "success" });
                this.getCourse();
                this.addCourseVisible = false;
              })
              .catch(err => {
                console.error(err);
              });
          }
        }
      });
    },
    updateCourse() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          const { cno, courseName, year, teacher } = this.updateForm;
          if (!teacher) {
            this.$message({ message: "请选择授课教师", type: "warning" });
          } else {
            this.axios
              .put(`/api/course/${this.updateForm.id}`, {
                cno,
                courseName,
                year,
                teacher
              })
              .then(res => {
                console.log(res);
                this.$message({ message: "修改成功", type: "success" });
                this.getCourse();
                this.updateCourseVisible = false;
              })
              .catch(err => {
                console.error(err);
              });
          }
        }
      });
    },
    deleteCourse() {
      console.log(this.delCourseId);
      this.axios
        .delete(`/api/course/${this.delCourseId}`)
        .then(res => {
          console.log(res);
          this.$message({ message: "删除成功", type: "success" });
          this.getCourse();
          this.delCourseVisible = false;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
</style>