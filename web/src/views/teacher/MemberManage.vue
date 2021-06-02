<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading"
                  class="main-content">
      <el-main>
        <span>课程：</span>
        <el-select v-model="currentCourse"
                   placeholder="选择课程"
                   @change="getCurrentStudents">
          <el-option v-for="course in courses"
                     :key="course.id"
                     :label="course.courseName"
                     :value="course.id"></el-option>
        </el-select>
        <div style="margin: 10px 0;">
          <span>开课学期：</span>
          <el-date-picker style="width: 100px"
                          value-format="yyyy"
                          v-model="startYear"
                          type="year"
                          placeholder="学年"
                          @change="getCurrentStudents">
          </el-date-picker>
          <span> 至 </span>
          <el-input disabled
                    style="width: 100px;"
                    v-model="endYear"></el-input>
          <span> 学年 </span>
          <el-select class="term-pick"
                     placeholder="学期"
                     @change="getCurrentStudents"
                     v-model="termChoice">
            <el-option label="第一学期"
                       value="第一学期"></el-option>
            <el-option label="第二学期"
                       value="第二学期"></el-option>
          </el-select>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane label="当前学生">
            <div class="table-header">
              <span>当前学生</span>
              <el-button type="primary"
                         plain
                         @click="showDeleteMany"><i class="el-icon-delete"></i>批量删除</el-button>
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
          <el-tab-pane :disabled="term&&currentCourse?false:true"
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
                      :data="studentsFiltered"
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
      <el-dialog title="注意"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="deleteManyStudentVisible">
        <span>确定要删除吗？</span>
        <span slot="footer">
          <el-button @click="deleteManyStudentVisible = false">取消</el-button>
          <el-button type="danger"
                     @click="deleteManyStudent">确定</el-button>
        </span>
      </el-dialog>
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
      addStudents: [],
      startYear: "",
      termChoice: "",
      deleteManyStudentVisible: false
    };
  },
  computed: {
    term: function() {
      if (this.startYear && this.endYear && this.termChoice) {
        return `${this.startYear}至${this.endYear}学年${this.termChoice}`;
      } else {
        return "";
      }
    },
    endYear: function() {
      return this.startYear ? String(parseInt(this.startYear) + 1) : "";
    },
    studentsFiltered: function() {
      return this.students.filter(
        item => !this.currentStudentIds.includes(item.id)
      );
    },
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
      this.addStudents = val.map(item => item.id);
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
            students: this.addStudents,
            term: this.term
          })
          .then(res => {
            this.getCurrentStudents();
            this.$message({ message: "添加成功", type: "success" });
            console.log(res);
          })
          .catch(err => {
            this.$message.warning("添加学生失败");
            console.error(err);
          });
      }
    },
    showDeleteMany() {
      if (this.deleteStudents.length === 0) {
        this.$message({ message: "请选择要删除的学生", type: "warning" });
      } else {
        this.deleteManyStudentVisible = true;
      }
    },
    deleteManyStudent() {
      this.axios
        .delete("/api/scLink/students", {
          data: { course: this.currentCourse, students: this.deleteStudents }
        })
        .then(res => {
          this.$message({ message: "删除成功", type: "success" });
          this.deleteManyStudentVisible = false;
          console.log(res);
          this.getCurrentStudents();
        })
        .catch(err => {
          console.error(err);
        });
    },
    getCurrentStudents() {
      if (this.currentCourse && this.term) {
        this.axios
          // .get(`/api/scLink/student/${this.currentCourse}`)
          .get("/api/scLink/students", {
            params: { course: this.currentCourse, term: this.term }
          })
          .then(res => {
            console.log(res);
            this.currentStudents = res.data;
            this.$refs.addStudentTable.clearSelection();
          })
          .catch(err => {
            console.error(err);
          });
      }
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
.main-content {
  max-width: 1200px;
  min-width: 800px;
  margin: auto;
}
</style>