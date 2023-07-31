// export const host = 'http://192.168.0.116:5000';
export const host = 'http://ec2-13-50-245-5.eu-north-1.compute.amazonaws.com:5000';
export const apiUrls = {
  login: host+'/login',
  register: host+'/register',
  tap: host+'/tap/', //tap/:count/:email
  tapCount: host+'/tapCount/',
  logout: host+'/logout',
  forgotPassword:host+'/forgotPassword',
  rewardEmail:host+'/rewardEmail',
  sendEmail:host+'/send-email',
  rewardDetails:host+'/rewardDetails',
  history:host+'/history',
  contact:host+'/contact'

  // login: host+'/login',
};