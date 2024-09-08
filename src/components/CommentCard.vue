<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">

  </div>
</template>

<script>
export default {
  props: {
    commentId: Number,
    proposalId: Number,
    comment_user: String,
    comment_content: String,
    comment_time: String,
  },
  data() {
  },
  computed: {
    statusClass() {
      return {
        'text-red-600': this.status === '未回應',
        'text-green-600': this.status === '已回應'
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>
/* 自定义样式 */
</style>
