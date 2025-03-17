import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'


// Khởi tạo giá trị State của một Slice trong redux
const initialState = {
  currentUser: null
}
// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux
// dùng Middleware createAsyncThunk đi kèm với extraReducers

export const loginUserAPI = createAsyncThunk (
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk (
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage ) {
      toast.success('Logout successfully!', { theme: 'colored' })
    }
    return response.data
  }
)
// Khởi tạo một Slice trong redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
  },
  // extraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) =>
    {
    // action.payload là response.data từ API trả về
      const user = action.payload

      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) =>
    {
      state.currentUser = null
    })
  }
})

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch()
// tới nó để cập nhật lại dữ liệu thông qua reducer ( chạy đồng bộ)
// export const {} = userSlice.actions

// Selectors là nơi dành cho các components bên dưới gọi bằng useSelector()
// để lấy dữ liệu từ store về
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
// cái file này tên là activeBoardSlice nhưng chúng ta sẽ export 1 thứ tên là Reducer
// export default activeBoardSlice.reducer
export const userReducer = userSlice.reducer