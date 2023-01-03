package cordova.plugin.data.sync.interfaces.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by mmvb45 on 02-07-2019.
 */

public class WorkOrderModel {
    private String formName;
    private String formId;
    private String recordId;
    private String assignmentId;
    private String submittedBy;
    private String taskName;
    private String taskId;
    private String submittedTime;
    private int status;
    private Boolean isSync;
    private String formValues;

    public String lat;
    public String longtitude;

    public String getLat() {
        return lat;
    }

    public String getLongtitude() {
        return longtitude;
    }

    private boolean isNewRecord;
    public String getFormName() {
        return formName;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public void setLongtitude(String longtitude) {
        this.longtitude = longtitude;
    }

    public String getFormId() {
        return formId;
    }

    public String getRecordId() {
        return recordId;
    }

    public String getAssignmentId() {
        return assignmentId;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public String getTaskName() {
        return taskName;
    }

    public String getTaskId() {
        return taskId;
    }

    public String getSubmittedTime() {
        return submittedTime;
    }

    public int getStatus() {
        return status;
    }

    public Boolean getSync() {
        return isSync;
    }


    public WorkOrderModel(String formName, String formId, String recordId, String assignmentId, String submittedBy, String taskName, String taskId, String submittedTime, int status, Boolean isSync,String formValues, Boolean isNewRecord, String lat,String longtitude ) {
        this.formName = formName;
        this.formId = formId;
        this.recordId = recordId;
        this.assignmentId = assignmentId;
        this.submittedBy = submittedBy;
        this.taskName = taskName;
        this.taskId = taskId;
        this.submittedTime = submittedTime;
        this.status = status;
        this.isSync = isSync;
        this.formValues = formValues;
        this.isNewRecord = isNewRecord;
        this.lat = lat;
        this.longtitude = longtitude;
    }
    //    private Integer id;
//    private int userId;
//    private String tittle;
//
//
//    public int getId() {
//        return id;
//    }
//
//    public WorkOrderModel(int userId, String tittle, String text) {
//        this.userId = userId;
//        this.tittle = tittle;
//        this.text = text;
//    }
//
//    public int getUserId() {
//        return userId;
//    }
//
//    public String getTittle() {
//        return tittle;
//    }
//
//    public String getText() {
//        return text;
//    }
//
//    @SerializedName("body")
//    private String text;

}
