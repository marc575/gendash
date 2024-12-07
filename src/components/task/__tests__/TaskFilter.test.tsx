// import { render, screen, fireEvent } from '@testing-library/react'
// import { TaskFilter } from '../TaskFilter'

// describe('TaskFilter', () => {
//   const mockOnFilterChange = jest.fn()

//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   it('renders all filter options', () => {
//     render(<TaskFilter onFilterChange={mockOnFilterChange} />)
    
//     expect(screen.getByText('All')).toBeInTheDocument()
//     expect(screen.getByText('Todo')).toBeInTheDocument()
//     expect(screen.getByText('In Progress')).toBeInTheDocument()
//     expect(screen.getByText('Done')).toBeInTheDocument()
//   })

//   it('calls onFilterChange with correct value when filter is selected', () => {
//     render(<TaskFilter onFilterChange={mockOnFilterChange} />)
    
//     fireEvent.click(screen.getByText('Todo'))
//     expect(mockOnFilterChange).toHaveBeenCalledWith('todo')
    
//     fireEvent.click(screen.getByText('In Progress'))
//     expect(mockOnFilterChange).toHaveBeenCalledWith('in_progress')
//   })

//   it('highlights active filter', () => {
//     render(<TaskFilter activeFilter="todo" onFilterChange={mockOnFilterChange} />)
    
//     const todoFilter = screen.getByText('Todo')
//     expect(todoFilter.parentElement).toHaveClass('bg-primary')
//   })
// })
