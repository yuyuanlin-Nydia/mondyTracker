export const useUser = defineStore('user', {
  state: () => {
    return {
      isLoggedIn: false,
    }
  },
  getters: {},
  actions: {
    async login(query: loginReq) {
      const { success, message } = await getValidateToken(query)
      if(success){
        const token = useCookie('token'); 
        token.value = message.token
        setToken(message.token)
        this.isLoggedIn = true;
        useRouter().push('/user/overview')
      }
    },
    async logout(){
      const { success } = await logoutUser({ token: getToken()! })
      if(success){
        const token = useCookie('token'); 
        token.value = ''
        clearToken();
        this.isLoggedIn = false;
        useRouter().push('/')
      }
    }
  },
})

if(import.meta.hot){
 import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}