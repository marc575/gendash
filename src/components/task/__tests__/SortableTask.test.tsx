// import { render, screen, fireEvent } from '@testing-library/react'
// import { SortableTask } from '../SortableTask'
// import { Task } from '@/types/Task'
// import { DndProvider } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'

// const mockTask: Task = {
//   id: '1',
//   title: 'Test Task',
//   description: 'Test Description',
//   status: 'open',
//   priority: 'Medium',
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
//   dueDate: new Date().toISOString(),
//   assignee: {
//     id: '1',
//     name: 'John Doe',
//     email: 'john@example.com',
//     avatar: '/avatars/john.jpg'
//   },
//   comments: [],
//   activities: []
// }

// const renderWithDnd = (ui: React.ReactElement) => {
//   return render(
//     <DndProvider backend={HTML5Backend}>
//       {ui}
//     </DndProvider>
//   )
// }

// describe('SortableTask', () => {
//   const mockOnMove = jest.fn()
//   const mockIndex = 0

//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   it('renders task content correctly', () => {
//     renderWithDnd(
//       <SortableTask 
//         task={mockTask}
//         index={mockIndex}
//         onMove={mockOnMove}
//       />
//     )
    
//     expect(screen.getByText('Test Task')).toBeInTheDocument()
//     expect(screen.getByText('Test Description')).toBeInTheDocument()
//   })

//   it('applies drag preview class when dragging', () => {
//     renderWithDnd(
//       <SortableTask 
//         task={mockTask}
//         index={mockIndex}
//         onMove={mockOnMove}
//       />
//     )
    
//     const taskElement = screen.getByTestId('sortable-task')
//     fireEvent.dragStart(taskElement)
    
//     expect(taskElement).toHaveClass('opacity-50')
    
//     fireEvent.dragEnd(taskElement)
//     expect(taskElement).not.toHaveClass('opacity-50')
//   })

//   it('handles drop on valid target', () => {
//     renderWithDnd(
//       <>
//         <SortableTask 
//           task={mockTask}
//           index={0}
//           onMove={mockOnMove}
//         />
//         <SortableTask 
//           task={{...mockTask, id: '2'}}
//           index={1}
//           onMove={mockOnMove}
//         />
//       </>
//     )
    
//     const sourceTask = screen.getAllByTestId('sortable-task')[0]
//     const targetTask = screen.getAllByTestId('sortable-task')[1]
    
//     fireEvent.dragStart(sourceTask)
//     fireEvent.drop(targetTask)
    
//     expect(mockOnMove).toHaveBeenCalledWith(0, 1)
//   })

//   it('prevents drop on invalid target', () => {
//     renderWithDnd(
//       <SortableTask 
//         task={mockTask}
//         index={mockIndex}
//         onMove={mockOnMove}
//         isDropDisabled={true}
//       />
//     )
    
//     const taskElement = screen.getByTestId('sortable-task')
//     fireEvent.dragStart(taskElement)
//     fireEvent.drop(taskElement)
    
//     expect(mockOnMove).not.toHaveBeenCalled()
//   })

//   it('displays correct priority indicator', () => {
//     renderWithDnd(
//       <SortableTask 
//         task={{...mockTask, priority: 'high'}}
//         index={mockIndex}
//         onMove={mockOnMove}
//       />
//     )
    
//     const priorityIndicator = screen.getByTestId('priority-indicator')
//     expect(priorityIndicator).toHaveClass('bg-red-500')
//   })
// })
