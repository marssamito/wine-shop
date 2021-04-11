export default function ({ $axios, $store }) {
  $axios.interceptors.response.use(
    (success) => {
      // console.log(JSON.stringify(success) + 'responsesss')
      if (
        success.status === 200 ||
        success.status === 201 ||
        success.status === 202 ||
        success.status === 204
      ) {
        return Promise.resolve(success)
      } else {
        return Promise.reject(success)
      }
    },
    (error) => {
      // console.log(JSON.stringify(error.response) + 'erros')
      if (error.response.status === 422 || error.response.status === 419) {
        const values = {
          message: error.response.data.message,
          status: 'error',
          formErrors: error.response.data.errors,
        }
        return Promise.reject(values)
      } else if (error.response.status === 401) {
        const values = {
          message: error.response.statusText,
          status: 'error',
        }
        return Promise.reject(values)
      } else if (error.response.status === 400) {
        const values = {
          message: error.response.data.message,
          status: 'error',
        }
        return Promise.reject(values)
      } else if (error.response.status === 404) {
        const values = {
          message: "It look's like the link doesn't exist!",
          status: 'error',
        }
        return Promise.reject(values)
      }
      // else if (error.response.status === 500) {
      //   const values = {
      //     message: error.message, // 'Something went wrong! Try again', // error.message,
      //     status: 'error',
      //   }
      //   return Promise.reject(values)
      // }
      else {
        return Promise.reject(error)
      }
    }
  )
}
