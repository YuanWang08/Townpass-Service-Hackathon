<template>
  <body class="bg-[#EDF8FA] border-[#22474E] border-4">
  <div class="submit-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">提交新提案</h1>
      <button @click="goBack" class="text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
  </div>
  
    <form @submit.prevent="submitProposal" class="space-y-4">
      <div>
        <label for="title" class="block mb-1">標題</label>
        <input v-model="proposal.title" id="title" type="text" required class="w-full p-2 rounded shadow-sm border-[#22474E] border-2">
      </div>
      <div>
        <label for="district" class="block mb-1" >區域</label>
        <select v-model="proposal.district" id="district" required class="w-full p-2 border-[#22474E] border-2 rounded shadow-sm">
          <option disabled value="">請選擇區域</option>
          <option value="北投區">北投區</option>
          <option value="士林區">士林區</option>
          <option value="中山區">中山區</option>
          <option value="內湖區">內湖區</option>
          <option value="大同區">大同區</option>
          <option value="松山區">松山區</option>
          <option value="萬華區">萬華區</option>
          <option value="中正區">中正區</option>
          <option value="大安區">大安區</option>
          <option value="信義區">信義區</option>
          <option value="南港區">南港區</option>
          <option value="文山區">文山區</option>
        </select>
      </div>
      <div>
        <label for="addressDetail" class="block mb-1">詳細地址</label>
        <input v-model="proposal.addressDetail" id="addressDetail" type="text" required class="w-full p-2 border-[#22474E] border-2 rounded shadow-sm">
      </div>
      <div>
        <label for="content" class="block mb-1">提案內容</label>
        <textarea v-model="proposal.content" id="content" rows="4" required class="w-full p-2 border-[#22474E] border-2 rounded shadow-sm"></textarea>
      </div>
      <div>
        <label for="photo" class="block mb-1">附加照片</label>
        <input type="file" @change="handleFileChange" accept="image/*">
      </div>
      <div>
        <label for="affect" class="block mb-1">未來效益</label>
        <textarea v-model="proposal.proposal_affect" id="affect" rows="2" type="text" class="w-full p-2 border-[#22474E] border-2 rounded shadow-sm"></textarea>
      </div>
      <div>
        <label for="submitUser" class="block mb-1">提交者</label>
        <input v-model="proposal.submit_user" id="submitUser" type="text" class="w-full p-2 border-[#22474E] border-2 rounded shadow-sm">
      </div>
      <div class="flex justify-center mt-4">
        <button type="submit" @click="submitProposal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ease-out duration-75">提交提案</button>
        <button type="button" @click="clearForm" class="ml-4 text-gray-600 hover:text-gray-800 transition ease-out duration-75">取消輸入</button>
      </div>
    </form>
  </div>
</body>
</template>

<script>
import { createProposal } from '../../api/api.js';

export default {
  data() {
    return {
      proposal: {
        title: '',
        district: '',
        addressDetail: '',
        content: '',
        proposal_affect: '',
        submit_user: '',
      },
      selectedFile: null,
      isSubmit: false
    }
  },
  methods: {
    goBack() {
      // 返回上一頁
      this.$router.go(-1);
    },
    clearForm() {
      this.proposal = {
        district: "",
        title: "",
        addressDetail: "",
        content: "",
        proposal_affect: '',
        submit_user: ''
      }
      this.selectedFile = null;
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.selectedFile = file;
    },
    async submitProposal() {
      this.errors = {}; // 重置錯誤

      // 檢查必填欄位
      if (!this.proposal.district) {
        this.errors.district = "區域為必填項";
      }
      if (!this.proposal.title) {
        this.errors.title = "提案標題為必填項";
      }



      // 如果沒有錯誤，提交表單
      if (Object.keys(this.errors).length === 0 && this.isSubmit === false) {
        // alert('表單已提交')
        // 執行提交邏輯
        this.isSubmit = true;
        await createProposal({
          proposal_title: this.proposal.title,
          proposal_content: this.proposal.content,
          address_detail: this.proposal.addressDetail,
          district: this.proposal.district,
          proposal_affect: this.proposal.proposal_affect,
          submit_time: new Date().toISOString(),
          submit_user: this.proposal.submit_user,
          view_count: '0',
          like_count: '0',
          proposal_status: '未回應'
          // 未回應 進行中 已回應
        }, this.selectedFile)

        this.clearForm();
        
        console.log("表單已提交", this.proposal);
        // 提交成功後跳轉到提案列表頁面
        this.$router.push('/proposal'); 
      }
    }
  }
}
</script>

<style scoped>
.submit-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

</style>
