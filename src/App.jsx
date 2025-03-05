import { Routes, Route, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/NotFound'

function App() {
  return (
    <Routes>

      <Route path='/' element={
        <Navigate to='/boards/67b54524fb02d348daeef05d' replace={ true } />
      }/>

      <Route path='/boards/:boardId' element={ <Board /> }/>

      <Route path='*' element={<NotFound/> }/>
    </Routes>
  )
}

export default App
