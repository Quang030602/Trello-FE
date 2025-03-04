import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'

// Khởi tạo giá trị State của một Slice trong redux
const initialState = {
  currentActiveBoard: null
}
// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux
// dùng Middleware createAsyncThunk đi kèm với extraReducers

export const fetchBoardDetailsAPI = createAsyncThunk (
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)
// Khởi tạo một Slice trong redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
    // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer
    // chúng ta gắn nó ra 1 biến có nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu nếu cần thiết

      //update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) =>
    {
    // action.payload là response.data từ API trả về
      let board = action.payload
      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Khi f5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
        // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần Fix bug quan trọng)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      state.currentActiveBoard = board
    })
  }
})

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch()
// tới nó để cập nhật lại dữ liệu thông qua reducer ( chạy đồng bộ)
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors là nơi dành cho các components bên dưới gọi bằng useSelector()
// để lấy dữ liệu từ store về
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}
// cái file này tên là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer