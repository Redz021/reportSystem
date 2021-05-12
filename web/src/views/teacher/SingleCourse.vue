<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-else>
      <div class="notask-notify"
           v-if="!tasks||tasks.length===0">
        <div style="font-size: 24px;">当前课程无已发布的任务</div>
        <el-button type="text"
                   @click="showAddTask">
          <i class="el-icon-plus"></i>发布任务
        </el-button>
      </div>
      <el-container v-else>
        <el-header style="display: flex;align-items: center;">
          <el-page-header @back="goBack"
                          content="当前任务"></el-page-header>
        </el-header>
        <el-main>
          <el-select v-model="currentTerm"
                     style="margin-bottom: 10px;"
                     placeholder="选择学期"
                     @change="getTaskStudents">
            <el-option v-for="item in taskTerms"
                       :key="item"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text"
                     @click="showAddTask">
            <i class="el-icon-plus"></i>发布新任务
          </el-button>
          <div class="task-content"
               v-if="task">
            <el-card class="task-card">
              <div slot="header"
                   class="task-header">
                <span>{{task.title}}</span>
                <div>
                  <el-button type="text"
                             @click="showUpdate">
                    <i class="el-icon-edit"></i>
                    修改
                  </el-button>
                  <el-button type="text"
                             @click="delTask">
                    <i class="el-icon-delete"></i>
                    删除
                  </el-button>
                </div>
              </div>
              <div>
                内容：
                <div class="tag-group">
                  <el-tag type="info"
                          v-for="para in paras"
                          :key="para.key"
                          effect="plain"
                          style="margin-right: 5px;">
                    {{para.value}}
                  </el-tag>
                </div>
              </div>
              <div>
                备注：
                <div class="task-comment"
                     v-html="task.comment">
                  <!-- {{task.comment}} -->
                </div>
              </div>
              <div>
                <div>
                  <small>
                    发布时间：{{released}}
                  </small>
                </div>
                <div>
                  <small>
                    截止时间：{{deadline}}
                  </small>
                </div>
              </div>
            </el-card>
            <div class="reports">
              <el-tabs type="border-card">
                <el-tab-pane label="已提交">
                  <el-table stripe
                            border
                            :data="submittedStudents">
                    <el-table-column prop="sno"
                                     label="学号"></el-table-column>
                    <el-table-column prop="studentName"
                                     label="姓名"></el-table-column>
                    <el-table-column label="报告">
                      <template slot-scope="scope">
                        <el-button type="text"
                                   @click="test(scope.row)">查看</el-button>
                        <el-button type="text"
                                   disabled>{{scope.row.evaluated?'已查看':'未查看'}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="未提交">
                  <el-table stripe
                            border
                            :data="unSubmittedStudents">
                    <el-table-column prop="sno"
                                     label="学号"></el-table-column>
                    <el-table-column prop="studentName"
                                     label="姓名"></el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-main>
      </el-container>
      <el-dialog title="发布任务"
                 width="400px"
                 :visible.sync="addTaskVisible">
        <el-form :model="addForm"
                 ref="addForm"
                 :rules="rules"
                 label-position="top">
          <el-form-item label="学期"
                        prop="term">
            <el-date-picker class="year-pick"
                            value-format="yyyy"
                            v-model="startYear"
                            type="year"
                            placeholder="学年">
            </el-date-picker>
            <span> 至 {{endYear}} 学年</span>
            <el-select class="term-pick"
                       placeholder="学期"
                       v-model="term">
              <el-option label="第一学期"
                         value="第一学期"></el-option>
              <el-option label="第二学期"
                         value="第二学期"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目"
                        prop="title">
            <el-input type="text"
                      placeholder="请输入题目"
                      v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="起止时间"
                        prop="timeRange">
            <el-date-picker v-model="addForm.timeRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            style="width: 100%;"
                            @change="handleDateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注"
                        prop="comment">
            <el-input type="textarea"
                      autosize
                      v-model="addForm.comment"></el-input>
          </el-form-item>
          <el-form-item :label="'章节'+(index+1)"
                        :key="para.key"
                        :rules="{required:true,message:'内容不能为空',trigger:'blur'}"
                        :prop="'paras.'+index+'.value'"
                        v-for="(para, index) in addForm.paras">
            <el-button type="text"
                       @click.prevent="removePara(para, 'addForm')"><i class="el-icon-delete"></i>删除</el-button>
            <el-input v-model="para.value"></el-input>
          </el-form-item>
          <el-form-item style="margin: 0;">
            <el-button type="text"
                       @click="addPara('addForm')"><i class="el-icon-plus"></i>添加章节</el-button>
            <el-button type="text"
                       @click="resetForm('addForm')"><i class="el-icon-refresh-right"></i>重置</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary"
                     @click="addTask">提交</el-button>
          <el-button @click="addTaskVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改任务"
                 width="400px"
                 :visible.sync="updateTaskVisible">
        <el-form ref="updateForm"
                 :model="updateForm"
                 :rules="rules">
          <el-form-item label="题目"
                        prop="title">
            <el-input type="text"
                      placeholder="请输入题目"
                      v-model="updateForm.title"></el-input>
          </el-form-item>
          <el-form-item label="起止时间"
                        prop="timeRange">
            <el-date-picker v-model="updateForm.timeRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注"
                        prop="comment">
            <el-input type="textarea"
                      autosize
                      v-model="updateForm.comment"></el-input>
          </el-form-item>
          <el-form-item :label="'章节'+(index+1)"
                        :key="para.key"
                        :rules="{required:true,message:'内容不能为空',trigger:'blur'}"
                        :prop="'paras.'+index+'.value'"
                        v-for="(para, index) in updateForm.paras">
            <el-button type="text"
                       @click="removePara(para, 'updateForm')"><i class="el-icon-delete"></i>删除</el-button>
            <el-input v-model="para.value"></el-input>
          </el-form-item>
          <el-form-item style="margin: 0;">
            <el-button type="text"
                       @click="addPara('updateForm')"><i class="el-icon-plus"></i>添加章节</el-button>
            <el-button type="text"
                       @click="resetForm('updateForm')"><i class="el-icon-refresh-right"></i>重置</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary"
                     @click="updateTask">提交</el-button>
          <el-button @click="updateTaskVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import moment from "moment";
export default {
  name: "SingleCourse",
  components: { Loading },
  data() {
    return {
      isLoading: true,
      course: "",
      task: null,
      tasks: null,
      reports: [],
      students: [],
      addForm: {
        title: "",
        paras: [],
        comment: "",
        timeRange: [],
        term: ""
      },
      updateForm: {
        title: "",
        paras: "",
        comment: "",
        timeRange: []
      },
      rules: {
        title: { required: true, message: "请输入题目", trigger: "blur" },
        timeRange: {
          required: true,
          message: "请选择起止时间",
          trigger: "blur"
        },
        comment: { required: true, message: "请输入备注信息", trigger: "blur" },
        term: { required: true, message: "请选择学期", trigger: "change" }
      },
      addTaskVisible: false,
      updateTaskVisible: false,

      startYear: "",
      term: "",
      currentTerm: ""
    };
  },
  computed: {
    taskTerms: function() {
      return this.tasks ? this.tasks.map(item => item.term) : [];
    },
    endYear: function() {
      return this.startYear ? String(parseInt(this.startYear) + 1) : "";
    },
    submittedStudents: function() {
      return this.reports
        .filter(item => item.submitted)
        .map(item => {
          return { ...item.student, evaluated: item.evaluated };
        });
    },
    unSubmittedStudents: function() {
      return this.students.filter(
        item => !this.submittedStudents.map(item => item._id).includes(item.id)
      );
    },
    released: function() {
      return moment(this.task.released).format("yyyy-MM-DD HH:mm");
    },
    deadline: function() {
      return moment(this.task.deadline).format("yyyy-MM-DD HH:mm");
    },
    paras: function() {
      return JSON.parse(this.task.format);
    }
  },
  watch: {
    term: function() {
      if (this.startYear && this.endYear && this.term) {
        this.addForm.term = `${this.startYear}至${this.endYear}学年${this.term}`;
        console.log(this.addForm);
      }
    },
    currentTerm: function() {
      for (let item of this.tasks) {
        if (item.term === this.currentTerm) {
          this.task = item;
        }
      }
    }
  },
  methods: {
    getTaskStudents() {
      this.axios
        .get("/api/scLink/students", {
          params: { course: this.course, term: this.currentTerm }
        })
        .then(async res => {
          this.students = res.data;
          const reports = await this.axios.get(
            `/api/report/task/${this.task.id}`
          );

          this.reports = reports.data;
          console.log(this.reports, this.students);
        })
        .catch(err => console.error(err));
    },
    goBack() {
      this.$router.back();
    },
    test(student) {
      let report = this.reports.filter(
        item => item.student._id === student._id
      )[0].id;
      this.$router.push({ name: "TeacherReport", params: { id: report } });
    },
    showUpdate() {
      this.updateForm.title = this.task.title;
      this.updateForm.paras = [...this.paras];
      this.updateForm.comment = this.task.comment;
      this.updateForm.timeRange = [
        new Date(this.task.released),
        new Date(this.task.deadline)
      ];
      this.updateTaskVisible = true;
    },
    delTask() {
      this.axios
        .delete(`/api/task/${this.task.id}`)
        .then(res => {
          this.getTask();
          this.$message.success("删除成功");
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateTask() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          this.axios
            .put(`/api/task/${this.task.id}`, {
              course: this.course,
              title: this.updateForm.title,
              format: JSON.stringify(this.updateForm.paras),
              comment: this.updateForm.comment,
              released: this.updateForm.timeRange[0],
              deadline: this.updateForm.timeRange[1]
            })
            .then(res => {
              this.getTask();
              this.$message.success("修改成功");
              this.updateTaskVisible = false;
              console.log(res);
            })
            .catch(err => {
              this.$message.error(`修改时发生错误:${err}`);
              console.error(err);
            });
        }
      });
    },
    getTask() {
      this.axios
        .get("/api/task", { params: { course: this.course } })
        .then(res => {
          this.tasks = res.data;
          this.task = null;
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addTask() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let data = {};
          data["course"] = this.course;
          data["title"] = this.addForm.title;
          data["format"] = JSON.stringify(this.addForm.paras);
          data["comment"] = this.addForm.comment;
          data["released"] = this.addForm.timeRange[0];
          data["deadline"] = this.addForm.timeRange[1];
          data["term"] = this.addForm.term;
          this.axios
            .post("/api/task", data)
            .then(res => {
              this.getTask();
              this.addTaskVisible = false;
              this.$message.success("发布成功");
              console.log(res);
            })
            .catch(err => {
              console.error(err);
            });
        }
      });
    },
    addPara(formName) {
      this[formName].paras.push({ value: "", key: Date.now() });
    },

    removePara(item, formName) {
      let index = this[formName].paras.indexOf(item);
      if (index !== -1) {
        this[formName].paras.splice(index, 1);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    showAddTask() {
      this.addTaskVisible = true;
    },
    handleDateChange() {
      console.log(this.addForm.timeRange);
    }
  },
  created() {
    this.course = this.$route.params.id;
    this.axios
      .get("/api/task", { params: { course: this.course } })
      .then(res => {
        console.log(res.data);
        this.tasks = res.data;
        // const students = await this.axios.get(
        //   `/api/scLink/student/${this.course}`
        // );
        // this.students = students.data;

        // if (this.task) {
        //   const reports = await this.axios.get(
        //     `/api/report/task/${this.task.id}`
        //   );

        //   this.reports = reports.data;
        //   console.log(this.reports, this.students);
        // }
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style lang="less" scoped>
.notask-notify {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-comment {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 300px;
  padding: 10px;
  margin: 10px 0;
  overflow: scroll;
}
.task-content {
  display: flex;
  flex-wrap: wrap;
}
.tag-group {
  margin: 10px 0;
}
.task-card {
  min-width: 350px;
  flex: 1;
}
.reports {
  min-width: 600px;
  flex: 2;
  // border: 1px solid #ddd;
}
.year-pick {
  max-width: 30%;
}
.term-pick {
  max-width: 35%;
  margin-left: 10%;
}
</style>