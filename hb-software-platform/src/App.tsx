import { Routes, Route } from 'react-router-dom'
import PortalLayout from './layouts/PortalLayout'
import AdminLayout from './layouts/AdminLayout'
import PlatformLayout from './layouts/PlatformLayout'
import { ThemeProvider } from './contexts/ThemeContext'

// 平台门户页面
import Home from './pages/portal/Home'
import SoftwareList from './pages/portal/SoftwareList'
import SoftwareDetail from './pages/portal/SoftwareDetail'
import SolutionDetail from './pages/portal/SolutionDetail'
import Policy from './pages/portal/Policy'
import PolicyDetail from './pages/portal/PolicyDetail'
import Demand from './pages/portal/Demand'
import DemandDetail from './pages/portal/DemandDetail'
import Login from './pages/portal/Login'
import Register from './pages/portal/Register'

// 企业端页面
import EnterpriseDashboard from './pages/enterprise/Dashboard'
import EnterpriseApply from './pages/enterprise/EnterpriseApply'
import EnterpriseInfo from './pages/enterprise/EnterpriseInfo'
import EnterpriseInfoEdit from './pages/enterprise/EnterpriseInfoEdit'
import SoftwarePublish from './pages/enterprise/SoftwarePublish'
import SubsidyApply from './pages/enterprise/SubsidyApply'
import MySoftware from './pages/enterprise/MySoftware'
import MyDemands from './pages/enterprise/MyDemands'
import DemandPublish from './pages/enterprise/DemandPublish'
import MySubsidies from './pages/enterprise/MySubsidies'
import MessageSubmit from './pages/enterprise/MessageSubmit'
import MessageCenter from './pages/enterprise/MessageCenter'

// 平台端页面
import PlatformDashboard from './pages/platform/Dashboard'
import EnterpriseAudit from './pages/platform/EnterpriseAudit'
import SoftwareAudit from './pages/platform/SoftwareAudit'
import SubsidyAudit from './pages/platform/SubsidyAudit'
import Statistics from './pages/platform/Statistics'
import PolicyManage from './pages/platform/PolicyManage'
import ActivityManage from './pages/platform/ActivityManage'
import UserManage from './pages/platform/UserManage'
import MessageManage from './pages/platform/MessageManage'
import DemandSummary from './pages/platform/DemandSummary'
import DictManage from './pages/platform/DictManage'
import OperationLog from './pages/platform/OperationLog'
import LoginLog from './pages/platform/LoginLog'
import MessageTemplate from './pages/platform/MessageTemplate'
import MessageSend from './pages/platform/MessageSend'
import MessageRecord from './pages/platform/MessageRecord'
import RoleManage from './pages/platform/RoleManage'
import MenuManage from './pages/platform/MenuManage'
import DeptManage from './pages/platform/DeptManage'
import PostManage from './pages/platform/PostManage'
import DataMigration from './pages/platform/DataMigration'
import HubeiMapReport from './pages/platform/HubeiMapReport'
import NotificationSettings from './pages/enterprise/NotificationSettings'

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Routes>
        {/* 平台门户路由 */}
        {/* 登录注册页 - 独立路由，不使用 PortalLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<PortalLayout />}>
          <Route index element={<Home />} />
          <Route path="software" element={<SoftwareList />} />
          <Route path="software/:id" element={<SoftwareDetail />} />
          <Route path="solutions/:id" element={<SolutionDetail />} />
          <Route path="policy" element={<Policy />} />
          <Route path="policy/:id" element={<PolicyDetail />} />
          <Route path="demand" element={<Demand />} />
          <Route path="demand/:id" element={<DemandDetail />} />
        </Route>

        {/* 企业端路由 */}
        <Route path="/enterprise" element={<AdminLayout />}>
          <Route index element={<EnterpriseDashboard />} />
          <Route path="apply" element={<EnterpriseApply />} />
          <Route path="info" element={<EnterpriseInfo />} />
          <Route path="info/edit" element={<EnterpriseInfoEdit />} />
          <Route path="software/publish" element={<SoftwarePublish />} />
          <Route path="software/list" element={<MySoftware />} />
          <Route path="demands" element={<MyDemands />} />
          <Route path="demand/publish" element={<DemandPublish />} />
          <Route path="subsidy/apply" element={<SubsidyApply />} />
          <Route path="subsidy/list" element={<MySubsidies />} />
          <Route path="messages" element={<MessageSubmit />} />
          <Route path="message-center" element={<MessageCenter />} />
          <Route path="notification-settings" element={<NotificationSettings />} />
        </Route>

        {/* 平台端路由 */}
        <Route path="/platform" element={<PlatformLayout />}>
          <Route index element={<PlatformDashboard />} />
          <Route path="audit/enterprise" element={<EnterpriseAudit />} />
          <Route path="audit/software" element={<SoftwareAudit />} />
          <Route path="audit/subsidy" element={<SubsidyAudit />} />
          <Route path="demands" element={<DemandSummary />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="policy" element={<PolicyManage />} />
          <Route path="activity" element={<ActivityManage />} />
          <Route path="users" element={<UserManage />} />
          <Route path="messages" element={<MessageManage />} />
          <Route path="dict" element={<DictManage />} />
          <Route path="logs/operation" element={<OperationLog />} />
          <Route path="logs/login" element={<LoginLog />} />
          <Route path="message-template" element={<MessageTemplate />} />
          <Route path="message-send" element={<MessageSend />} />
          <Route path="message-record" element={<MessageRecord />} />
          <Route path="role" element={<RoleManage />} />
          <Route path="menu" element={<MenuManage />} />
          <Route path="dept" element={<DeptManage />} />
          <Route path="post" element={<PostManage />} />
          <Route path="data-migration" element={<DataMigration />} />
          <Route path="map-report" element={<HubeiMapReport />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App