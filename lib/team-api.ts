import { api } from './api'

export interface Team {
  _id: string
  name: string
  description?: string
  owner: {
    _id: string
    name: string
    email: string
    avatarUrl?: string
  }
  members: Array<{
    user: {
      _id: string
      name: string
      email: string
      avatarUrl?: string
    }
    role: 'owner' | 'admin' | 'member'
    joinedAt: string
    status: 'pending' | 'active' | 'inactive' | 'removed'
  }>
  avatarUrl?: string
  settings?: {
    visibility: 'public' | 'private'
    allowSelfJoin: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface CreateTeamData {
  name: string
  description?: string
  avatarUrl?: string
  settings?: {
    visibility: 'public' | 'private'
    allowSelfJoin: boolean
  }
}

export interface InviteMemberData {
  inviteeEmail: string
  role: 'admin' | 'member'
  message?: string
}

export interface TeamInvite {
  _id: string
  team: {
    _id: string
    name: string
    description?: string
    avatarUrl?: string
  }
  inviter: {
    _id: string
    name: string
    email: string
    avatarUrl?: string
  }
  inviteeEmail: string
  role: 'admin' | 'member'
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  message?: string
  expiresAt: string
  createdAt: string
}

// Team API functions
export const teamApi = {
  // Tạo nhóm mới
  createTeam: async (data: CreateTeamData): Promise<Team> => {
    const response = await api.post('/teams', data)
    return response.data.data
  },

  // Lấy danh sách nhóm của user
  getMyTeams: async (): Promise<{ teams: Team[]; pagination: any }> => {
    const response = await api.get('/teams')
    return response.data.data
  },

  // Lấy thông tin chi tiết nhóm
  getTeamById: async (teamId: string): Promise<Team> => {
    const response = await api.get(`/teams/${teamId}`)
    return response.data.data
  },

  // Cập nhật thông tin nhóm
  updateTeam: async (teamId: string, data: Partial<CreateTeamData>): Promise<Team> => {
    const response = await api.put(`/teams/${teamId}`, data)
    return response.data.data
  },

  // Xóa nhóm
  deleteTeam: async (teamId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}`)
  },

  // Mời thành viên vào nhóm
  inviteMember: async (teamId: string, data: InviteMemberData): Promise<TeamInvite> => {
    const response = await api.post(`/teams/${teamId}/invite`, data)
    return response.data.data
  },

  // Chấp nhận lời mời
  acceptInvite: async (token: string): Promise<{ message: string; team: Team }> => {
    const response = await api.post('/teams/invite/accept', { token })
    return response.data
  },

  // Từ chối lời mời
  rejectInvite: async (token: string): Promise<{ message: string }> => {
    const response = await api.post('/teams/invite/reject', { token })
    return response.data
  },

  // Lấy danh sách lời mời của user
  getMyInvites: async (): Promise<TeamInvite[]> => {
    const response = await api.get('/teams/invites/my-invites')
    return response.data.data
  },

  // Xóa thành viên khỏi nhóm
  removeMember: async (teamId: string, memberId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}/members/${memberId}`)
  },

  // Cập nhật role thành viên
  updateMemberRole: async (teamId: string, memberId: string, role: 'admin' | 'member'): Promise<void> => {
    await api.patch(`/teams/${teamId}/members/${memberId}/role`, { role })
  },

  // Lấy thông tin lời mời bằng token (public)
  getInviteByToken: async (token: string): Promise<TeamInvite> => {
    const response = await api.get(`/teams/invite/${token}`)
    return response.data.data
  }
}
