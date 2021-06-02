<template>
  <div>
    <Loading v-if="isLoading"></Loading>
    <el-container v-else
                  class="main-content">
      <el-backtop></el-backtop>
      <el-header style="display: flex; align-items: center;">
        <el-page-header @back="goBack"
                        :content="task.title"></el-page-header>
      </el-header>
      <el-main>
        <div>{{report.student.studentClass}} {{report.student.studentName}} {{report.student.sno}}</div>
        <el-divider></el-divider>
        <div v-for="para in paras"
             :key="para.key">
          <div class="report-title">{{para.value}}</div>
          <div class="report-content"
               v-html="content[para.key]">
          </div>
        </div>
        <el-divider></el-divider>
        <table class="score-table">
          <tr>
            <th colspan="2">考核项目</th>
            <th colspan="3">评价内容及评分标准</th>
            <th>得分</th>
          </tr>
          <tr>
            <td rowspan="2">平时（15分）</td>
            <td>考勤（10分）</td>
            <td colspan="3">考核能否按时出勤，未出勤一次扣1分，态度不端每次扣0.5分</td>
            <td>
              {{score.common.attendance}}
            </td>
          </tr>
          <tr>
            <td>工作量（5分）</td>
            <td>工作量饱满（占总40%以上）（5）</td>
            <td>工作量一般（占总26%- 39%）（3-4）</td>
            <td>工作量较少（占总25%以下）（0-2）</td>
            <td>
              {{score.common.workload}}
            </td>
          </tr>
          <tr>
            <td rowspan="4">功能设计及实现（40分）</td>
            <td>结构设计（10分）</td>
            <td>功能及类结构设计齐全且合理，有创新（9-10）</td>
            <td>功能及类结构设计达到要求（6-8）</td>
            <td>功能及类结构设计一般，且有不足（0-5）</td>
            <td>
              {{score.designAndImplement.structure}}
            </td>
          </tr>
          <tr>
            <td>功能实现（20分）</td>
            <td>实现全部功能，有创新（18-20）</td>
            <td>实现基本功能（12-17）</td>
            <td>功能实现少，结果未达标（0-11）</td>
            <td>
              {{score.designAndImplement.implement}}
            </td>
          </tr>
          <tr>
            <td>功能测试（5分）</td>
            <td>测试样例完全正确，符合设计目标（5）</td>
            <td>个别测试样例不正确（3-4）</td>
            <td>系统有bug（0-2）</td>
            <td>
              {{score.designAndImplement.test}}
            </td>
          </tr>
          <tr>
            <td>代码规范（5分）</td>
            <td>代码规范好（注释、缩进格式、语法）（5）</td>
            <td>代码一般规范（注释、缩进格式、语法）（3-4）</td>
            <td>代码规范较差（注释、缩进格式、语法）（0-2）</td>
            <td>
              {{score.designAndImplement.standard}}
            </td>
          </tr>
          <tr>
            <td rowspan="3">答辩表述与回答（25分）</td>
            <td>设计方案理解（10分）</td>
            <td>对需求和设计结构理解透彻（9-10）</td>
            <td>对需求和设计结构较为理解（6-8）</td>
            <td>对需求和设计结构不理解或完全不理解（0-5）</td>
            <td>
              {{score.answer.project}}
            </td>
          </tr>
          <tr>
            <td>自述（5分）</td>
            <td>陈述流利，思维清晰，逻辑性强（5）</td>
            <td>车数比较流利，思维比较清晰，逻辑性较强（3-4）</td>
            <td>陈述一般，思维有些凌乱（0-2）</td>
            <td>
              {{score.answer.description}}
            </td>
          </tr>
          <tr>
            <td>问题回答（10分）</td>
            <td>程序演示流畅，对自己负责部分的代码熟悉（9-10）</td>
            <td>程序演示比较流畅，对自己负责部分的代码比较熟悉（6-8）</td>
            <td>程序可以演示，对自己负责部分的代码不够熟悉（0-5）</td>
            <td>
              {{score.answer.reply}}
            </td>
          </tr>
          <tr>
            <td rowspan="4">报告质量（20分）</td>
            <td>用词严谨，行文流畅（8分）</td>
            <td>对需求、功能设计、实现过程表述清楚，体会认真（7-8）</td>
            <td>对需求、功能设计、实现过程表述较清楚，体会比较认真（4-6）</td>
            <td>对需求、功能设计、实现过程表述含糊、晦涩、体会少（0-3）</td>
            <td>
              {{score.report.syntax}}
            </td>
          </tr>
          <tr>
            <td>格式、排版规范（4分）</td>
            <td>格式和排版符合规范（4）</td>
            <td>格式和排版一般规范（2-3）</td>
            <td>格式和排版不规范（0-1）</td>
            <td>
              {{score.report.format}}
            </td>
          </tr>
          <tr>
            <td>图、表规范（4分）</td>
            <td>图、表描述符合规范（4）</td>
            <td>图、表描述一般规范（2-3）</td>
            <td>图、表描述不规范（0-1）</td>
            <td>
              {{score.report.chart}}
            </td>
          </tr>
          <tr>
            <td>结构合理（4分）</td>
            <td>结构合理、条理清晰（4）</td>
            <td>结构合理、条理一般（2-3）</td>
            <td>结构不合理、条理不清晰（0-1）</td>
            <td>
              {{score.report.reasonable}}
            </td>
          </tr>
          <tr>
            <td colspan="2">指导教师签字</td>
            <td></td>
            <td></td>
            <td>总成绩</td>
            <td>{{totalScore}}</td>
          </tr>
        </table>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import Loading from "@/components/Loading.vue";

export default {
  name: "StudentReport",
  components: { Loading },
  data() {
    return {
      isLoading: true,
      id: "",
      report: null,
      task: null,
      content: {},
      score: {}
    };
  },
  created() {
    this.id = this.$route.params.id;
    console.log(this.id);
    this.axios
      .get(`/api/report/id/${this.id}`)
      .then(res => {
        console.log(res);
        this.report = res.data;
        this.task = this.report.task;
        this.content = JSON.parse(this.report.content);
        this.score = JSON.parse(this.report.score);
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
      });
  },
  computed: {
    paras: function() {
      return this.task ? JSON.parse(this.task.format) : [];
    },
    totalScore: function() {
      return (
        this.score.common.attendance +
        this.score.common.workload +
        this.score.designAndImplement.structure +
        this.score.designAndImplement.implement +
        this.score.designAndImplement.test +
        this.score.designAndImplement.standard +
        this.score.answer.project +
        this.score.answer.description +
        this.score.answer.reply +
        this.score.report.syntax +
        this.score.report.format +
        this.score.report.chart +
        this.score.report.reasonable
      );
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  }
};
</script>
<style lang="less" scoped>
.report-title {
  font-size: 24px;
  margin: 10px 0;
}
.report-content {
  border: 1px solid #bbbbbb;
  border-radius: 4px;
  background: #fafafa;
  padding: 20px 10px;
}
.mark-part {
  display: flex;
  .mark {
    width: 200px;
    margin: 10px 0;
  }
  .comment {
    flex: 1;
    margin: 10px 0;
    margin-left: 10px;
  }
}
.score-table {
  margin-top: 50px;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid black;
    text-align: center;
    padding: 10px 5px;
  }
}
.main-content {
  max-width: 1200px;
  min-width: 800px;
  margin: auto;
}
</style>