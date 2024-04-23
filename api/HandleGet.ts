import axiosClient from "./axiosClient"

export const questService = {
    getQuest: async () => {
      return (await axiosClient.get(`https://api.inz-dev.esollabs.com/v1/dapp/auth/sign`)).data
    },
    postQuest: async (params:any) => {
        return (await axiosClient.post(`https://api.inz-dev.esollabs.com/v1/dapp/auth/sign_in`,params)).data
    }
}