export class ApiUrls {
    //public static host = "http://192.168.0.17:3128";
    // public static host = "https://demo.fieldon.com:3128";
    //public static host = "http://183.82.100.86:2128";
    // public static host =  window["env"]["apiUrl"] || "http://localhost:3128";
    // public static host = 'http://fieldondev-env.m3gnyetmgz.us-east-2.elasticbeanstalk.com';
     // public static host = 'http://fieldon-env.m2d8fdpath.us-east-2.elasticbeanstalk.com';
    //183.82.100.86:2017 
     // public static host = "https://demo.fieldon.com";
    //  public static host="https://192.168.110.44:4534"

      public static host = "https://192.168.110.44:4534";
     //  public static host = "http://192.168.110.43:2136";
    // public static host = "http://192.168.110.43:2137";
    public static baseUrl = ApiUrls.host + '/api/v1';
    public static unsecureUrl = ApiUrls.host + '/api/v';
    public static gridFSUrl = ApiUrls.host + '/api/v2';
    // public static uniqUrl = ApiUrls.host;
    public static uniqUrl = ApiUrls.host+'/api/v0';

    public static login = ApiUrls.uniqUrl + '/login';
    public static changePassword = ApiUrls.uniqUrl + '/pwdchange';
    public static pwdCheckforChangePassword = ApiUrls.uniqUrl + '/pwdCheckforChangePassword';
    public static getTasks = '/mobileServices/workAssignments';
    public static getTaskRecords = "/mobileServices/fetchRecordsBasedOnTaskId";
    public static getWorkOrders = ApiUrls.baseUrl+"/mobileServices/fetchWorkAssignmentRecords";
    public static getForms = "/mobileServices/fetchFormsforUser";
    public static getAssetForms = "/assets/fetchFormsforUser";
    public static getFormRecords = "";
    public static getWorkOrderInfo = ApiUrls.baseUrl+"/mobileServices/fetchRecorddata";
    public static getTaskInfo = "/mobileServices/taskInfo";    public static getFormInfo = "/mobileServices/formInfo";
    public static getFilteredRecords = ApiUrls.baseUrl+"/mobileServices/getAssignments"
    public static notifications = ApiUrls.baseUrl+"/notifications/getNotifications/"
    public static getForm = ApiUrls.baseUrl+"/forms/formSkeleton"
    public static dashboard = ApiUrls.baseUrl+"/mobileservices/userDashboard";
    public static licenseReleaseForExistinglogin = ApiUrls.uniqUrl+'/licenseReleaseForExistinglogin';
    public static logout = ApiUrls.uniqUrl+"/logout";
    public static formsubmit = ApiUrls.baseUrl +'/mobileServices/addRecord';
    public static searchList = ApiUrls.baseUrl+"/mobileServices/searchFormsorAssignments";
    public static history = ApiUrls.baseUrl+"/mobileServices/getHistory";
    public static getTaskForms = ApiUrls.baseUrl+"/mobileServices/fetchFormsBasedOnTaskId"
    public static changeNotificationStatus = ApiUrls.baseUrl+"/notifications/notificationChange/";
    public static assignmentDownload = ApiUrls.baseUrl+"/mobileServices/taskDownload";
    public static wODownload = ApiUrls.baseUrl+"/mobileServices/fetchAssignmentRelatedRecords";
    public static getNotificationRecord = ApiUrls.baseUrl+"/mobileServices/recordInformation";
    public static sendDeviceKey = ApiUrls.baseUrl+"/pushNotifications/addOrEditFCMKey";
    public static getImageorVideo = ApiUrls.gridFSUrl+"/gridFS/fetchImageOrVideo"
    public static fetchImageOrVideoExists = ApiUrls.gridFSUrl+"/gridFS/fetchImageOrVideoExists"

    
    public static forgotPassword = ApiUrls.uniqUrl+"/forgotpwd";
    public static geometryForm =  ApiUrls.baseUrl + '/forms/getSketchingFormSkeleton';
 
    // gps tracking apis
    public static trackAPi = ApiUrls.baseUrl + '/locations/insertLocation';
    public static troubleShoot = ApiUrls.baseUrl + '/locations/troubleshoot';

    // dropdown apis
    public static dynamicDropDwon = ApiUrls.baseUrl + '/forms/dynamicDropdown';

    public static getAppVersion =  ApiUrls.baseUrl + '/deviceManagement/getAppVersion';

    public static uploadFiles = ApiUrls.gridFSUrl + '/gridFS/getAttachmentsOfRecordId';

    public static getAttachment = ApiUrls.gridFSUrl + '/gridFS/getAttachedReferenceOfForm';

    public static getAttachmmentConfigureation = ApiUrls.baseUrl + '/configurations/getAttachmentsConfig';

    //Reference List.
    public static referenceList = ApiUrls.baseUrl + '/forms/checkDynamicDropdownVersion';
    public static getLayersForTask = ApiUrls.baseUrl + '/layer/getLayerForTasks';
    public static featureInfoURL:'https://snow.fieldon.com.au/geoserver/wms?service=WMS&version=1.1.0&request=GetFeatureInfo&layers='
    public static getLayersForForm = ApiUrls.baseUrl + '/layer/getLayerForForms';
    public static derivedConditionsByFormId = ApiUrls.baseUrl + '/dependencyconditons/listConditions';
    public static lookUpTableList = ApiUrls.baseUrl + '/forms/getReferenceListData';


      // bookmarks
      public static addBookmark = ApiUrls.baseUrl + '/bookmarks/addBookmark';
      public static getBookmark = ApiUrls.baseUrl + '/bookmarks/getBookmarks';
      public static editBookmark = ApiUrls.baseUrl + '/bookmarks/editBookmark';
      public static deleteBookmark = ApiUrls.baseUrl + '/bookmarks/deleteBookmark';

}
