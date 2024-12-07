import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from '../TaskCard'
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

describe('TaskCard', () => {
  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays correct priority badge', () => {
    render(<TaskCard task={mockTask} />)
    
    const priorityBadge = screen.getByText('medium')
    expect(priorityBadge).toBeInTheDocument()
    expect(priorityBadge).toHaveClass('bg-yellow-100')
  })

  it('displays correct status indicator', () => {
    render(<TaskCard task={mockTask} />)
    
    const statusIndicator = screen.getByTestId('status-indicator')
    expect(statusIndicator).toHaveClass('bg-slate-500')
  })

  it('formats date correctly', () => {
    render(<TaskCard task={mockTask} />)
    
    const formattedDate = screen.getByTestId('due-date')
    expect(formattedDate).toBeInTheDocument()
  })
})
