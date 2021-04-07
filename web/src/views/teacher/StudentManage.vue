<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading">
      <el-header>
        <el-button style="height:100%;" type="text" @click="addStudentVisible = true"><i class="el-icon-plus"></i>添加</el-button>
        <el-button style="height: 100%;" type="text" @click="showDeleteBatch"><i class="el-icon-delete"></i>批量删除</el-button>
      </el-header>
      <el-main>
        <el-table stripe class="student-table" :data="students" max-height="600" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40">
          </el-table-column>
          <el-table-column prop="sno" label="学号"></el-table-column>
          <el-table-column prop="studentClass" label="班级"></el-table-column>
          <el-table-column prop="studentName" label="姓名"></el-table-column>
          <el-table-column prop="password" label="密码"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="showUpdate(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="showDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!--弹出添加对话框-->
      <el-dialog title="添加" :visible.sync="addStudentVisible">
        <el-form :model="addForm">
          <el-form-item label="学号">
            <el-input v-model="addForm.sno"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="addForm.studentClass"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="addForm.studentName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type="password" v-model="addForm.passwordConfirm"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addStudentVisible = false">取 消</el-button>
          <el-button type="primary" @click="addStudent">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出删除对话框 -->
      <el-dialog title="删除" :visible.sync="delStudentVisible">
        <span>确定要删除吗？</span>
        <span slot="footer">
          <el-button @click="delStudentVisible = false">取 消</el-button>
          <el-button type="danger" @click="deleteStudent">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出编辑对话框 -->
      <el-dialog title="编辑" :visible.sync="updateStudentVisible">
        <el-form :model="updateForm">
          <el-form-item label="学号">
            <el-input v-model="updateForm.sno"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="updateForm.studentClass"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="updateForm.studentName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="updateForm.password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateStudentVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateStudent">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出批量删除确定对话框 -->
      <el-dialog title="注意" :visible.sync="delBatchStudentVisible">
        <span>确定要删除吗？</span>
        <span slot="footer">
          <el-button @click="delBatchStudentVisible = false">取 消</el-button>
          <el-button type="danger" @click="deleteBatchStudent">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
export default {
  name: "StudentManage",
  components: {
    Loading
  },
  data() {
    return {
      isLoading: true,
      addStudentVisible: false,
      delStudentVisible: false,
      updateStudentVisible: false,
      delBatchStudentVisible: false,
      delStudentId: "",
      addForm: {
        sno: "",
        studentClass: "",
        studentName: "",
        password: "",
        passwordConfirm: ""
      },
      updateForm: {
        id: "",
        sno: "",
        studentClass: "",
        studentName: "",
        password: ""
      },
      students: [],
      selectedStudents: []
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedStudents = val;
    },
    getStudent() {
      this.axios
        .get("/api/student")
        .then(res => {
          this.students = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    showUpdate(row) {
      this.updateForm.id = row.id;
      this.updateForm.sno = row.sno;
      this.updateForm.studentClass = row.studentClass;
      this.updateForm.studentName = row.studentName;
      this.updateForm.password = row.password;
      this.updateStudentVisible = true;
    },
    showDelete(row) {
      this.delStudentVisible = true;
      this.delStudentId = row.id;
    },
    showDeleteBatch() {
      if (this.selectedStudents.length === 0) {
        this.$message({ message: "请选择需要删除的学生", type: "warning" });
      } else {
        this.delBatchStudentVisible = true;
      }
    },
    deleteStudent() {
      this.axios
        .delete(`/api/student/${this.delStudentId}`)
        .then(res => {
          console.log(res);
          this.$message({ message: "删除成功", type: "success" });
          this.getStudent();
          this.delStudentVisible = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteBatchStudent() {
      console.log(this.selectedStudents);
      this.delBatchStudentVisible = false;
    },
    addStudent() {
      const { sno, studentClass, studentName, password } = this.addForm;
      this.axios
        .post("/api/student", { sno, studentClass, studentName, password })
        .then(res => {
          console.log(res);
          this.$message({ message: "添加成功", type: "success" });
          this.getStudent();
          this.addStudentVisible = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateStudent() {
      const { sno, studentClass, studentName, password } = this.updateForm;
      this.axios
        .put(`/api/student/${this.updateForm.id}`, {
          sno,
          studentClass,
          studentName,
          password
        })
        .then(res => {
          console.log(res);
          this.$message({ message: "修改成功", type: "success" });
          this.getStudent();
          this.updateStudentVisible = false;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  created() {
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
</style>