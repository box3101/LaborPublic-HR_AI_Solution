<template>
  <div v-if="visible" class="pdf-wrapper">
    <button class="close-btn" @click="$emit('close')">닫기</button>
    <VuePdfApp ref="pdfApp"
        :pdf="src"
        :page="page"
        style="height: 90vh;"
    />
  </div>
</template>

<script>
import VuePdfApp from 'vue-pdf-app'
import 'vue-pdf-app/dist/icons/main.css'

export default {
  components: { VuePdfApp },
  props: {
    src: String,
    page: {
      type: Number,
      default: 1
    },
    visible: Boolean
  },
  mounted() {
    this.goToPageAfterLoad();
  },
  methods: {
    goToPageAfterLoad() {
      setTimeout(() => {
        const input = this.$el.querySelector('input[type="number"]');
        if (input && this.page) {
          input.value = this.page;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`[PdfViewer] goToPage via input: ${this.page}`);
        }
      }, 600); // PDF 렌더링 이후에 실행되도록 충분히 딜레이
    }
  }
}

</script>

<style scoped>
.pdf-wrapper {
  position: fixed;
  top: 30px;
  left: 5%;
  width: 90%;
  background: #fff;
  z-index: 1000;
  border: 1px solid #ccc;
  padding: 10px;
}
.close-btn {
  float: right;
  margin-bottom: 10px;
}
</style>