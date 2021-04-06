<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading">
      <el-header>
        <el-button style="height:100%;" type="text" @click="addTeacherVisible = true"><i class="el-icon-plus"></i>添加</el-button>
      </el-header>
      <el-main>
        <el-table stripe class="teacher-table" :data="teachers" max-height="600" border>
          <el-table-column prop="tno" label="工号"></el-table-column>
          <el-table-column prop="teacherName" label="姓名"></el-table-column>
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
      <el-dialog title="添加" :visible.sync="addTeacherVisible">
        <el-form :model="addForm">
          <el-form-item label="工号">
            <el-input v-model="addForm.tno"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="addForm.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type="password" v-model="addForm.passwordConfirm"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addTeacherVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTeacher">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出删除对话框 -->
      <el-dialog title="删除" :visible.sync="delTeacherVisible">
        <span>确定要删除吗？</span>
        <span slot="footer">
          <el-button @click="delTeacherVisible = false">取 消</el-button>
          <el-button type="danger" @click="deleteTeacher">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出编辑对话框 -->
      <el-dialog title="编辑" :visible.sync="updateTeacherVisible">
        <el-form :model="updateForm">
          <el-form-item label="工号">
            <el-input v-model="updateForm.tno"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="updateForm.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="updateForm.password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateTeacherVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateTeacher">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";
export default {
  name: "TeacherManage",
  components: {
    Loading
  },
  data() {
    return {
      isLoading: true,
      addTeacherVisible: false,
      delTeacherVisible: false,
      updateTeacherVisible: false,
      delTeacherId: "",
      addForm: {
        tno: "",
        teacherName: "",
        password: "",
        passwordConfirm: ""
      },
      updateForm: {
        id: "",
        tno: "",
        teacherName: "",
        password: ""
      },
      teachers: []
    };
  },
  methods: {
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
    showUpdate(row) {
      this.updateForm.id = row.id;
      this.updateForm.tno = row.tno;
      this.updateForm.teacherName = row.teacherName;
      this.updateForm.password = row.password;
      this.updateTeacherVisible = true;
    },
    showDelete(row) {
      this.delTeacherVisible = true;
      this.delTeacherId = row.id;
    },
    deleteTeacher() {
      console.log(this.delTeacherId);
      this.axios
        .delete(`/api/teacher/${this.delTeacherId}`)
        .then(res => {
          console.log(res);
          this.$message({ message: "删除成功", type: "success" });
          this.getTeacher();
          this.delTeacherVisible = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    addTeacher() {
      const { tno, teacherName, password } = this.addForm;
      this.axios
        .post("/api/teacher", { tno, teacherName, password })
        .then(res => {
          console.log(res);
          this.$message({ message: "添加成功", type: "success" });
          this.getTeacher();
          this.addTeacherVisible = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateTeacher() {
      const { tno, teacherName, password } = this.updateForm;
      this.axios
        .put(`/api/teacher/${this.updateForm.id}`, {
          tno,
          teacherName,
          password
        })
        .then(res => {
          console.log(res);
          this.$message({ message: "修改成功", type: "success" });
          this.getTeacher();
          this.updateTeacherVisible = false;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  created() {
    this.axios
      .get("/api/teacher")
      .then(res => {
        this.teachers = res.data;
        this.isLoading = false;
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style lang="less" scoped>
</style>