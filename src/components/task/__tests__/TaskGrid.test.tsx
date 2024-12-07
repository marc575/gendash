import { render, screen } from '@testing-library/react'
import { TaskGrid } from '../TaskGrid'
import { Task } from '@/types/Task'
import { useDashboardStore } from '@/store/dashboardStore'

// Mock the store
const mockUseDashboardStore = useDashboardStore as jest.MockedFunction<typeof useDashboardStore>
jest.mock('@/store/dashboardStore', () => ({
  useDashboardStore: jest.fn()
}))

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: 'pending',
    priority: 'High',
    project: 'Project 1',
    labels: [],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    participants: [],
    done: false,
    activity: []
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: 'in-progress',
    priority: 'Low',
    project: 'Project 1',
    labels: [],
    isCompleted: false,
    createdAt: new Date().toISOString(),
    participants: [],
    done: false,
    activity: []
  }
]

describe('TaskGrid', () => {
  beforeEach(() => {
    // Setup mock store before each test
    mockUseDashboardStore.mockImplementation(() => ({
      tasks: mockTasks,
      setTasks: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      addTask: jest.fn()
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders task columns correctly', () => {
    render(<TaskGrid />)
    
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('distributes tasks to correct columns', () => {
    render(<TaskGrid />)
    
    const pendingColumn = screen.getByTestId('column-pending')
    const inProgressColumn = screen.getByTestId('column-in-progress')
    
    expect(pendingColumn).toContainElement(screen.getByText('Task 1'))
    expect(inProgressColumn).toContainElement(screen.getByText('Task 2'))
  })

  it('handles empty columns', () => {
    // Mock store with only one task
    mockUseDashboardStore.mockImplementation(() => ({
      tasks: [mockTasks[0]],
      setTasks: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      addTask: jest.fn()
    }))

    render(<TaskGrid />)
    
    const completedColumn = screen.getByTestId('column-completed')
    expect(completedColumn).toHaveTextContent('No tasks')
  })

  it('updates on task status change', () => {
    const setTasks = jest.fn()
    const updateTask = jest.fn()
    
    // Initial render with mock tasks
    const { rerender } = render(<TaskGrid />)
    
    // Update mock store with new task status
    const updatedTasks = [...mockTasks]
    updatedTasks[0] = { ...updatedTasks[0], status: 'completed' }
    
    mockUseDashboardStore.mockImplementation(() => ({
      tasks: updatedTasks,
      setTasks,
      updateTask,
      deleteTask: jest.fn(),
      addTask: jest.fn()
    }))
    
    rerender(<TaskGrid />)
    
    const completedColumn = screen.getByTestId('column-completed')
    expect(completedColumn).toContainElement(screen.getByText('Task 1'))
  })
})
