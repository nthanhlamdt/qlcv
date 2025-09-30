import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from '../middleware/CatchAsyncError'
import { TeamInviteModel } from '../models/teamInvite.model'

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    name?: string
    email: string
  }
}
import {
  createTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
  inviteMember,
  acceptInvite,
  rejectInvite,
  getUserInvites,
  removeMember,
  updateMemberRole,
  CreateTeamData,
  InviteMemberData,
  TeamFilters,
  getTeams,
} from '../services/team.service'

// Tạo nhóm mới
export const createNewTeam = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { name, description, avatarUrl, settings } = req.body
  const ownerId = req.user?.id

  if (!ownerId) {
    return next(new Error('User ID không tồn tại'))
  }

  const teamData: CreateTeamData = {
    name,
    description,
    avatarUrl,
    settings,
  }

  const team = await createTeam(teamData, ownerId)

  res.status(201).json({
    success: true,
    message: 'Nhóm đã được tạo thành công',
    data: team,
  })
})

// Lấy danh sách nhóm
export const getUserTeams = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id
  const { ownerId, memberId, isActive, limit = 20, page = 1 } = req.query

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const filters: TeamFilters = {
    ownerId: ownerId as string,
    memberId: memberId as string || userId,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    limit: parseInt(limit as string),
    page: parseInt(page as string),
  }

  const result = await getTeams(filters)

  console.log(result)
  res.status(200).json({
    success: true,
    data: result,
  })
})

// Lấy thông tin nhóm theo ID
export const getTeamDetails = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { teamId } = req.params
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const team = await getTeamById(teamId, userId)

  res.status(200).json({
    success: true,
    data: team,
  })
})

// Cập nhật thông tin nhóm
export const updateTeamInfo = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { teamId } = req.params
  const userId = req.user?.id
  const updateData = req.body

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const team = await updateTeam(teamId, updateData, userId)

  res.status(200).json({
    success: true,
    message: 'Nhóm đã được cập nhật thành công',
    data: team,
  })
})

// Xóa nhóm
export const deleteTeamById = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { teamId } = req.params
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const result = await deleteTeam(teamId, userId)

  res.status(200).json({
    success: true,
    message: result.message,
  })
})

// Mời thành viên mới
export const inviteTeamMember = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const teamId = req.params.teamId
  const { inviteeEmail, role, message } = req.body
  const inviterId = req.user?.id

  if (!inviterId) {
    return next(new Error('User ID không tồn tại'))
  }

  if (!teamId || !inviteeEmail || !role) {
    return next(new Error('Thiếu thông tin bắt buộc'))
  }

  console.log(teamId)
  const inviteData: InviteMemberData = {
    teamId,
    inviteeEmail,
    role,
    message,
  }


  const invite = await inviteMember(inviteData, inviterId)

  res.status(201).json({
    success: true,
    message: 'Lời mời đã được gửi thành công',
    data: invite,
  })
})

// Chấp nhận lời mời
export const acceptTeamInvite = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { token } = req.body
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  if (!token) {
    return next(new Error('Token là bắt buộc'))
  }

  const result = await acceptInvite(token, userId)

  res.status(200).json({
    success: true,
    message: result.message,
    data: result.team,
  })
})

// Từ chối lời mời
export const rejectTeamInvite = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { token } = req.body
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  if (!token) {
    return next(new Error('Token là bắt buộc'))
  }

  const result = await rejectInvite(token, userId)

  res.status(200).json({
    success: true,
    message: result.message,
  })
})

// Lấy danh sách lời mời của user
export const getUserTeamInvites = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const invites = await getUserInvites(userId)

  res.status(200).json({
    success: true,
    data: invites,
  })
})

// Xóa thành viên khỏi nhóm
export const removeTeamMember = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { teamId, memberId } = req.params
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  if (!memberId) {
    return next(new Error('Member ID là bắt buộc'))
  }

  const result = await removeMember(teamId, memberId, userId)

  res.status(200).json({
    success: true,
    message: result.message,
  })
})

// Cập nhật role thành viên
export const updateTeamMemberRole = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { teamId, memberId } = req.params
  const { role } = req.body
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  if (!memberId || !role) {
    return next(new Error('Member ID và role là bắt buộc'))
  }

  if (!['admin', 'member'].includes(role)) {
    return next(new Error('Role không hợp lệ'))
  }

  const result = await updateMemberRole(teamId, memberId, role, userId)

  res.status(200).json({
    success: true,
    message: result.message,
  })
})

// Lấy thông tin lời mời theo token (public endpoint)
export const getInviteByToken = CatchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { token } = req.params

  if (!token) {
    return next(new Error('Token là bắt buộc'))
  }

  const invite = await TeamInviteModel.findOne({
    token,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })
    .populate('team', 'name description avatarUrl')
    .populate('inviter', 'name email avatarUrl')

  if (!invite) {
    return next(new Error('Lời mời không hợp lệ hoặc đã hết hạn'))
  }

  res.status(200).json({
    success: true,
    data: invite,
  })
})
