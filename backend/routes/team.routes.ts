import { Router } from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
  createNewTeam,
  getUserTeams,
  getTeamDetails,
  updateTeamInfo,
  deleteTeamById,
  inviteTeamMember,
  acceptTeamInvite,
  rejectTeamInvite,
  getUserTeamInvites,
  removeTeamMember,
  updateTeamMemberRole,
  getInviteByToken,
} from '../controllers/team.controllers'

const router = Router()

// Public routes (không cần xác thực)
router.get('/invite/:token', getInviteByToken) // Lấy thông tin lời mời theo token

// Protected routes (cần xác thực)
router.use(isAuthenticated)

// Team management
router.post('/', createNewTeam) // Tạo nhóm mới
router.get('/', getUserTeams) // Lấy danh sách nhóm của user
router.get('/:teamId', getTeamDetails) // Lấy thông tin chi tiết nhóm
router.put('/:teamId', updateTeamInfo) // Cập nhật thông tin nhóm
router.delete('/:teamId', deleteTeamById) // Xóa nhóm

// Team invitations
router.post('/:teamId/invite', inviteTeamMember) // Mời thành viên mới
router.post('/invite/accept', acceptTeamInvite) // Chấp nhận lời mời
router.post('/invite/reject', rejectTeamInvite) // Từ chối lời mời
router.get('/invites/my-invites', getUserTeamInvites) // Lấy danh sách lời mời của user

// Team member management
router.delete('/:teamId/members/:memberId', removeTeamMember) // Xóa thành viên
router.patch('/:teamId/members/:memberId/role', updateTeamMemberRole) // Cập nhật role thành viên

export default router
