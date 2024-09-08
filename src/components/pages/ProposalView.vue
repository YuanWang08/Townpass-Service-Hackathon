<template>
  <div class="main-container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <!-- 搜尋欄 -->
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="搜尋提案..." />
      <button class="search-button">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- 篩選排序器 -->
    <div class="filter-sorter flex space-x-4">
      <select v-model="selectedDistrict" @change="filterProposals" class="w-full p-2 border-[#22474E] border-2 rounded shadow-sm">
        <option value="">所有區域</option>
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
      <select v-model="sortBy" @change="sortProposals" class="w-full p-2 border-[#22474E] border-2 rounded shadow-sm">
        <option value="view">按觀看數排序</option>
        <option value="like">按喜歡數排序</option>
        <option value="time">按時間排序</option> <!-- 新增的選項 -->
      </select>
    </div>

    <!-- 顯示卡片 -->
    <div class="proposal-list">
      <ProposalCard
        v-for="(proposal, index) in sortedProposals"
        :key="proposal.proposal_id"
        :proposalId="proposal.proposal_id"
        :title="proposal.proposal_title"
        :district="proposal.district"
        :li="proposal.li"
        :address-detail="proposal.address_detail"
        :content="proposal.proposal_content"
        :status="proposal.proposal_status"
        :submit-time="proposal.submit_time"
        :view-count="proposal.view_count"
        :like-count="proposal.like_count"
        :affect="proposal.proposal_affect"
        :class="{ 'bg-[#B4E2EA]': index % 2 === 0, 'bg-[#e4c480]': index % 2 !== 0 }"
        class="mb-4"
        :is-flashing="flashingId === proposal.proposal_id"
      >
        <router-link 
          :to="'/proposal/' + proposal.proposal_id"
          @click.native="flashCard(proposal.proposal_id)"
        >
          查看
        </router-link>
      </ProposalCard>
    </div>

    <!-- 右下圓形創建按鈕 -->
    <button class="create-button" @click="createProposal">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
import { getAllProposals } from '../../api/api.js'
import ProposalCard from '../ProposalCard.vue';

export default {
  components: {
    ProposalCard
  },
  data() {
    return {
      searchQuery: '',
      proposals: [
        // {
        //   proposal_id: 1,
        //   proposal_title: "我家樓下需要路燈",
        //   district: "大安區",
        //   address_detail: "中正路100號",
        //   proposal_content: "加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈",
        //   proposal_affect: "改善道路安全",
        //   proposal_status: "未回應",
        //   submit_time: "2024-09-01",
        //   submit_user: "Mike",
        //   view_count: "86",
        //   like_count: "1565"
        // },
        // {
        //   proposal_id: 2,
        //   proposal_title: "需要更多公園設施",
        //   district: "中山區",
        //   address_detail: "建國北路200號",
        //   proposal_content: "新增健身設施",
        //   proposal_affect: "提升居民健康",
        //   proposal_status: "已回應",
        //   submit_time: "2024-09-02",
        //   submit_user: "Alice",
        //   view_count: "500",
        //   like_count: "45"
        // },
        // {
        //   proposal_id: 3,
        //   proposal_title: "我家樓下需要路燈",
        //   district: "大安區",
        //   address_detail: "中正路100號",
        //   proposal_content: "加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈加裝路燈",
        //   proposal_affect: "改善道路安全",
        //   proposal_status: "未回應",
        //   submit_time: "2024-09-01",
        //   submit_user: "Mike",
        //   view_count: "876",
        //   like_count: "21"
        // },
        // {
        //   proposal_id: 4,
        //   proposal_title: "需要更多公園設施",
        //   district: "中山區",
        //   li: "光華里",
        //   address_detail: "建國北路200號",
        //   proposal_content: "新增健身設施",
        //   proposal_affect: "提升居民健康",
        //   proposal_status: "已回應",
        //   submit_time: "2024-09-02",
        //   submit_user: "Alice",
        //   view_count: "500",
        //   like_count: "45"
        // }
      ],
      selectedDistrict: '',
      sortBy: 'view', // 默認按觀看數排序
    };
  },
  computed: {
    sortedProposals() {
      let proposals = this.filteredProposals;

      // 根據選擇的排序方式進行排序
      if (this.sortBy === 'view') {
        proposals.sort((a, b) => b.view_count - a.view_count);
      } else if (this.sortBy === 'like') {
        proposals.sort((a, b) => b.like_count - a.like_count);
      } else if (this.sortBy === 'time') {
        proposals.sort((a, b) => new Date(b.submit_time) - new Date(a.submit_time)); // 按時間排序
      }

      return proposals;
    },
    filteredProposals() {
      console.log(this.selectedDistrict);
      return this.proposals.filter(proposal =>
        (this.selectedDistrict ? proposal.district === this.selectedDistrict : true) &&
        (proposal.proposal_title.includes(this.searchQuery) ||
        proposal.district.includes(this.searchQuery))
      );
    }
  },
  mounted() {
    this.fetchProposals();
  },
  methods: {
    createProposal() {
      // 跳轉到提交頁面
      this.$router.push('/submit');
    },
    filterProposals() {
      // 觸發過濾，這裡已經在 computed 中處理過濾邏輯
      // 只需更新 sortedProposals 以反映過濾結果
      this.sortedProposals; // 重新計算已過濾的提案
    },
    sortProposals() {
      // 觸發排序，這裡已經在 computed 中處理排序邏輯
      // 只需更新 sortedProposals 以反映排序結果
      this.sortedProposals; // 重新計算已排序的提案
    },
    async fetchProposals() {
      try {

        this.proposals = await getAllProposals();
        console.log(this.proposals)
      } catch (err) {
        console.error("Error fetching proposals:", err)
      }
    }
  },
}
</script>

<style scoped>
.main-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}

.search-button {
  padding: 10px;
  background-color: #00a0e9;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.proposal-list {
  margin-top: 20px;
}

.create-button {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  background-color: #00a0e9;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
