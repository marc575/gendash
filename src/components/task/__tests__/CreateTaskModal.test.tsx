import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateTaskModal } from '../CreateTaskModal'

describe('CreateTaskModal', () => {
  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Assign To')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )
    
    fireEvent.click(screen.getByText('Create Task'))

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )
    
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Task' }
    })
    
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Task Description' }
    })
    
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'high' }
    })
    
    fireEvent.click(screen.getByText('Create Task'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Task',
        description: 'Task Description',
        priority: 'high'
      }))
    })
  })

  it('closes modal when cancel is clicked', () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )
    
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('resets form on close', async () => {
    const { rerender } = render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )
    
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Task' }
    })
    
    rerender(
      <CreateTaskModal 
        isOpen={false} 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )
    
    rerender(
      <CreateTaskModal 
        isOpen={true} 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })
})
