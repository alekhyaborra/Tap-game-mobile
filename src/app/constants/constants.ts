export class Constants {
    public static mapboxAccessToken = "pk.eyJ1IjoidmVua2F0ZXNoYmVuZGkiLCJhIjoiY2p1bm5laGZ6MDY0cTQ1bnR2aHd1ZHRwZyJ9.XkLtWxZWzrpNxSdY4jOE2g"
    public static mapCenterPoint = [78.491684, 17.387140];
    public static googleMapCenterPoint = { lat: 17.387140, lng: 78.491684 };
    public static osmPoints = [17.387140, 78.491684];
    public static mapStartZoom = 6;
    public static dashboardTaskName = "Assignments";
    public static dashboardFormName = "Forms";
    public static taskListHeader = "Assignments";
    public static formListHeader = "Forms";
    public static workOrderHeader = "Work orders";
    public static notificationsHeader = "Notifications";
    public static settingsHeader = "Settings";
    public static dashboardWorkOrderName = "Work orders";
    public static internalServerProblem = "Internal Problem, please try Again";
    public static userActiveMessabe = "User is active in another device. Do you want to continue?";
    public static sessionExpired = "Session Expired, please login again";
    public static invalidUser = "Invalid credentials";
    public static recordsLimit = 12;
    public static infiniteScrollText = "Loading more data...";
    public static history = "History";
    public static noDataFound = "No data found";
    public static formSave = "Form saved successfully";
    public static sprintToast = "Functionality will be released in Sprint 3";
    public static noDataAlert = "No data found";
    public static invalidFormEntry = "Please fill the required fields";
    public static geoTaggginginProgress = 'Please wait untill geo tagging/annotation process complited on captured images';
    public static undefined = "undefined";
    public static prepopErrorInfo = "Unable to fetch prepop data, do you want to continue"
    public static offlineAlert = "No connection";
    public static offlineSaveAlert = "No connection. Don't worry we will save your data";
    public static checkNetwork = "Please check your network connection and try again";
    public static offlineServiceHit = "You are Offline";
    public static downloadComplete = "Download completed successfully";
    public static offlineStatus = 5001;
    public static downloadInProgress = "Downloading in progress";
    public static noDataFoundStatus = 204;
    public static noWO = "Work orders not available for this assignment";
    public static taskDP = 25;
    public static formDP = 35;
    public static remainingDP = 65;
    public static wODeleteConfirmation = "Do you want delete work order?";
    public static wODeleteConfirmationPrepop = "Do you want delete work order, if you delete you will get the original work order?";
    public static wODeleted = "Work order deleted successfully";
    public static nullValue = null;
    public static nullString = "null";
    public static exitApp = "Press back again to exit app";
    public static noLocationForWorkorders = "Few workorders don't have location";
    public static toastCloseText = "Go offline";
    public static unableToGetLocation = "Unable to get location, please turn on your device's access";
    public static calculationError = "Some fields are missing to fill";
    public static downloadParameter = "download";
    public static openform = "openform";
    public static toastForText = "Press and hold anywhere on screen to add text"
    public static dotTextFormview = "We are almost done, preparing form view"
    public static spinTextFormFetch = "Please hold tight, we are fetching the form"
    public static noRecordFound = "No Records to Sync"
    public static internalProcessProblem = "Internal process problem, please try again"
    public static workorderSubmitProcess = "WoW! you have done good job, we are proccesing your request "
    public static fetchLocation = "Fetching your location"
    public static syncProcess = "Good Job! we have  taken your request and processing in background, you can check the status by clicking on assignment sync button"
    public static videoOfflineToast = "Sorry, video cannot be played in offline mode"
    public static pwdchangeSuccess = "Password changed successfully, please login"
    public static tapPlusForNewRecord = "Tap on + to create a record"
    public static somethingWentWrong = "Something went wrong, Please try again";
    public static assetRecordsLimit = 20;
    public static assetModelType = "Assets";
    public static referenceListOptionsLimit = 50;
    public static status = {
        new: 0,
        reassigned: 3,
        sync: "Ready to sync",
        saved: 4,
        submitted: 5
    }
    public static referenceListTabe = {
        tableName: "referenceListTabe",
        autoIncId: "id",
        name: 'name',
        value: 'value',
        version: 'version'
    }
    public static lookUpTabel = {
        tableName: "lookUpTabel",
        autoIncId: "id",
        name: 'name',
        value: 'value',
        version: 'version'
    }
    public static dependencyConditionsTable = {
        tableName: "derivedConditions",
        autoIncId: "id",
        formId: 'formId',
        value: 'value',
        version: 'version'
    }
    public static statusValue = {
        "New": 0,
        "Reassigned": 3,
        "Saved": 4,
    }

    public static statusName = {
        0: "New",
        3: "Reassigned",
        sync: "Ready to sync",
        4: "Saved",
    }

    public static statusNameMap = {
        0: "new",
        3: "re-assign",
        4: "saved",
    }

    public static formListKeys = {
        formId: "_id",
        formName: "name",
        syncStatus: "syncStatus"

    }

    public static formRecordListKeys = {
        recordId: "_id",
        name: "displayName",
        formName: "formName",
    }

    public static workOrderListKeys = {
        recordId: "_id",
        displayName: "displayValue",
        status: "status",
        taskName: "name",
        dueDate: "endDate",
        formId: "formId",
        taskId: "taskId",
        projectId: "projectId",
        projectName: "projectName",
        assignedBy: "assignedBy",
        startDate: "startDate",
        offlineId: "id",
        assignmentId: "assignmentId",
        formName: "formName",
        isValid: "isValid",
        formValues: "formValues"
    }

    public static taskListKeys = {
        assignmentId: "_id",
        assignmentName: "name",
        taskId: "taskId",
        taskName: "taskName",
        status: "status",
        assignedBy: "createdBy",
        dueDate: "endDate",
        projectId: "projectId",
        startDate: "startDate",
        formId: "formId",
        syncStatus: "syncStatus"
    }

    public static taskRecordKeys = {
        recordId: "_id",
        displayName: "displayValue",
        status: "status",
        taskName: "name",
        dueDate: "endDate",
        formId: "formId",
        startDate: "startDate",
        assignedBy: "assignedBy",
        offlineId: "offlineId"
    }

    public static taskInfoKeys = {
        createdBy: "createdBy",
        taskName: "name",
        startDate: "startDate",
        endDate: "endDate"
    }

    public static recordInfoKeys = {
        formName: "formName",
        status: "status",
        formNameVisable: "formNameVisable",
        comments: "comments",
        Comment: "Comment"
    }

    public static formInfoKeys = {
        createdBy: "createdBy",
        formName: "name",
        description: "description"
    }

    public static dashboardTaskKeys = {
        assigned: "Assigned",
        completed: "Completed",
        inProgress: "InProgress",
        ReAssigned: "Reassigned",
        total: "total"
    }

    public static filter = {
        groupby: "Group by",
        recordsby: "Records by",
        sortby: "Sort by",
        projects: "Projects",
        tasks: "Tasks",
        new: "New",
        saved: "Saved",
        reassigned: "Reassigned",
        assigned: "Assigned",
        startDate: "Start Date",
        dueDate: "Due Date",
        fromDate:"fromDate",
        toDate:"toDate"
    }

    public static workOrderFilter = [
        {
            Heading: "Group by",
            Elements: [Constants.filter.projects, Constants.filter.tasks]
        },
        {
            Heading: "Records by",
            Elements: [Constants.filter.new, Constants.filter.saved, Constants.filter.reassigned]
        },
        {
            Heading: "Sort by",
            Elements: [Constants.filter.assigned, Constants.filter.startDate, Constants.filter.dueDate]
        }
    ]
    public static commonFilter = [
        {
            Heading: "Sort by",
            Elements: [Constants.filter.assigned, Constants.filter.startDate, Constants.filter.dueDate]
        }
    ]
    public static loginKeys = {
        user: 'user',
        message: 'message',
        mapType: 'mapType',
        appVersion: 'appVersion'
    }

    public static ellipseListConstants = {
        sync: "Sync",
        selectAll: "Select all",
        download: "Download",
        history: "History",
        camera: "Camera",
        gallery: "Gallery",
        sketching: "Sketching",
        attachmnet: 'Attachments',
        searchvalue: 'Search'
    }

    public static formEllipseList = [
        Constants.ellipseListConstants.sync,
        Constants.ellipseListConstants.selectAll,
        Constants.ellipseListConstants.download
    ]

    public static formRecordsEllipseList = [
        Constants.ellipseListConstants.sync,
        Constants.ellipseListConstants.selectAll,
        Constants.ellipseListConstants.history
    ]

    public static workOrderEllipseList = [
        // Constants.ellipseListConstants.sync,
        // Constants.ellipseListConstants.selectAll,
        // Constants.ellipseListConstants.download,
        Constants.ellipseListConstants.history
    ]

    public static taskEllipseList = [
        Constants.ellipseListConstants.sync,
        Constants.ellipseListConstants.selectAll,
        Constants.ellipseListConstants.download
    ]

    public static notificationsKeys = {
        actionType: "actionType",
        _id: "_id",
        adminName: "adminName",
        comments: "comments",
        createdTime: "createdTime",
        displayValues: "displayValues",
        formId: "formId",
        recordId: "recordId",
        status: "status",
        taskId: "taskId",
        assignmentId: "assignmentId",
        taskName: "taskName",
        user: "user",
        __v: "__v",
        assignmentName: "assignmentName"
    }
    public static historyKey = {
        formName: "formName",
        _id: "_id",
        status: "status",
        submittedBy: "submittedBy",
        displaykey: "displaykey",
        submittedTime: "submittedTime",
        formId: "formId",
        recordId:"recordId"

    }

    public static filterParams = {
        new: "New",
        reassign: "Reassigned",
        task: "task",
        workorder: "wo"
    }

    public static routingConstants = {
        login: "login",
        dashboard: "dashboard",
        changePassword: "changePassword"
    }

    public static routingParams = {
        username: ":username",
        usertype: ":userType"
    }

    public static saveWO = {
        wOTable: "workOrder",
        autoIncId: "id",
        formId: "formId",
        userId: "userId",
        formValues: "formValues",
        isValid: "isValid",
        taskId: "taskId",
        recordId: "recordId",
        recordComments: "recordComments",
        recordType: "status",
        lat: "lat",
        long: "long",
        videoOptions: "videoOptions",
        isVideoAvailable: "isVideoAvailable",
        assignmentId: "assignmentId",
        insertDate: "insertDate",
        taskName: "name",
        displayValue: "displayValue",
        dueDate: "endDate",
        sketching: "sketching",
        AssignedRecordTime:"AssignedRecordTime"
    }
    public static userProfileTable = {
        table: "userProfileTable",
        id: "id",
        appVersion: "appVersion"
    }
    public static widgetsTable = {
        table: "formsTable",
        skeleton: "skeleton",
        formId: "formId",
        userId: "userId",
        name: "name",
        version: "version",
        description: "description",
        createdBy: "createdBy",
        displayName: "displayName",
        formType: "formType",
        derivedFields: "derivedFields",
        downloadedFrom: "downloadedFrom",
        isValid: "isValid"
    }
    public static syncAssignMentTable = {
        table: "syncAssignmentTable",
        assignmentId: "assignmentId",
        recordsCount: "recordsCount",
        status: "status",
        formId: "formId",
    }
    public static syncWorkorderTable = {
        table: "syncAssignmentWorkOrderTable",
        assignmentId: "assignmentId",
        recordId: "recordId",
        multiMediaCount: "multiMediaCount",
        status: "status",
        formId: "formId"
    }
    public static syncWorkorderMultiMediaTable = {
        table: "syncWorkorderMultiMediaTable",
        recordId: "recordId",
        fieldId: "fieldId",
        status: "status"
    }

    public static taskDownloadKeys = {
        taskInfoKey: "taskInfo",
        taskAssignmentsInfoKey: "taskAssignmentsInfo",
        taskInfo: {
            name: "name",
            status: "status",
            createdBy: "createdBy",
            startDate: "startDate",
            endDate: "endDate",
            id: "_id"
        },
        taskAssignmentsInfo: {
            id: "_id",
            name: "name",
            startDate: "startDate",
            endDate: "endDate",
            formId: "formId"
        },
        recordsCount: "recordsCount"
    }

    public static wODownloadKey = {
        docs: "docs",
        status: "status"
    }

    public static taskTable = {
        tableName: "task",
        autoIncId: "id",
        taskId: "taskId",
        userId: "userId",
        name: "name",
        status: "status",
        createdBy: "createdBy",
        startDate: "startDate",
        endDate: "endDate",
        isPrepop: "isPrepopAttached"
    }

    public static assignmentTable = {
        tableName: "assignment",
        autoIncId: "id",
        taskId: "taskId",
        assignmentId: "assignmentId",
        formId: "formId",
        userId: "userId",
        status: "status",
        name: "name",
        createdBy: "createdBy",
        startDate: "startDate",
        endDate: "endDate"
    }

    public static tabs = {
        wo: false,
        tasks: true,
        forms: true

    }

    public static wODownloadKys = {
        docs: "docs",
        total: "total",
        limit: "limit",
        page: "page",
        pages: "pages",
        displayField: "displayField",
        status: "status"
    }

    public static wOQueryLimit = {
        limit: 50
    }

    public static modalHeader = {
        clear: "Clear",
        filter: "Apply",
        close: "Close",
        assignments: "Assignments"
    }

    public static imageIcons = {
        checked: "assets/images/checked.svg",
        forms: "assets/images/Forms.svg",
        tasks: "assets/images/Tasks.svg",
        red: "assets/images/red.svg",
        green: "assets/images/green.svg",
        yellow: "assets/images/yellow.svg",
        workOrder: "assets/images/Work_orders.svg",
        notifications: "assets/images/notifications.svg",
        settings: "assets/images/Settings.svg",
        logo: "assets/images/logo.png",
        profile: "assets/images/Profile.svg",
        lock: "assets/images/Lock.svg",
        eyeOn:"assets/Eye-on.svg",
        eyeOff:"assets/Eye-off.svg",
        filter: "assets/images/filter.svg",
        ellipsis: "assets/images/Ellipsis.svg",
        map: "assets/images/map-pin.svg",
        download: "assets/images/download-arrow.svg",
        sync: "assets/images/form_sync.svg",
        eqal: "assets/images/equal-symbol.svg",
        close: "assets/images/closedup.svg",
        undo: "assets/images/undodup.svg",
        redo: "assets/images/redodup.svg",
        save: "assets/images/checked (1)dup.svg",
        circleBox: "assets/images/Circle,box.svg",
        painter: "assets/images/painter-palette.svg",
        text: "assets/images/T.svg",
        p1: "assets/images/Pencil 1.svg",
        p2: "assets/images/Pencil 2.svg",
        p3: "assets/images/Pencil 3.svg",
        p4: "assets/images/Pencil 4.svg",
        back: "assets/images/back.svg",
        down: "assets/images/angle-arrow-down.svg",
        up: "assets/images/angle-arrow-up.svg",
        polygon: "assets/images/attention.svg",
        clearAll: "assets/images/Clear_all.svg",
        point: "assets/images/point.svg",
        cancel: "assets/images/cancel.svg",
        route: "assets/images/route.svg",
        menu: "assets/images/menu.svg",
        sketchingCancel: "assets/images/sketching_cancel.svg",
        sketchingEdit: "assets/images/sketching_edit.svg",
        sketchingFinish: "assets/images/sketching_finish.svg",
        sketchingSave: "assets/images/sketching_save.svg",
        sketchingUndo: "assets/images/sketching_undo.svg",
        mapMenu: "assets/images/map-menu.svg",
        search: "assets/images/Search.svg",
        currentLocation: "assets/images/CurrentLocation.svg",
        findAddress: "assets/images/map-pin-marked-blue.svg", 
        timer: "assets/images/timerLoad.svg",
        findRoute: "assets/images/findRoute.svg",
        bookmark: "assets/images/Bookmark.svg",
        measuringTool: "assets/images/measuringTool.svg",
        playVideo: "assets/images/play.svg",
        assetSearch: "assets/images/searchAddress.svg",
        searchAddress: "assets/images/searchAddress_2.svg",
        trash: "assets/images/trash.svg",
        assets:"assets/images/Asset-Black.svg"
    }

    public static infoTypes = {
        task: "taskInfo",
        wo: "recordInfo",
        form: "formInfo"
    }

    public static selectAction = {
        download: "download",
        sync: "sync",
        clear: "clear"
    }

    public static validationMessages = {
        login: {
            usernameRequired: "Username is required",
            passwordRequired: "Password is required"
        },
    }

    public static refresh = {
        pullingIcon: "arrow-down",
        pullingText: "Pull down to refresh",
        spinner: "circles",
        text: ""
    }

    public static notificationType = {
        taskAssignment: 0,
        workOrder: 1
    }

    public static databaseName = "Formsz.db";

    public static formDownLoadedType = {
        autoDownload: 1,
        manualDownload: 2
    }

    public static savedRecordMsgOne = "You haved saved records, please submit those records and try again";
    public static savedRecordMsgTwo = "Saved records, please submit those records and try again ";

    public static mapTypes = {
        mapBox: 'mapBox',
        googleMap: 'googleMap',
        osm: 'osm'
    }

    public static geometryTypes = {
        line: 'line',
        point: 'point',
        area: 'area'
    }

    public static geometryActionTypes = {
        // drawLine: 'drawLine',
        // drawPoint: 'drawPoint',
        // drawArea: 'drawArea',
        drawLine: 'Line',
        drawPoint: 'Point',
        drawArea: 'Polygon',
        saveGeometry: 'saveGeometry',
        deleteGeometry: 'deleteGeometry',
        editGeometry: 'editGeometry',
        deleteAllGeometry: 'deleteAllGeometry',
        finish: 'finish',
        cancel: 'cancel',
        deleteLastPoint: 'deleteLastPoint',
        drawingMenu: 'drawingMenu',
        gotoLocation: 'gotoLocation',
        addressSearch: 'addressSearch',
        openBookmark: 'Bookmark',
        measuringTool: 'measuringTool',
        assetSearch: 'assetSearch',
        FindBTtwoPoints: 'FindBTtwoPoints',
    }

    public static addSketchingMsg = "Please add sketching";
    public static deleteSketchingMsg = "Please click on sketching"
    public static sketchingSaved = "Sketching saved successfully";
    public static addressSearchText = "Search";
    // public gpsConfigs = {stationaryRadius: }

    public static appVersion = "5.0.0";
    public static appVersionKey = 'appVersion'
    public static versionUpdateAlertMsg = "You are using older version of the application. Kindly update application."
    public static versionUpdate = "You are on latest version "

    public static attachmentModal = {
        heading: "Files",
        close: "Close",
        newFiles: "New Files",
        uploadedFiles: "Uploaded Files"
    };
    public static tapPlusForNewFiles = "Tap on + to attach files";
    public static fileAttachError = "File attachment failed, please try again";
    public static attachAnotherFile = "There is an issue with issue with this file, please try attaching another file";
    public static maximumFileSizeinMB = 2;
    public static maximumNumberofFiles = 5;
    public static maximumFilesText = "You cannot upload more than ";
    public static maximumFileSizeText = "File size cannot exceed ";
    public static notsupport = "Not support to read this file";

   

    public static refListMsg = "The reference list is up to date";
    public static refListUpdateMsg = "Reference list updated successfully";
    public static zoomLevels = {
        gotoCurrentLocationZoomVal: 20
    }
    public static wms: 'wms';
    public static wmts: 'wmts';

}

export class DisplayConstants {
    public static properties = {
        dashboardTaskName: "Assignments",
        dashboardFormName: "Forms",
        formTabTag: 'View list of forms assigned to you',
        assignmentTabTag: 'View list of tasks assigned to you',
        versionUpdateAlertMsg: 'You are using older version of the application. Kindly update application.',
        assignedStatus: 'Assigned',
        completedStatus: "Completed",
        inProgressStatus: "In-progress",
        reAssignedStatus: "Reassigned",
        welcomeMessage: "Welcome",
        WorkOrders: 'Work Orders',
        noDataFound: "No data found",
        sync: "Sync",
        selectAll: "Select all",
        download: "Download",
        internalServerProblem: "Internal Problem, please try Again",
        statusLabel: 'Status',
        historyLabel: "History",
        tapPlusForNewRecord: "Tap on + create a record",
        wODeleteConfirmationPrepop: "Do you want delete work order, if you delete you will get the original work order?",
        wODeleteConfirmation: "Do you want delete work order?",
        wODeleted: "Work order deleted successfully",
        dotTextFormview: "We are almost done, preparing form view",
        fetchLocation: "Fetching your location",
        formSave: "Form saved successfully",
        workorderSubmitProcess: "WoW! you have done good job, we are proccesing your request ",
        noRecordFound: "No Records to Sync",
        internalProcessProblem: "Internal process problem, please try again",
        invalidFormEntry: "Please fill the required fields and valid data",
        attachmentModalheading: "Files",
        modalClose: "Close",
        attachmentNewFiles: "New Files",
        attachmentUploadedFiles: "Uploaded Files",
        attachAnotherFile: "There is an issue with issue with this file, please try attaching another file",
        fileAttachError: "File attachment failed, please try again",
        maximumFilesText: "You cannot upload more than ",
        maximumFileSizeText: 'File size cannot exceed',
        tapPlusForNewFiles: 'Tap on + to attach files',
        notsupport: 'Not support to read this file',
        offlineSaveAlert: "No connection. Don't worry we will save your data",
        downloadInProgress: "Downloading in progress",
        downloadComplete: "Download completed successfully",
        infiniteScrollText: "Loading more data...",
        // tslint:disable-next-line:max-line-length
        syncProcess: 'Good Job! we have  taken your request and processing in background, you can check the status by clicking on assignment sync button',
        savedRecordMsgOne: "You haved saved records, please submit those records and try again",
        assignedByLabel: "Assigned By", dueDateLabel: "Due Date",
        netwrokLabel: "Network",
        slectGpsDeviceLabel: "Select gps device",
        gpsTrackerLabel: "GPS tracker",
        changePasswordLabel: "Change password",
        aboutUsLabel: "About us",
        versionLabel: "Version",
        logoutBtnLabel: "Logout",
        lastLoginLabel: "Last login on ",
        offlieAlertLabel: "You are offline",
        onlineAlertLabel: "You are online",
        updateAvialableLabel: "Update available",
        checkNetwork: "Please check your network connection and try again",
        settingsHeader: "Settings",
        versionUpdate: "You are on latest version ",
        enterOldPassword: "Enter old password",
        passwordWrong: "Password is wrong!", enterNewPassword: "Enter new password",
        oldNewPasswordMissmatch: "old password and new password should not match.",
        passwordRequired: "Password is required",
        passwordDontOld: "Passwords do not newold!",
        // tslint:disable-next-line:max-line-length
        passwordPatternAlert: ' The password must contain atleast one lowercase letter, one uppercase letter, one numeric digit, one special character and length should be greater than 8 characters.',
        passwordNotMatch: "Passwords do not match!",
        submitButtonLabel: "Submit",
        conformNewPassword: "Confirm new password",
        gpsDeviceHeading: "GPS Devices",
        pairedDeviceList: "Paired  devices list",
        noPairedDevices: "No paired devices",
        pleasePairDevice: "Please pair your bluetooth device",
        pleaseEnableDevice: "Please enable your bluetooth",
        blueToothNotEnable: "Bluetooth not enable",
        gpsDetails: "GPS details",
        latitudeLabel: "Latitude",
        longitudeLabel: "Longitude",
        accuracyLabel: "Accuracy",
        forGgotPasswordAlert: "FORGOT PASSWORD",
        signInLabel: "SIGN IN",
        getPasswordLabel: "GET PASSWORD",
        usernameRequired: "Username is required",
        saveLabel: "SAVE",
        measureLength: "Measured Length",
        landMarkLocation: "LandMark Location",
        gotoFormFill: "Go To Form Fill",
        formName: " Form Name",
        noLocationForWorkorders: "Few workorders don't have location",
        dataModelHeading: "Data Modal Heading",
        addressSearchText: "Search",
        notificationsHeader: "Notifications",
        sketchingSaved: "Sketching saved",
        addSketchingMsg: "Please add sketching",
        unableToGetLocation: "Unable to get location, please turn on your device's access",
        deleteSketchingMsg: "Please click on sketching to remove and click on done button to save changes",
        sessionExpired: "Session Expired, please login again",
        close: "Close",
        storeLinkNotAvilable: 'store link not available',
        referenceListLabel: 'Reference list',
        turnOngpsMessage: "Please Turn On location Services from Settings for accurate data capture",
        PhotoCaptureGpsAlert: "Photo will not be Geo Tagged as Location services are not switched on"
    }
}


