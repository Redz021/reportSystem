<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading">
      <el-header>
        <span>当前课程：</span>
        <el-select v-model="currentCourse"
                   placeholder="选择课程"
                   @change="getCurrentStudents">
          <el-option v-for="course in courses"
                     :key="course.id"
                     :label="course.courseName+'['+course.teacher.teacherName+']'"
                     :value="course.id"></el-option>
        </el-select>
      </el-header>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="当前学生">
            <div class="table-header">
              <span>当前学生</span>
              <el-button type="text"
                         @click="deleteManyStudents"><i class="el-icon-delete"></i>从课程中批量删除</el-button>
            </div>
            <!-- <el-button type="text"><i class="el-icon-plus"></i>向课程内添加学生</el-button> -->
            <el-table stripe
                      border
                      :data="currentStudents"
                      max-height="600"
                      @selection-change="selectDeleteStudents">
              <el-table-column type="selection"
                               width="40"></el-table-column>
              <el-table-column prop="sno"
                               label="学号"
                               sortable></el-table-column>
              <el-table-column :filters="currentStudentClassesFilter"
                               :filter-method="classFilterHandler"
                               prop="studentClass"
                               label="班级"
                               sortable></el-table-column>
              <el-table-column prop="studentName"
                               label="姓名"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :disabled="currentCourse?false:true"
                       label="添加学生">
            <div class="table-header">
              <span>向当前课程中添加学生</span>
              <el-button type="primary"
                         plain
                         @click="addManyStudents"><i class="el-icon-plus"></i>添加</el-button>
            </div>
            <el-table stripe
                      border
                      ref="addStudentTable"
                      :data="students"
                      max-height="600"
                      @selection-change="selectAddStudents">
              <el-table-column type="selection"
                               width="40"></el-table-column>
              <el-table-column prop="sno"
                               label="学号"
                               sortable></el-table-column>
              <el-table-column :filters="studentClassesFilter"
                               :filter-method="classFilterHandler"
                               sortable
                               prop="studentClass"
                               label="班级"></el-table-column>
              <el-table-column prop="studentName"
                               label="姓名"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

      </el-main>
    </el-container>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
export default {
  name: "MemberManage",
  components: { Loading },
  data() {
    return {
      isLoading: true,
      courses: [],
      currentCourse: "",
      students: [],
      currentStudents: [],
      deleteStudents: [],
      addStudents: []
    };
  },
  computed: {
    currentStudentIds: function() {
      if (this.currentStudents.length === 0) return [];
      return this.currentStudents.map(item => item.id);
    },
    studentClassesFilter: function() {
      if (this.students.length === 0) return [];
      let s = new Set(this.students.map(item => item.studentClass));
      let classes = [...s];
      let res = [];
      for (let item of classes) {
        res.push({ text: item, value: item });
      }
      return res;
    },
    currentStudentClassesFilter: function() {
      if (this.currentStudents.length === 0) return [];
      let s = new Set(this.currentStudents.map(item => item.studentClass));
      let classes = [...s];
      let res = [];
      for (let item of classes) {
        res.push({ text: item, value: item });
      }
      return res;
    }
  },
  methods: {
    selectAddStudents(val) {
      let studentsIds = val.map(item => item.id);
      let students = studentsIds.filter(
        item => !this.currentStudentIds.includes(item)
      );
      this.addStudents = students;
    },
    selectDeleteStudents(val) {
      let students = val.map(item => item.id);
      this.deleteStudents = students;
    },
    classFilterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    addManyStudents() {
      if (this.addStudents.length === 0) {
        this.$message({ message: "请选择要添加的学生", type: "warning" });
      } else {
        this.axios
          .post("/api/scLink/students", {
            course: this.currentCourse,
            students: this.addStudents
          })
          .then(res => {
            this.getCurrentStudents();
            this.$message({ message: "添加成功", type: "success" });
            console.log(res);
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    deleteManyStudents() {
      if (this.deleteStudents.length === 0) {
        this.$message({ message: "请选择要删除的学生", type: "warning" });
      } else {
        console.log(this.currentCourse, this.deleteStudents);
        this.axios
          .delete("/api/scLink/students", {
            data: { course: this.currentCourse, students: this.deleteStudents }
          })
          .then(res => {
            this.$message({ message: "删除成功", type: "success" });
            console.log(res);
            this.getCurrentStudents();
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    getCurrentStudents() {
      this.axios
        .get(`/api/scLink/student/${this.currentCourse}`)
        .then(res => {
          console.log(res);
          this.currentStudents = res.data;
          this.$refs.addStudentTable.clearSelection();
        })
        .catch(err => {
          console.error(err);
        });
    },
    getStudents() {
      this.axios
        .get("/api/student")
        .then(res => {
          this.students = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  created() {
    this.axios
      .get("/api/course")
      .then(res => {
        this.courses = res.data;
      })
      .catch(err => {
        console.error(err);
      });
    this.axios
      .get("/api/student")
      .then(res => {
        this.students = res.data;
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style lang="less" scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
</style>