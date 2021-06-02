<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading"
                  class="main-content">
      <el-header class="table-control">
        <el-button style="height:100%;"
                   type="text"
                   @click="addStudentVisible = true"><i class="el-icon-plus"></i>添加</el-button>
        <el-button style="height: 100%;"
                   type="text"
                   @click="showDeleteMany"><i class="el-icon-delete"></i>批量删除</el-button>
        <el-button style="height: 100%;"
                   type="text"
                   @click="uploadStudentVisible = true"><i class="el-icon-circle-plus"></i><span>从模板导入</span></el-button>
        <el-button style="height: 100%;"
                   type="text"
                   @click="getImportTemplate"><i class="el-icon-download"></i><span>下载模板</span></el-button>
      </el-header>
      <el-main>
        <el-table stripe
                  class="student-table"
                  :data="students"
                  max-height="600"
                  :default-sort="{prop: 'sno', order: 'ascending'}"
                  border
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="40">
          </el-table-column>
          <el-table-column sortable
                           prop="sno"
                           label="学号"></el-table-column>
          <el-table-column sortable
                           prop="studentClass"
                           :filters="studentClassesFilter"
                           :filter-method="classFilterHandler"
                           label="班级"></el-table-column>
          <el-table-column prop="studentName"
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
                 :visible.sync="addStudentVisible">
        <el-form :model="addForm"
                 ref="addForm"
                 :rules="rules">
          <el-form-item label="学号"
                        prop="sno">
            <el-input v-model="addForm.sno"></el-input>
          </el-form-item>
          <el-form-item label="班级"
                        prop="studentClass">
            <el-input v-model="addForm.studentClass"></el-input>
          </el-form-item>
          <el-form-item label="姓名"
                        prop="studentName">
            <el-input v-model="addForm.studentName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="addStudentVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="addStudent">确定</el-button>
        </div>
      </el-dialog>
      <!-- 删除对话框 -->
      <el-dialog title="删除"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="delStudentVisible">
        <span>确定要删除吗？</span>
        <span slot="footer">
          <el-button @click="delStudentVisible = false">取消</el-button>
          <el-button type="danger"
                     @click="deleteStudent">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="注意"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="resetPasswordVisible">
        <span>确定要重置吗？</span>
        <span slot="footer">
          <el-button @click="cancelReset">取消</el-button>
          <el-button type="danger"
                     @click="resetPassword">确定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog title="编辑"
                 width="400px"
                 :visible.sync="updateStudentVisible">
        <el-form :model="updateForm"
                 ref="updateForm"
                 :rules="rules">
          <el-form-item label="学号"
                        prop="sno">
            <el-input v-model="updateForm.sno"></el-input>
          </el-form-item>
          <el-form-item label="班级"
                        prop="studentClass">
            <el-input v-model="updateForm.studentClass"></el-input>
          </el-form-item>
          <el-form-item label="姓名"
                        prop="studentName">
            <el-input v-model="updateForm.studentName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="updateStudentVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="updateStudent">确定</el-button>
        </div>
      </el-dialog>
      <!-- 批量删除确定对话框 -->
      <el-dialog title="注意"
                 width="400px"
                 :close-on-click-modal="false"
                 :visible.sync="delManyStudentVisible">
        <span>确定要删除吗？</span>
        <span slot="footer">
          <el-button @click="delManyStudentVisible = false">取消</el-button>
          <el-button type="danger"
                     @click="deleteManyStudent">确定</el-button>
        </span>
      </el-dialog>
      <!-- 上传模板对话框 -->
      <el-dialog title="上传模板"
                 :visible.sync="uploadStudentVisible"
                 :close-on-click-modal="false"
                 width="400px"
                 center>
        <el-upload drag
                   ref="upload"
                   action="http://localhost:3000/uploads"
                   accept=".xls,.xlsx"
                   :limit="1"
                   :auto-upload="false"
                   :on-remove="handleRemove"
                   :on-success="handleSuccess"
                   :on-error="handleError"
                   :on-exceed="handleExceed"
                   :http-request="httpRequest">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip">支持xls/xlsx</div>
        </el-upload>
        <div slot="footer">
          <el-button type="success"
                     @click="uploadFile">确定</el-button>
        </div>
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
      students: [],
      selectedStudents: [],
      fileList: [],
      addStudentVisible: false,
      delStudentVisible: false,
      updateStudentVisible: false,
      delManyStudentVisible: false,
      uploadStudentVisible: false,
      resetPasswordVisible: false,
      delStudentId: "",
      resetId: "",
      addForm: {
        sno: "",
        studentClass: "",
        studentName: ""
      },
      updateForm: {
        id: "",
        sno: "",
        studentClass: "",
        studentName: ""
      },
      rules: {
        sno: [{ required: true, message: "请输入学号", trigger: "blur" }],
        studentName: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        studentClass: [
          { required: true, message: "请输入班级", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    studentClassesFilter: function() {
      let s = new Set(this.students.map(item => item.studentClass));
      let classes = [...s];
      let res = [];
      for (let item of classes) {
        res.push({ text: item, value: item });
      }
      return res;
    },
    selectedStudentsId: function() {
      return this.selectedStudents.map(item => item.id);
    }
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
        .put(`/api/student/reset/${this.resetId}`)
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
    handleSelectionChange(val) {
      this.selectedStudents = val;
    },
    classFilterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //上传部分
    getImportTemplate() {
      window.location.href = "http://localhost:8080/docs/导入模板.xlsx";
    },
    uploadFile() {
      // console.log(this.fileList);
      // if (this.fileList.length === 0) this.$message.warning("请选择文件");
      // else this.$refs.upload.submit();
      this.$refs["upload"].submit();
    },
    handleRemove() {
      this.fileList = [];
    },
    handleSuccess() {
      this.$message.success("上传成功");
    },
    handleError(err) {
      this.$message.error(err);
    },
    handleExceed() {
      this.$message.warning("当前上传文件的数量限制为1");
    },
    httpRequest(param) {
      const fileObj = param.file;
      const formData = new FormData();
      formData.append("file", fileObj);
      console.log(fileObj);
      this.axios
        .post("/api/upload/students", formData, {
          headers: { "Content-type": "multipart/form-data" }
        })
        .then(res => {
          this.$refs.upload.clearFiles();
          this.$message.success("添加成功");
          this.getStudent();
          this.uploadStudentVisible = false;
        })
        .catch(err => {
          this.$refs.upload.clearFiles();
          this.$message.error(`添加失败，请检查模板格式`);
        });
    },
    //其他
    showUpdate(row) {
      this.updateForm.id = row.id;
      this.updateForm.sno = row.sno;
      this.updateForm.studentClass = row.studentClass;
      this.updateForm.studentName = row.studentName;
      this.updateStudentVisible = true;
    },
    showDelete(row) {
      this.delStudentVisible = true;
      this.delStudentId = row.id;
    },
    showDeleteMany() {
      if (this.selectedStudents.length === 0) {
        this.$message({ message: "请选择需要删除的学生", type: "warning" });
      } else {
        this.delManyStudentVisible = true;
      }
    },
    getStudent() {
      this.axios
        .get("/api/student")
        .then(res => {
          this.students = res.data;
        })
        .catch(err => {
          this.$message.error(`获取失败:${err.message}`);
        });
    },
    addStudent() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          const { sno, studentClass, studentName } = this.addForm;
          this.axios
            .post("/api/student", { sno, studentClass, studentName })
            .then(res => {
              this.$message({ message: "添加成功", type: "success" });
              this.getStudent();
              this.addStudentVisible = false;
            })
            .catch(err => {
              this.$message.error(`添加失败:${err.message}`);
            });
        }
      });
    },
    updateStudent() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          const { sno, studentClass, studentName } = this.updateForm;
          this.axios
            .put(`/api/student/${this.updateForm.id}`, {
              sno,
              studentClass,
              studentName
            })
            .then(res => {
              this.$message({ message: "修改成功", type: "success" });
              this.getStudent();
              this.updateStudentVisible = false;
            })
            .catch(err => {
              this.$message.error(`更新失败:${err.message}`);
            });
        }
      });
    },
    deleteStudent() {
      this.axios
        .delete(`/api/student/${this.delStudentId}`)
        .then(res => {
          this.$message({ message: "删除成功", type: "success" });
          this.getStudent();
          this.delStudentVisible = false;
        })
        .catch(err => {
          this.$message.error(`删除失败:${err.message}`);
        });
    },
    deleteManyStudent() {
      this.axios
        .delete("/api/student", { data: { ids: this.selectedStudentsId } })
        .then(res => {
          this.getStudent();
          this.delManyStudentVisible = false;
          this.$message.success("删除成功");
        })
        .catch(err => {
          this.$message.error(`删除失败:${err.message}`);
        });
    }
  },
  created() {
    this.axios
      .get("/api/student")
      .then(res => {
        console.log(res);
        this.students = res.data;
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