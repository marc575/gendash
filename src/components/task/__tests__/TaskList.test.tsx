// import { render, screen } from '@testing-library/react'
// import { TaskList } from '../TaskList'
// import { Task } from '@/types'

// const mockTasks: Task[] = [
//   {
//     id: '1',
//     title: 'Task 1',
//     description: 'Description 1',
//     status: 'todo',
//     priority: 'high',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     dueDate: new Date().toISOString(),
//     assignedTo: {
//       id: '1',
//       name: 'John Doe',
//       email: 'john@example.com',
//       avatar: '/avatars/john.jpg'
//     },
//     comments: [],
//     activities: []
//   },
//   {
//     id: '2',
//     title: 'Task 2',
//     description: 'Description 2',
//     status: 'in_progress',
//     priority: 'low',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     dueDate: new Date().toISOString(),
//     assignedTo: {
//       id: '2',
//       name: 'Jane Doe',
//       email: 'jane@example.com',
//       avatar: '/avatars/jane.jpg'
//     },
//     comments: [],
//     activities: []
//   }
// ]

// describe('TaskList', () => {
//   it('renders all tasks', () => {
//     render(<TaskList tasks={mockTasks} />)
    
//     expect(screen.getByText('Task 1')).toBeInTheDocument()
//     expect(screen.getByText('Task 2')).toBeInTheDocument()
//   })

//   it('renders empty state when no tasks', () => {
//     render(<TaskList tasks={[]} />)
    
//     expect(screen.getByText('No tasks found')).toBeInTheDocument()
//   })

//   it('applies correct sorting', () => {
//     render(<TaskList tasks={mockTasks} sortBy="priority" />)
    
//     const tasks = screen.getAllByTestId('task-item')
//     expect(tasks[0]).toHaveTextContent('Task 1') // high priority
//     expect(tasks[1]).toHaveTextContent('Task 2') // low priority
//   })

//   it('applies correct filtering', () => {
//     render(<TaskList tasks={mockTasks} filter="todo" />)
    
//     expect(screen.getByText('Task 1')).toBeInTheDocument()
//     expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
//   })
// })
