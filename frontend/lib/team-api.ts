import { getJson, postJson, putJson, deleteJson } from './api'

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
    const response = await postJson('/teams', data)
    return response.data || response
  },

  // Lấy danh sách nhóm của user
  getMyTeams: async (): Promise<{ teams: Team[]; pagination: any }> => {
    const response = await getJson('/teams')
    // Handle different response structures
    if (response.data && response.data.teams) {
      return response.data
    } else if (Array.isArray(response.data)) {
      return { teams: response.data, pagination: {} }
    } else if (Array.isArray(response)) {
      return { teams: response, pagination: {} }
    } else {
      return { teams: [], pagination: {} }
    }
  },

  // Lấy thông tin chi tiết nhóm
  getTeamById: async (teamId: string): Promise<Team> => {
    const response = await getJson(`/teams/${teamId}`)
    return response.data || response
  },

  // Cập nhật thông tin nhóm
  updateTeam: async (teamId: string, data: Partial<CreateTeamData>): Promise<Team> => {
    const response = await putJson(`/teams/${teamId}`, data)
    return response.data || response
  },

  // Cập nhật board (cột Kanban)
  updateBoard: async (
    teamId: string,
    columns: Array<{ key: string; title: string; order: number }>,
  ): Promise<any> => {
    const response = await putJson(`/teams/${teamId}/board`, { columns })
    return response.data || response
  },

  // Xóa nhóm
  deleteTeam: async (teamId: string): Promise<void> => {
    await deleteJson(`/teams/${teamId}`)
  },

  // Mời thành viên vào nhóm
  inviteMember: async (teamId: string, data: InviteMemberData): Promise<TeamInvite> => {
    const response = await postJson(`/teams/${teamId}/invite`, data)
    return response.data
  },

  // Chấp nhận lời mời
  acceptInvite: async (token: string): Promise<{ message: string; team: Team }> => {
    const response = await postJson('/teams/invite/accept', { token })
    return response
  },

  // Từ chối lời mời
  rejectInvite: async (token: string): Promise<{ message: string }> => {
    const response = await postJson('/teams/invite/reject', { token })
    return response
  },

  // Lấy danh sách lời mời của user
  getMyInvites: async (): Promise<TeamInvite[]> => {
    const response = await getJson('/teams/invites/my-invites')
    return response.data
  },

  // Xóa thành viên khỏi nhóm
  removeMember: async (teamId: string, memberId: string): Promise<void> => {
    await deleteJson(`/teams/${teamId}/members/${memberId}`)
  },

  // Cập nhật role thành viên
  updateMemberRole: async (teamId: string, memberId: string, role: 'admin' | 'member'): Promise<void> => {
    await postJson(`/teams/${teamId}/members/${memberId}/role`, { role })
  },

  // Lấy thông tin lời mời bằng token (public)
  getInviteByToken: async (token: string): Promise<TeamInvite> => {
    const response = await getJson(`/teams/invite/${token}`)
    return response.data
  }
}
