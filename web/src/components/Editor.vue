<template>
  <div class="editor">
    <div class="toolbar"
         ref="toolbar"></div>
    <div class="text"
         ref="editor"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "Editor",
  data() {
    return {
      editor: null,
      info_: null,
      content: ""
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    }
  },
  mounted() {
    this.editor = new E(this.$refs["toolbar"], this.$refs["editor"]);
    this.editor.config.onchangeTimeout = 1000;
    this.editor.config.onchange = html => {
      this.content = html;
      this.$emit("change", this.content);
    };
    this.editor.config.menus = [
      "image", // 插入图片
      "undo", // 撤销
      "redo" // 重复
    ];
    this.editor.config.uploadImgServer =
      "http://localhost:3000/api/public/image";
    this.editor.config.uploadImgAccept = ["jpg", "jpeg", "png"];
    this.editor.config.uploadImgMaxLength = 1;
    this.editor.config.uploadImgHeaders = {
      Authorization: this.$store.state.token
    };
    this.editor.config.uploadFileName = "image";
    this.editor.config.uploadImgHooks = {
      // 上传图片之前
      before: function(xhr) {
        console.log(xhr);

        // 可阻止图片上传
        // return {
        //   prevent: true,
        //   msg: "需要提示给用户的错误信息"
        // };
      },
      // 图片上传并返回了结果，图片插入已成功
      success: function(xhr) {
        console.log("success", xhr);
      },
      // 图片上传并返回了结果，但图片插入时出错了
      fail: function(xhr, editor, resData) {
        console.log("fail", resData);
      },
      // 上传图片出错，一般为 http 请求的错误
      error: function(xhr, editor, resData) {
        console.log("error", xhr, resData);
      },
      // 上传图片超时
      timeout: function(xhr) {
        console.log("timeout");
      },
      // 图片上传并返回了结果，想要自己把图片插入到编辑器中
      // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
      customInsert: function(insertImgFn, result) {
        // result 即服务端返回的接口
        console.log("customInsert", result);

        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        insertImgFn(result.data[0]);
      }
    };
    this.editor.config.showLinkImg = false;
    // this.editor.config.uploadImgShowBase64 = true;
    this.editor.config.zIndex = 1;
    this.editor.create();
    this.editor.txt.html(this.value);
  }
};
</script>
<style lang="less" scoped>
.toolbar {
  background-color: #f1f1f1;
  border-top: 1px solid rgb(231, 231, 231);
  border-left: 1px solid rgb(231, 231, 231);
  border-right: 1px solid rgb(231, 231, 231);
}
.text {
  border: 1px solid rgb(231, 231, 231);
  height: 200px;
}
</style>