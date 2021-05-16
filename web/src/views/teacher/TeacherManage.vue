<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading"
                  class="main-content">
      <el-header>
        <el-button style="height:100%;"
                   type="text"
                   @click="addTeacherVisible = true"><i class="el-icon-plus"></i>添加</el-button>
      </el-header>
      <el-main>
        <el-table stripe
                  class="teacher-table"
                  :data="teachers"
                  max-height="600"
                  border>
          <el-table-column prop="tno"
                           label="工号"></el-table-column>
          <el-table-column prop="teacherName"
                           label="姓名"></el-table-column>
          <el-table-column label="操作"
                           width="200">
            <template slot-scope="scope">
              <el-button @click="showUpdate(scope.row)"
                         type="text"
                         size="small">编辑</el-button>
              <el-button @click="showDelete(scope.row)"
                         type="text"
                         size="small">删除</el-button>
              <el-button @click="showReset(scope.row)"
                         type="text"
                         size="small">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!--添加对话框-->
      <el-dialog title="添加"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="addTeacherVisible">
        <el-form :model="addForm"
                 ref="addForm"
                 :rules="rules"
                 status-icon>
          <el-form-item label="工号"
                        prop="tno">
            <el-input v-model="addForm.tno"></el-input>
          </el-form-item>
          <el-form-item label="姓名"
                        prop="teacherName">
            <el-input v-model="addForm.teacherName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="addTeacherVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addTeacher">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除对话框 -->
      <el-dialog title="删除"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="delTeacherVisible">
        <span>确定要删除吗？</span>
        <span slot="footer">
          <el-button @click="delTeacherVisible = false">取 消</el-button>
          <el-button type="danger"
                     @click="deleteTeacher">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="注意"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="resetPasswordVisible">
        <span>确定要重置吗？</span>
        <span slot="footer">
          <el-button @click="cancelReset">取 消</el-button>
          <el-button type="danger"
                     @click="resetPassword">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog title="编辑"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="updateTeacherVisible">
        <el-form :model="updateForm"
                 :rules="rules"
                 ref="updateForm"
                 status-icon>
          <el-form-item label="工号"
                        prop="tno">
            <el-input v-model="updateForm.tno"></el-input>
          </el-form-item>
          <el-form-item label="姓名"
                        prop="teacherName">
            <el-input v-model="updateForm.teacherName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="updateTeacherVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="updateTeacher">确 定</el-button>
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
      teachers: [],
      addTeacherVisible: false,
      delTeacherVisible: false,
      updateTeacherVisible: false,
      resetPasswordVisible: false,
      delTeacherId: "",
      resetId: "",
      addForm: {
        tno: "",
        teacherName: "",
        password: "",
        passwordConfirm: ""
      },
      rules: {
        tno: [{ required: true, message: "请输入工号", trigger: "blur" }],
        teacherName: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        passwordConfirm: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.addForm.password) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      updateForm: {
        id: "",
        tno: "",
        teacherName: "",
        password: ""
      }
    };
  },
  methods: {
    showReset(row) {
      this.resetId = row.id;
      this.resetPasswordVisible = true;
    },
    cancelReset() {
      this.resetId = "";
      this.resetPasswordVisible = false;
    },
    resetPassword() {
      this.axios
        .put(`/api/teacher/reset/${this.resetId}`)
        .then(res => {
          this.$message.success("重置成功");
          this.resetPasswordVisible = false;
          console.log(res);
        })
        .catch(err => {
          this.$message.error("重置失败");
          console.log(err);
        });
    },
    showUpdate(row) {
      this.updateForm.id = row.id;
      this.updateForm.tno = row.tno;
      this.updateForm.teacherName = row.teacherName;
      this.updateTeacherVisible = true;
    },
    showDelete(row) {
      this.delTeacherVisible = true;
      this.delTeacherId = row.id;
    },
    getTeacher() {
      this.axios
        .get("/api/teacher")
        .then(res => {
          this.teachers = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addTeacher() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          const { tno, teacherName } = this.addForm;
          this.axios
            .post("/api/teacher", { tno, teacherName })
            .then(res => {
              console.log(res);
              this.$message.success("添加成功");
              this.getTeacher();
              this.addTeacherVisible = false;
            })
            .catch(err => {
              this.$message.error(`添加失败:${err.message}`);
            });
        }
      });
    },
    updateTeacher() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          const { tno, teacherName } = this.updateForm;
          this.axios
            .put(`/api/teacher/${this.updateForm.id}`, {
              tno,
              teacherName
            })
            .then(res => {
              console.log(res);
              this.$message({ message: "修改成功", type: "success" });
              this.getTeacher();
              this.$emit("update");
              this.updateTeacherVisible = false;
            })
            .catch(err => {
              this.$message.error(`修改失败:${err.message}`);
            });
        }
      });
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
          this.$message.error(`删除失败:${err.message}`);
        });
    }
  },
  created() {
    this.axios
      .get("/api/teacher")
      .then(res => {
        this.teachers = res.data;
        this.isLoading = false;
      })
      .catch(err => {
        this.$message.error(`获取失败:${err.message}`);
      });
  }
};
</script>
<style lang="less" scoped>
.main-content {
  max-width: 1200px;
  min-width: 800px;
  margin: auto;
}
</style>