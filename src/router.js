import { createRouter, createWebHistory } from 'vue-router';

import ProposalView from './components/pages/ProposalView.vue';
import SubmitView from './components/pages/SubmitView.vue';
import ProposalDetail from './components/pages/ProposalDetail.vue';

const routes = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: ProposalView},
        { path: '/proposal', component: ProposalView},
        { path: '/proposal/:id', component: ProposalDetail},
        { path: '/submit', component: SubmitView},
    ],
});

export default routes;
