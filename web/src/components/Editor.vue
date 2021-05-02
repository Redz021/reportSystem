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