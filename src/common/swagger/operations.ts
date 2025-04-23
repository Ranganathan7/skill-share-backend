export const swaggerAPIOptions = {
  createAccount: {
    summary: 'Create account',
    description: 'This API is used to create individual / corporate account'
  },
  authenticateAccount: {
    summary: 'Authenticate account',
    description: 'This API is used to authenticate user email and password'
  },
  createTask: {
    summary: 'Create task',
    description: 'This API is used to create a task (only for user)'
  },
  getTasks: {
    summary: 'Get tasks',
    description: 'This API returns all tasks the user has created / tasks that the provider has been offered'
  },
  makeOffer: {
    summary: 'Make offer',
    description: 'This API is used to make an offer to a task by a provider'
  },
  getOffers: {
    summary: 'Get offers',
    description: 'This API is used to fetch offers made by provider / offers received for a task created by user'
  },
  acceptOffer: {
    summary: 'Accept offer',
    description: 'This API is used to accept an offer from provider by the user'
  },
  updateTaskProgress: {
    summary: 'Update task progress',
    description: 'This API is used by provider to update task progress'
  },
  updateTaskStatus: {
    summary: 'Update task status',
    description: 'This API is used by user to update task status to completed'
  },
  addUpdateSkill: {
    summary: 'Add / Update skill',
    description: 'This API is used by provider to add / update a skill'
  },
  getSkills: {
    summary: 'Get skills',
    description: 'This API is fetch skills of a provider'
  }
}