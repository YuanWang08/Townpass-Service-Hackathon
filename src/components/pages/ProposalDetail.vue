<template>
  <div class="main-container">
    <div class="bg-[#93d4df] shadow-md rounded-lg overflow-hidden p-6">

      <!-- 標題和提交時間 -->
      <div class="mb-4">
        <h2 class="text-3xl font-semibold text-gray-800 mb-2 justify-start">{{ proposal.proposal_title }}</h2>

        <!-- 加一條細線 -->
        <div class="border-[1px] border-white my-2"></div>

        <!-- Add the photo -->
         <div v-if="!!proposal.photo" class="my-4">
          <img class="h-auto w-full" :src="proposal.photo" alt="proposal photo">
         </div>

        <!-- 提交人 -->
        <div class="text-sm font-bold mb-4 justify-start">
          <p>🙎‍♂️ 提交人: {{ proposal.submit_user }}</p>
        </div>

        <p class="text-sm font-bold justify-start">🕜 提交時間：{{ formattedSubmitTime }}</p>
      </div>

      <!-- 區域和里 -->
      <div class="mb-4 font-bold text-sm justify-start">
        <p>📫 區域：{{ proposal.district }} {{ proposal.li }}</p>
      </div>
      
      <!-- 詳細地址 -->
      <div class="mb-4 font-bold text-sm justify-start">
        <p> 📍  詳細地址：{{ proposal.address_detail }}</p>
      </div>
      
      <!-- 提案內容和影響 -->
      <div class="mb-4 font-bold text-sm justify-start">
        <p class="mb-2">📃 提案內容：{{ proposal.proposal_content }}</p>
        <p>🚩 未來效益：{{ proposal.proposal_affect }}</p>
      </div>

      <!-- 狀態、瀏覽次數和讚數 -->
      <div class="flex items-center space-x-4 font-bold text-sm mb-4">
        <span :class="statusClass" class="font-bold">
          <span v-if="proposal.proposal_status === '已回應'" class="mr-1">✔️</span>
          <span v-else-if="proposal.proposal_status === '未回應'" class="mr-1">❌</span>
          <span v-else class="mr-1">💬</span> 
          {{ proposal.proposal_status }}
        </span>
        <span class="font-bold">👍{{ proposal.like_count }}</span>
        <span class="font-bold">👀{{ proposal.view_count }}</span>
      </div>

      <!-- 進度條  -->
      <div class="flex justify-between w-full rounded-up bg-gray-300 h-4 mb-2">
        <div v-if="proposal.like_count <= 200" class="rounded-up bg-red-500 h-4" :style="{ width: percentageTarget + '%'}"></div>
        <div v-else-if="proposal.like_count <= 400" class="rounded-up bg-yellow-500 h-4" :style="{ width: percentageTarget + '%' }"></div>
        <div v-else class="rounded-up bg-green-500 h-4" :style="{ width: percentageTarget + '%' }"></div>
      </div>

      <!-- 支持和不支持的按鈕 置中-->
      <div class="flex items-center justify-center space-x-4 font-bold text-sm ">
        <button @click="isSupported" :class="!isSupport ? 'bg-[#76a732]' : 'bg-gray-500'" class= "text-white px-4 py-2 rounded ">{{ isSupport ? '已支持' : '支持' }}</button>
      </div>

    </div>

    <!-- gap between two area -->
    <div class="h-4"></div>

    <!-- 市政回應 -->
    <div v-if="proposal_status==='已回應'" class="bg-[#4871a0] shadow-md rounded-lg overflow-hidden p-6 ">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">✏️ 市政回應</h3>
      
  
    </div>

    <!-- gap between two area -->
    <div class="h-4"></div>

    <!-- add your own comment-->
    <div class="bg-[#f0c87c] shadow-md rounded-lg overflow-hidden p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">✏️ 新增你的評論</h3>
      <textarea class="w-full p-2 border border-gray-300 rounded-md" rows="4" placeholder="請輸入你的評論" v-model="newCommentContent"></textarea>
      <div class="flex justify-center">
      <button @click="addComment" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">提交</button>
      </div>
    </div>

    <!-- gap between two area -->
    <div class="h-4"></div>

    <!-- 評論列表 -->
    <div class="bg-[#ad7b2b] shadow-md rounded-lg overflow-hidden p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">🐳 評論列表</h3>
      <div v-for="(comment) in comments" :key="comment.comment_id" class="mb-4 border-2 border-gray-300 rounded-md p-2 bg-[#ffffff]">
        <p class="text-sm font-bold my-1">提交人: {{ comment.comment_user }}</p>
        <p class="text-sm font-bold my-1">評論: {{ comment.comment_content }}</p>
        <p class="text-sm font-bold my-1">時間: {{ formattedCommentTime(comment.comment_time) }}</p>
      </div>
    </div>

    <!-- 返回按鈕 -->
    <div class="mt-6 text-center">
      <button @click="goBack" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        返回提案列表
      </button>
    </div>
  </div>
</template>

<script>
import { getCommentsByProposalId, getProposalById, createComment, incrementLikeCount, incrementViewCount } from '../../api/api.js';
import data from './people.json';


export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      proposal: {
        proposal_id: "",
        proposal_title: "",
        district: "",
        li: "",
        address_detail: "",
        photo: "",
        proposal_content: "",
        proposal_affect: "",
        proposal_status: "",
        submit_time: "",
        submit_user: "",
        view_count: 0,
        like_count: 0
      },
      comments: [],
      newCommentContent: '',
      people: data,
      isSupport: false,
    };
  },
  computed: {
    statusClass() {
      return {
        'text-red-600': this.proposal.proposal_status === '未回應',
        'text-green-600': this.proposal.proposal_status === '已回應'
      }
    },
    formattedSubmitTime() {
      return this.proposal.submit_time.split('T')[0]; // 只取日期部分
    },
    targetPeople() {
      if (this.district in this.people) {
        return parseInt(parseInt(this.people[this.district]));
      } else {
        return 2000;
      }
    },
    percentageTarget() {
      return this.proposal.like_count / 6;
    }
  },
  async created() {
    await this.fetchProposal();
  },
  async mounted() {
    await this.getComment();
  },
  mounted() {
    this.incrementViewCount(this.$route.params.id);
  },
  methods: {
    async fetchProposal() {
      // 這裡應該使用實際的 API 調用來獲取提案詳情
      // 以下為模擬數據
      this.proposal = await getProposalById(this.$route.params.id);
    },
    async incrementViewCount(){
      await incrementViewCount(this.$route.params.id);
    },
    formattedCommentTime(commentTime) {
      if (typeof commentTime === 'string') {
        return commentTime.split('T')[0]; // 只取日期部分
      }
      return ''; // 如果不是字串，返回空字串
    },
    goBack() {
      this.$router.push('/proposal');
    },
    async isSupported(){
      if (this.isSupport === false) {
        this.proposal.like_count++;
        await incrementLikeCount(this.$route.params.id);
      }
      this.isSupport = true;
    },
    async getComment() {
      this.comments = await getCommentsByProposalId(this.$route.params.id);
    },
    async addComment() {
      if (!!this.newCommentContent) {
        await createComment({
          proposal_id: this.$route.params.id,
          comment_user: '匿名',
          comment_content: this.newCommentContent,
          comment_time: new Date().toISOString()
        });
        await this.getComment();
        this.newCommentContent = '';
      }
    }
  }
}
</script>

<style scoped>
.main-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>