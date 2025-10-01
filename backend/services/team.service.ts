import { TeamModel, ITeam } from '../models/team.model'
import { TeamInviteModel, ITeamInvite } from '../models/teamInvite.model'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/ErrorHandler'
import { CatchAsyncError } from '../middleware/CatchAsyncError'
import { createNotification } from './notification.service'
import { socketService } from '../server'

export interface CreateTeamData {
  name: string
  description?: string
  avatarUrl?: string
  settings?: {
    allowMemberInvite?: boolean
    allowMemberCreateProject?: boolean
    allowMemberDeleteProject?: boolean
  }
}

export interface InviteMemberData {
  teamId: string
  inviteeEmail: string
  role: 'admin' | 'member'
  message?: string
}

export interface TeamFilters {
  ownerId?: string
  memberId?: string
  isActive?: boolean
  limit?: number
  page?: number
}

// Tạo nhóm mới
export const createTeam = async (data: CreateTeamData, ownerId: string): Promise<ITeam> => {
  const { name, description, avatarUrl, settings } = data

  if (!name || !ownerId) {
    throw new ErrorHandler('Tên nhóm và ID chủ sở hữu là bắt buộc', 400)
  }

  // Kiểm tra owner có tồn tại không
  const owner = await UserModel.findById(ownerId)
  if (!owner) {
    throw new ErrorHandler('Chủ sở hữu nhóm không tồn tại', 404)
  }

  const team = await TeamModel.create({
    name,
    description,
    avatarUrl,
    owner: ownerId,
    members: [{
      user: ownerId,
      role: 'owner',
      joinedAt: new Date(),
      status: 'active',
    }],
    settings: {
      allowMemberInvite: settings?.allowMemberInvite ?? true,
      allowMemberCreateProject: settings?.allowMemberCreateProject ?? true,
      allowMemberDeleteProject: settings?.allowMemberDeleteProject ?? false,
    },
  })

  // Populate thông tin owner
  await team.populate('owner', 'name email avatarUrl')
  await team.populate('members.user', 'name email avatarUrl')

  return team
}

// Lấy danh sách nhóm
export const getTeams = async (filters: TeamFilters): Promise<{ teams: ITeam[]; pagination: { current: number; pages: number; total: number } }> => {
  const { ownerId, memberId, isActive = true, limit = 20, page = 1 } = filters

  const query: any = { isActive }

  if (ownerId) {
    query.owner = ownerId
  }

  if (memberId) {
    query['members.user'] = memberId
    query['members.status'] = 'active'
  }

  const skip = (page - 1) * limit

  const teams = await TeamModel.find(query)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await TeamModel.countDocuments(query)

  return {
    teams,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
    },
  }
}

// Lấy thông tin nhóm theo ID
export const getTeamById = async (teamId: string, userId: string): Promise<ITeam | null> => {
  const team = await TeamModel.findById(teamId)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')

  if (!team) {
    throw new ErrorHandler('Nhóm không tồn tại', 404)
  }

  // Cho phép tất cả user xem team (team management system)
  // Chỉ kiểm tra nếu team không active
  if (!team.isActive) {
    throw new ErrorHandler('Nhóm này đã bị vô hiệu hóa', 403)
  }

  return team || null
}

// Cập nhật thông tin nhóm
export const updateTeam = async (teamId: string, updateData: Partial<CreateTeamData>, userId: string): Promise<ITeam | null> => {
  const team = await TeamModel.findById(teamId)

  if (!team) {
    throw new ErrorHandler('Nhóm không tồn tại', 404)
  }

  // Chỉ owner hoặc admin mới có quyền cập nhật
  const isOwner = team.owner.toString() === userId
  const isAdmin = team.members.some(
    member => member.user.toString() === userId &&
      (member.role === 'admin' || member.role === 'owner') &&
      member.status === 'active'
  )

  if (!isOwner && !isAdmin) {
    throw new ErrorHandler('Bạn không có quyền cập nhật nhóm này', 403)
  }

  const updatedTeam = await TeamModel.findByIdAndUpdate(
    teamId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')

  return updatedTeam || null
}

export const updateTeamBoard = async (
  teamId: string,
  columns: Array<{ key: string; title: string; order: number }>,
  userId: string,
): Promise<ITeam | null> => {
  const team = await TeamModel.findById(teamId)
  if (!team) throw new ErrorHandler('Nhóm không tồn tại', 404)
  const isOwner = team.owner.toString() === userId
  const isAdmin = team.members.some(m => m.user.toString() === userId && (m.role === 'admin' || m.role === 'owner') && m.status === 'active')
  if (!isOwner && !isAdmin) throw new ErrorHandler('Bạn không có quyền cập nhật board', 403)

  const sorted = [...columns].sort((a, b) => a.order - b.order)
    ; (team as any).board = { columns: sorted }
  await team.save()
  return await TeamModel.findById(teamId)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
}

// Xóa nhóm
export const deleteTeam = async (teamId: string, userId: string): Promise<{ message: string }> => {
  const team = await TeamModel.findById(teamId)

  if (!team) {
    throw new ErrorHandler('Nhóm không tồn tại', 404)
  }

  // Chỉ owner mới có quyền xóa nhóm
  const isOwner = team.owner.toString() === userId
  if (!isOwner) {
    throw new ErrorHandler('Chỉ chủ sở hữu mới có quyền xóa nhóm', 403)
  }

  // Xóa tất cả lời mời của nhóm
  await TeamInviteModel.deleteMany({ team: teamId })

  // Xóa nhóm
  await TeamModel.findByIdAndDelete(teamId)

  return { message: 'Nhóm đã được xóa thành công' }
}

// Mời thành viên mới
export const inviteMember = async (data: InviteMemberData, inviterId: string): Promise<ITeamInvite> => {
  const { teamId, inviteeEmail, role, message } = data

  // Kiểm tra team có tồn tại không
  const team = await TeamModel.findById(teamId)
  if (!team) {
    throw new ErrorHandler('Nhóm không tồn tại', 404)
  }

  // Kiểm tra quyền mời
  const isOwner = team.owner.toString() === inviterId
  const isAdmin = team.members.some(
    member => member.user.toString() === inviterId &&
      (member.role === 'admin' || member.role === 'owner') &&
      member.status === 'active'
  )

  if (!isOwner && !isAdmin) {
    throw new ErrorHandler('Bạn không có quyền mời thành viên', 403)
  }

  // Kiểm tra email có tồn tại không (nếu muốn chỉ mời user đã đăng ký)
  const inviteeUserDoc = await UserModel.findOne({ email: inviteeEmail })

  // Kiểm tra email đã được mời chưa
  const existingInvite = await TeamInviteModel.findOne({
    inviteeEmail,
    team: teamId,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })
  if (existingInvite) {
    throw new ErrorHandler('Email này đã được mời tham gia nhóm', 409)
  }

  // Kiểm tra email đã là thành viên chưa
  const existingMember = team.members.find(
    member => member.user.toString() === inviteeEmail ||
      (member.user as any).email === inviteeEmail
  )
  if (existingMember) {
    throw new ErrorHandler('Email này đã là thành viên của nhóm', 409)
  }


  // Tìm user theo email (nếu có tài khoản)
  const inviteeUser = inviteeUserDoc?._id
  // Tạo lời mời (dùng save để đảm bảo pre-save tạo token)
  const invite = new TeamInviteModel({
    team: teamId,
    inviter: inviterId,
    inviteeEmail,
    inviteeUser: (inviteeUser as any)?._id,
    role,
    message,
  })


  try {
    await invite.validate(); // surface validation errors early
    await invite.save();     // pre-save will set token
    console.log('Invite saved with token:', invite.token)
  } catch (err: any) {
    console.error('Save invite failed:', err?.message, err)
    if (err?.code === 11000) {
      throw new ErrorHandler('Token bị trùng, thử lại lần nữa', 409)
    }
    throw new ErrorHandler(err?.message || 'Không thể tạo lời mời', 500)
  }

  console.log(teamId, inviteeEmail, role, message, inviterId)

  // Gửi thông báo realtime nếu user đã có tài khoản
  if (inviteeUserDoc?._id) {
    try {
      await socketService.createAndSendNotification(
        inviteeUserDoc._id.toString(),
        'team_invite',
        'Lời mời tham gia nhóm',
        `Bạn được mời tham gia nhóm "${team.name}"`,
        inviterId,
        { teamId, inviteId: invite._id, token: invite.token }
      )
    } catch (error) {
      console.error('Error sending realtime notification:', error)
    }
  }

  // TODO: Gửi email mời tham gia
  // await sendTeamInviteEmail(inviteeEmail, team.name, invite.token)


  return invite
}

// Chấp nhận lời mời
export const acceptInvite = async (token: string, userId: string): Promise<{ message: string; team: ITeam }> => {
  const invite = await TeamInviteModel.findOne({
    token,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })

  if (!invite) {
    throw new ErrorHandler('Lời mời không hợp lệ hoặc đã hết hạn', 400)
  }

  // Kiểm tra user có đúng email không
  const user = await UserModel.findById(userId)
  if (!user || user.email !== invite.inviteeEmail) {
    throw new ErrorHandler('Bạn không có quyền chấp nhận lời mời này', 403)
  }

  // Cập nhật lời mời
  invite.status = 'accepted'
  invite.acceptedAt = new Date()
  await invite.save()

  // Thêm user vào nhóm
  const team = await TeamModel.findById(invite.team)
  if (!team) {
    throw new ErrorHandler('Nhóm không tồn tại', 404)
  }

  // Thêm thành viên mới
  const existingMember = team.members.find(
    member => member.user.toString() === userId
  )

  if (existingMember) {
    existingMember.status = 'active'
    existingMember.role = invite.role
  } else {
    team.members.push({
      user: userId as any,
      role: invite.role,
      joinedAt: new Date(),
      status: 'active',
    })
  }

  await team.save()

  // Gửi thông báo cho team
  try {
    const teamMembers = team.members
      .filter(member => member.status === 'active')
      .map(member => member.user.toString())

    await socketService.createAndSendBroadcastNotification(
      teamMembers,
      'team_invite',
      'Thành viên mới tham gia',
      `${user.name} đã chấp nhận lời mời tham gia nhóm "${team.name}"`,
      userId,
      { teamId: team._id, newMemberId: userId }
    )
  } catch (error) {
    console.error('Error sending team notification:', error)
  }

  return { message: 'Đã chấp nhận lời mời tham gia nhóm', team }
}

// Từ chối lời mời
export const rejectInvite = async (token: string, userId: string): Promise<{ message: string }> => {
  const invite = await TeamInviteModel.findOne({
    token,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })

  if (!invite) {
    throw new ErrorHandler('Lời mời không hợp lệ hoặc đã hết hạn', 400)
  }

  // Kiểm tra user có đúng email không
  const user = await UserModel.findById(userId)
  if (!user || user.email !== invite.inviteeEmail) {
    throw new ErrorHandler('Bạn không có quyền từ chối lời mời này', 403)
  }

  // Cập nhật lời mời
  invite.status = 'rejected'
  invite.rejectedAt = new Date()
  await invite.save()

  // Gửi thông báo cho team owner khi từ chối lời mời
  try {
    const team = await TeamModel.findById(invite.team)
    if (team) {
      await socketService.createAndSendNotification(
        team.owner.toString(),
        'team_invite',
        'Lời mời bị từ chối',
        `${user.name} đã từ chối lời mời tham gia nhóm "${team.name}"`,
        userId,
        { teamId: team._id, inviteId: invite._id }
      )
    }
  } catch (error) {
    console.error('Error sending rejection notification:', error)
  }

  return { message: 'Đã từ chối lời mời tham gia nhóm' }
}

// Lấy danh sách lời mời của user
export const getUserInvites = async (userId: string): Promise<ITeamInvite[]> => {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new ErrorHandler('User không tồn tại', 404)
  }

  const invites = await TeamInviteModel.find({
    inviteeEmail: user.email,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })
    .populate('team', 'name description avatarUrl')
    .populate('inviter', 'name email avatarUrl')
    .sort({ createdAt: -1 })

  return invites
}

// Xóa thành viên khỏi nhóm
export const removeMember = async (teamId: string, memberId: string, userId: string): Promise<{ message: string }> => {
  const team = await TeamModel.findById(teamId)

  if (!team) {
    throw new ErrorHandler('Nhóm không tồn tại', 404)
  }

  // Chỉ owner hoặc admin mới có quyền xóa thành viên
  const isOwner = team.owner.toString() === userId
  const isAdmin = team.members.some(
    member => member.user.toString() === userId &&
      (member.role === 'admin' || member.role === 'owner') &&
      member.status === 'active'
  )

  if (!isOwner && !isAdmin) {
    throw new ErrorHandler('Bạn không có quyền xóa thành viên', 403)
  }

  // Không thể xóa owner
  if (team.owner.toString() === memberId) {
    throw new ErrorHandler('Không thể xóa chủ sở hữu nhóm', 400)
  }

  // Không thể xóa chính mình nếu là admin
  if (memberId === userId && isAdmin && !isOwner) {
    throw new ErrorHandler('Không thể tự xóa mình khỏi nhóm', 400)
  }

  // Xóa thành viên
  team.members = team.members.filter(
    member => member.user.toString() !== memberId
  )
  await team.save()

  return { message: 'Đã xóa thành viên khỏi nhóm' }
}

// Cập nhật role thành viên
export const updateMemberRole = async (teamId: string, memberId: string, role: 'admin' | 'member', userId: string): Promise<{ message: string }> => {
  const team = await TeamModel.findById(teamId)

  if (!team) {
    throw new ErrorHandler('Nhóm không tồn tại', 404)
  }

  // Chỉ owner mới có quyền cập nhật role
  const isOwner = team.owner.toString() === userId
  if (!isOwner) {
    throw new ErrorHandler('Chỉ chủ sở hữu mới có quyền cập nhật role thành viên', 403)
  }

  // Không thể thay đổi role của chính mình
  if (memberId === userId) {
    throw new ErrorHandler('Không thể thay đổi role của chính mình', 400)
  }

  // Cập nhật role thành viên
  const member = team.members.find(
    member => member.user.toString() === memberId
  )

  if (member) {
    member.role = role
    await team.save()
  } else {
    throw new ErrorHandler('Thành viên không tồn tại', 404)
  }

  return { message: 'Đã cập nhật role thành viên' }
}
