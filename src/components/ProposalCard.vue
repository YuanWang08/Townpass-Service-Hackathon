<template>
  <div class="shadow-md rounded-lg overflow-hidden" style="background-image: url(../assets/rabbit.jpg); background-size: cover; background-position: center;">
    <div class="p-4 flex flex-col">
      <!-- 第一行 -->
      <div class="flex">
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
      </div>
      <!-- 第二行 -->
      <div class="flex">
        <p class="text-sm text-gray-600 font-bold">{{ formattedSubmitTime }}</p>
        <div class="ml-auto flex">
          <span class="mb-1 mr-2 text-sm font-bold">👍{{ likeCount }}</span>
          
          <span class="text-sm font-bold">👀{{ viewCount }}</span>
        </div>
      </div>
      <!-- 第三行 -->
      <div class="flex flex-row">
        <p class="text-sm font-bold">{{ district }}</p>
        <span :class="statusClass" class="ml-auto text-sm font-bold">
          <span v-if="status === '已回應'" class="mr-1">✔️</span>
          <span v-if="status === '未回應'" class="mr-1">❌</span>
          {{ status }}
        </span>
      </div>
      
      <!-- Expand/Collapse Button -->
      <div class="flex-none mt-2 sm:mt-0 ml-auto">
        <button 
          @click="toggleDetails" 
          class="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
        <svg v-if="detailsVisible" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          
        </button>
      </div>
    </div>

    <!-- Address Detail and Proposal Content -->
    <div v-if="detailsVisible" class="p-4 text-sm font-bold text-gray-800">
      <p class="mb-2">詳細地址： {{ addressDetail }}</p>
      <p class="mb-2">詳細內容： {{ content }}</p>
      <p>未來效益： {{ affect }}</p>
    </div>

    <!-- View Link -->
    <div class="p-4 border-t text-center">
      <router-link :to="`/proposal/${proposalId}`" class="text-blue-600 hover:text-blue-800 text-sm">查看詳情</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    district: String,
    li: String,
    addressDetail: String,
    content: String,
    status: String,
    submitTime: String,
    viewCount: Number,
    likeCount: Number,
    proposalId: Number,
    affect: String,
    district: String,
  },
  data() {
    return {
      detailsVisible: false,
    };
  },
  computed: {
    statusClass() {
      return {
        'text-red-600': this.status === '未回應',
        'text-green-600': this.status === '已回應'
      };
    },
    formattedSubmitTime() {
      return this.submitTime.split('T')[0]; // 只取日期部分
    },
  },
  methods: {
    toggleDetails() {
      this.detailsVisible = !this.detailsVisible;
    }
  }
}
</script>

<style scoped>
/* 自定义样式 */
</style>
