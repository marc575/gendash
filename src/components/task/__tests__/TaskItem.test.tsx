import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from '../TaskItem'
import { Task } from '@/types'

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'medium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  assignedTo: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatars/john.jpg'
  },
  comments: [],
  activities: []
}

describe('TaskItem', () => {
  const mockOnStatusChange = jest.fn()
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders task details correctly', () => {
    render(
      <TaskItem 
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  it('calls onStatusChange when status is changed', () => {
    render(
      <TaskItem 
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    fireEvent.click(screen.getByTestId('status-select'))
    fireEvent.click(screen.getByText('In Progress'))
    
    expect(mockOnStatusChange).toHaveBeenCalledWith(mockTask.id, 'in_progress')
  })

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskItem 
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    fireEvent.click(screen.getByTestId('edit-button'))
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it('calls onDelete when delete is confirmed', () => {
    render(
      <TaskItem 
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    fireEvent.click(screen.getByTestId('delete-button'))
    fireEvent.click(screen.getByText('Confirm'))
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })

  it('displays due date in correct format', () => {
    render(
      <TaskItem 
        task={mockTask}
        onStatusChange={mockOnStatusChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
    
    const formattedDate = screen.getByTestId('due-date')
    expect(formattedDate).toBeInTheDocument()
  })
})
