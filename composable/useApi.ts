const useApi = function(url: string, body: Record<string, any> = {}): Promise<any>{
  const { $toast } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig()
  const { apiBaseURL } = runtimeConfig.public
  return useFetch(url,{
    baseURL: apiBaseURL,
    method: "POST",
    body,
    credentials: 'include',
    watch: false,
    onResponseError({ request, response, options }) {
      // 處理請求回應發生的錯誤
      console.log(response)
    },
  })
  .then(res => {
    const data: any = res.data.value
    const error = res.error.value
    if(data){
      if(data.error){
        $toast.error(data.error.message)
      }
      return data
    }

    if (error) {
      console.log(error)
    }
  })
}

// Log In & Sign Up & Log out 
export async function getValidateToken(query: logInReq){
  return await useApi('/user/getValidateToken', query)
}

export async function signUp(query: signUpReq){
  return await useApi('/user/signUp', query)
}

export async function getUser(): Promise<getUserRes>{
  return await useApi('/user/getUser')
}

export async function logoutUser(query: logoutReq){
  return await useApi('/user/logout', query)
}

// Overview page
export async function getLatestWallet(): Promise<getLatestWalletRes>{
  return await useApi('/wallet/getLatestWallet')
}

export async function getWalletTotalAmount(): Promise<getWalletTotalAmountResObj[]>{
  return await useApi('/wallet/getWalletTotalAmount')
}

export async function getWalletAnalysis(type: string): Promise<getWalletAnalysisRes>{
  return await useApi('/wallet/getWalletAnalysis', {type})
}

// Wallet page
export async function getWallet(query: IWalletQuery): Promise<getWalletRes[]>{
  return await useApi('/wallet/getAll', query)
}

export function addSingleWallet(query: IWalletItem){
  return useApi('/wallet/addOne', query)
}

export function editSingleWallet(query: IWalletItem){
  return useApi('/wallet/edit', query)
}

export function editSingleWalletCategory(query: Pick<IWalletItem,'_id' | 'category'>[]){
  return useApi('/wallet/editCategory', query)
}

export function deleteSingleWallet(id: string){
  return useApi('/wallet/deleteOne', { id })
}

//Analysis Page 
export function getAnalysisData(query: Pick<IWalletQuery, 'date' | 'type'>): Promise<getAnalysisDataRes>{
  return useApi('/analysis/getData', query)
}

export function getWalletRateAndTotal(): Promise<getWalletRateAndTotalRes[]>{
  return useApi('/analysis/getWalletRateAndTotal')
}