// Test script cho Team API
const axios = require('axios')

const BASE_URL = 'http://localhost:8000/api'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
}

const testTeam = {
  name: 'Test Team',
  description: 'A test team for development',
  settings: {
    allowMemberInvite: true,
    allowMemberCreateProject: true,
    allowMemberDeleteProject: false
  }
}

async function testTeamAPI() {
  try {
    console.log('🧪 Testing Team API...\n')

    // 1. Login để lấy token
    console.log('1. Logging in...')
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    })

    const token = loginResponse.data.user?.id // Giả sử token là user ID
    console.log('✅ Login successful\n')

    // 2. Tạo nhóm mới
    console.log('2. Creating team...')
    const createTeamResponse = await axios.post(`${BASE_URL}/teams`, testTeam, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    const teamId = createTeamResponse.data.data._id
    console.log('✅ Team created:', createTeamResponse.data.data.name, '\n')

    // 3. Lấy danh sách nhóm
    console.log('3. Getting user teams...')
    const getTeamsResponse = await axios.get(`${BASE_URL}/teams`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    console.log('✅ Teams retrieved:', getTeamsResponse.data.data.teams.length, 'teams\n')

    // 4. Mời thành viên
    console.log('4. Inviting member...')
    const inviteResponse = await axios.post(`${BASE_URL}/teams/${teamId}/invite`, {
      inviteeEmail: 'newmember@example.com',
      role: 'member',
      message: 'Welcome to our team!'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    const inviteToken = inviteResponse.data.data.token
    console.log('✅ Member invited, token:', inviteToken, '\n')

    // 5. Lấy thông tin lời mời
    console.log('5. Getting invite info...')
    const inviteInfoResponse = await axios.get(`${BASE_URL}/teams/invite/${inviteToken}`)

    console.log('✅ Invite info:', inviteInfoResponse.data.data.team.name, '\n')

    // 6. Lấy danh sách lời mời của user
    console.log('6. Getting user invites...')
    const userInvitesResponse = await axios.get(`${BASE_URL}/teams/invites/my-invites`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    console.log('✅ User invites:', userInvitesResponse.data.data.length, 'invites\n')

    console.log('🎉 All tests passed!')

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)
  }
}

// Chạy test
testTeamAPI()
