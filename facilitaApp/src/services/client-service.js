import HttpService from "./htttp.service";

class ClientService {
  // authEndpoint = process.env.API_URL;

  clients = async (payload) => {
    const clientEndpoint = 'clients/';
    return await HttpService.post(clientEndpoint, payload);
  };

  register = async (credentials) => {
    const registerEndpoint = 'clients/register';
    return await HttpService.post(registerEndpoint, credentials);
  };

  delete = async (id) => {
    const deleteEndpoint = 'clients/delete';
    return await HttpService.post(deleteEndpoint, id);
  };

  forgotPassword = async (payload) => {
    const forgotPassword = 'password-forgot';
    return await HttpService.post(forgotPassword, payload);
  }

  resetPassword = async (credentials) => {
    const resetPassword = 'password-reset';
    return await HttpService.post(resetPassword, credentials);
  }

  getProfile = async() => {
    const getProfile = 'me';
    return await HttpService.get(getProfile);
  }

  updateProfile = async (newInfo) => {
    const updateProfile = "me";
    return await HttpService.patch(updateProfile, newInfo);
  }
}

export default new ClientService();
