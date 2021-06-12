<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-if="!isLoading"
                  class="main-content">
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
          <el-table-column prop="teacherName"
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
               :visible.sync="addCourseVisible"
               :close-on-click-modal="false">
      <el-form :model="addForm"
               ref="addForm"
               label-position="top"
               :rules="rules">
        <el-form-item label="课程号"
                      prop="cno">
          <el-input v-model="addForm.cno"></el-input>
        </el-form-item>
        <el-form-item label="课程名"
                      prop="courseName">
          <el-input v-model="addForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程图片">
          <el-upload ref="courseImage"
                     :action="uploadUrl"
                     :http-request="httpRequest"
                     class="cover-uploader"
                     :show-file-list="false"
                     :on-success="handleCoverSuccess"
                     :before-upload="beforeCoverUpload">
            <img v-if="addForm.courseImage"
                 :src="addForm.courseImage"
                 class="cover">
            <i v-else
               class="el-icon-plus cover-uploader-icon"></i>
          </el-upload>
          <el-button type="text"
                     v-if="addForm.courseImage"
                     @click="deleteImage('addForm')">
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </el-form-item>
        <el-form-item label="授课教师">
          <el-table stripe
                    border
                    :data="teachers"
                    max-height="300"
                    @selection-change="addTeacherChange">
            <el-table-column type="selection"
                             width="50"></el-table-column>
            <el-table-column property="tno"
                             label="工号"></el-table-column>
            <el-table-column property="teacherName"
                             label="姓名"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addCourseVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addCourse">确定</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="删除"
               width="400px"
               :visible.sync="delCourseVisible"
               :close-on-click-modal="false">
      <span>确定要删除吗？</span>
      <span slot="footer">
        <el-button @click="delCourseVisible = false">取消</el-button>
        <el-button type="danger"
                   @click="deleteCourse">确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑"
               width="400px"
               :visible.sync="updateCourseVisible">
      <el-form :model="updateForm"
               ref="updateForm"
               label-position="top"
               :rules="rules">
        <el-form-item label="课程号"
                      prop="cno">
          <el-input v-model="updateForm.cno"></el-input>
        </el-form-item>
        <el-form-item label="课程名"
                      prop="courseName">
          <el-input v-model="updateForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程图片">
          <el-upload ref="courseImageUpload"
                     :action="uploadUrl"
                     :http-request="httpRequestUpdate"
                     class="cover-uploader"
                     :show-file-list="false"
                     :on-success="handleCoverSuccess"
                     :before-upload="beforeCoverUpload">
            <img v-if="updateForm.courseImage"
                 :src="updateForm.courseImage"
                 class="cover">
            <i v-else
               class="el-icon-plus cover-uploader-icon"></i>
          </el-upload>
          <el-button type="text"
                     v-if="updateForm.courseImage"
                     @click="deleteImage('updateForm')">
            <i class="el-icon-delete"></i>
            删除
          </el-button>
        </el-form-item>
        <el-form-item label="授课教师">
          <el-table ref="teacherTable"
                    stripe
                    border
                    :data="teachers"
                    max-height="300"
                    @select="updateTeacherChange">
            <el-table-column type="selection"
                             width="50"></el-table-column>
            <el-table-column property="tno"
                             label="工号"></el-table-column>
            <el-table-column property="teacherName"
                             label="姓名"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="updateCourseVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="updateCourse">确定</el-button>
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
        teacher: "",
        courseImage: ""
      },
      updateForm: {
        id: "",
        cno: "",
        courseName: "",
        year: "",
        courseImage: ""
      },
      rules: {
        cno: [{ required: true, message: "请输入课程号", trigger: "blur" }],
        courseName: [
          { required: true, message: "请输入课程名", trigger: "blur" }
        ],
        year: [{ required: true, message: "请选择学年", trigger: "blur" }],
        teacher: [
          { required: true, message: "请选择授课教师", trigger: "change" }
        ]
      },
      uploadUrl: "http://localhost:3000/api/public/image"
    };
  },
  created() {
    this.axios
      .get("/api/course")
      .then(res => {
        this.courses = res.data;
        for (let item of this.courses) {
          let names = "";
          for (let teacher of item.teacher) {
            names += teacher.teacherName + " ";
          }
          item.teacherName = names;
        }
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
    deleteImage(form) {
      // this.$refs["courseImage"].clearFiles();
      const image = this[form].courseImage.match(/\d*\.jpg/)[0];
      this.axios
        .delete(`/api/public/image/${image}`)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
      this[form].courseImage = "";
    },
    httpRequest(param) {
      const image = param.file;
      const formData = new FormData();
      formData.append("image", image);
      this.axios
        .post(this.uploadUrl, formData, {
          headers: { "content-type": "multipart/form-data" }
        })
        .then(res => {
          // console.log(res);
          this.addForm.courseImage = res.data.data[0];
        })
        .catch(err => {
          console.error(err);
          this.$message.error("上传失败");
        });
    },
    httpRequestUpdate(param) {
      const image = param.file;
      const formData = new FormData();
      formData.append("image", image);
      this.axios
        .post(this.uploadUrl, formData, {
          headers: { "content-type": "multipart/form-data" }
        })
        .then(res => {
          this.updateForm.courseImage = res.data.data[0];
        })
        .catch(err => {
          console.error(err);
          this.$message.error("上传失败");
        });
    },
    handleCoverSuccess(res, file) {
      // this.addForm.courseImage = URL.createObjectURL(file.raw);
    },
    beforeCoverUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    addTeacherChange(val) {
      this.addForm.teacher = val.map(item => item.id);
      console.log(this.addForm);
    },
    updateTeacherChange(val, row) {
      this.updateForm.teacher = val.map(item => item.id);
    },
    showUpdate(row) {
      this.updateForm.id = row.id;
      this.updateForm.cno = row.cno;
      this.updateForm.courseName = row.courseName;
      this.updateForm.teacher = row.teacher.map(item => item._id);
      this.updateForm.courseImage = row.courseImage;
      this.updateCourseVisible = true;
      console.log(this.updateForm);
      this.$nextTick(function() {
        this.$refs["teacherTable"].clearSelection();
        for (let item of this.teachers) {
          if (this.updateForm.teacher.includes(item.id)) {
            this.$refs["teacherTable"].selection.push(item);
          }
        }
      });
      console.log(this.updateForm);
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
          for (let item of this.courses) {
            let names = "";
            for (let teacher of item.teacher) {
              names += teacher.teacherName + " ";
            }
            item.teacherName = names;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    addCourse() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          const { cno, courseName, teacher, courseImage } = this.addForm;
          if (!teacher) {
            this.$message({ message: "请选择授课教师", type: "warning" });
          } else {
            this.axios
              .post("/api/course", { cno, courseName, teacher, courseImage })
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
          const { cno, courseName, courseImage, teacher } = this.updateForm;
          if (!teacher) {
            this.$message({ message: "请选择授课教师", type: "warning" });
          } else {
            this.axios
              .put(`/api/course/${this.updateForm.id}`, {
                cno,
                courseName,
                courseImage,
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
.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
}
.cover-uploader:hover {
  border-color: #409eff;
}
.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.cover {
  width: 178px;
  height: 178px;
  display: block;
}
.main-content {
  max-width: 1200px;
  min-width: 800px;
  margin: auto;
}
</style>