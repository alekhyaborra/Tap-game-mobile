package cordova.plugin.data.sync;


import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.file.FileUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.File;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import cordova.plugin.data.sync.interfaces.models.NetworkClient;
import cordova.plugin.data.sync.interfaces.models.UserAndEvents;
import cordova.plugin.data.sync.interfaces.models.WorkOrderInterface;
import cordova.plugin.data.sync.interfaces.models.WorkOrderModel;
import io.reactivex.Observer;
import io.reactivex.Scheduler;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;

import android.content.ContentValues;
import android.provider.Settings;
import android.widget.Toast;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import android.content.Context;
import android.database.Cursor;
import io.reactivex.Observable;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.util.Log;

import com.google.gson.JsonObject;
import java.util.Random;

/**
 * This class echoes a string called from JavaScript.
 */
public class DataSync extends CordovaPlugin {
    private String dbTableQuery="SELECT * FROM workOrder";
    private SQLiteDatabase db = null;
    private  String dbPath=null ;
    WorkOrderInterface workOrderInterface;
    private  int workOrderMultiMediaTotalCount = 0;
    private  int workOrderMultiMediaProcessedCount = 0;
    Retrofit retrofit;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
      /*Method which initializes the plugin variables
      * */
        super.initialize(cordova, webView);
        dbPath = getDatabasePath();
//        getHandleOnDatabase();
    }
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("coolMethod")) {
            String obj = args.getString(0);
            System.out.println(obj);
            JSONObject tempData = null;
            tempData = new JSONObject(obj);
//this method will return the status of sync
            if (Integer.parseInt(tempData.getString("isSync")) == 4 || Integer.parseInt(tempData.getString("isSync")) == 5) {
                System.out.println("here we will insert the code ");

                this.getSyncStatus(obj, callbackContext);
                return true;
            } else {


//            if(Integer.parseInt(tempData.getString("isSync")) == 3){
//                System.out.println("here we will insert the code ");
//
//                this.insertRecord(tempData.getString("values"), callbackContext);
//
//            }else if(Integer.parseInt(tempData.getString("isSync")) == 4){
//                System.out.println("here we will insert the code ");
//
//                this.executeQueryReturnData(tempData.getString("query"), callbackContext);
//
//            }else{
//                this.coolMethod(obj, callbackContext);
//            }
            System.out.println("-----------------------------------");
            this.coolMethod(obj, callbackContext);
            return true;
        }
        }
        return false;
    }

    private void coolMethod(String recordMetaData, CallbackContext callbackContext) {

        if (recordMetaData != null ) {
            JSONObject workOrderMetaData = null;
            boolean isInProcess = false;
            try{
                System.out.println("tryyyyyyyyyyyyy");
                workOrderMetaData= new JSONObject(recordMetaData) ;
                retrofit = NetworkClient.getRetrofitClient(cordova.getContext(), workOrderMetaData.getString("ip"));
                workOrderInterface = retrofit.create(WorkOrderInterface.class);
    
                String ProcesssType = workOrderMetaData.getString("isSync");
                System.out.println(Integer.parseInt(ProcesssType) );
                System.out.println("Integer.parseInt(ProcesssType) ");
                System.out.println("=====================================================");
                System.out.println(workOrderMetaData);
                if(Integer.parseInt(ProcesssType) == 2 || Integer.parseInt(ProcesssType) == 3){
                    isInProcess = isAssignmentSyncInProcess(recordMetaData);
                }

            }catch(Exception ex){
                System.out.println("Sync catchhcchchh");
            }


            if(!isInProcess){
                System.out.println("inside getworkders calll");
                getWorkOrdersFromDb(callbackContext,recordMetaData);

            }else {
                System.out.println("--------------------------in process");
                Toast toast = Toast.makeText(cordova.getActivity()," In process", Toast.LENGTH_LONG);
                toast.show();
            }
        } else {
            System.out.println("Hiii error ");
            callbackContext.error("Expected one non-empty string argument.");
        }
    }

//This metod will return sync in progress or completed status
    private void getSyncStatus(String recordMetaData, CallbackContext callbackContext) {

        if (recordMetaData != null ) {
            JSONObject workOrderMetaData = null;
            boolean isInProcess = false;
            try{
                workOrderMetaData= new JSONObject(recordMetaData) ;
                retrofit = NetworkClient.getRetrofitClient(cordova.getContext(), workOrderMetaData.getString("ip"));
                workOrderInterface = retrofit.create(WorkOrderInterface.class);
                String ProcesssType = workOrderMetaData.getString("isSync");
                if(Integer.parseInt(ProcesssType) == 4 || Integer.parseInt(ProcesssType) == 5){
                    getStatusOfAssignmentSync(recordMetaData,callbackContext);
                    System.out.println(isInProcess + "-----------------------");
                }

            }catch(Exception ex){
                System.out.println("Sync catchhcchchh");
            }

            JSONObject obj = new JSONObject();

            if(!isInProcess){
                System.out.println("inside getworkders calll");
//                getWorkOrdersFromDb(callbackContext,recordMetaData);
                try{
                    obj.put("status",200);
                    callbackContext.success(obj);
                }catch (Exception e){
                    callbackContext.success("error");
                    System.out.println("in catch");
                }
                return;

            }else {
                System.out.println("--------------------------in process");

                try{
                    obj.put("status",202);
                    callbackContext.success(obj);
                }catch (Exception e){
                    callbackContext.success("error");
                    System.out.println("in catch");
                }
                return;

//                Toast toast = Toast.makeText(cordova.getActivity()," In process", Toast.LENGTH_LONG);
//                toast.show();
            }
        } else {
            System.out.println("Hiii error ");
            callbackContext.error("Expected one non-empty string argument.");
        }
        return;
    }
    private void getStatusOfAssignmentSync(String recordMetaData,CallbackContext callbackContext){
        JSONObject recordMetaDataObj = null;
        JSONObject obj = new JSONObject();
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            recordMetaDataObj = new JSONObject(recordMetaData);
            String ProcesssType = recordMetaDataObj.getString("isSync");
            String Query=null;
            System.out.println(recordMetaDataObj.get("assignmentId"));
            if(Integer.parseInt(ProcesssType) == 4 ){
                Query = "select * from syncAssignmentTable where assignmentId = '" + recordMetaDataObj.get("assignmentId")+"'";
            }else if(Integer.parseInt(ProcesssType) == 5){
                Query = "select * from syncAssignmentTable where formId = '" + recordMetaDataObj.get("formId")+"'";
            }

            Cursor crs = db.rawQuery(Query , null);
            System.out.println(crs.getCount());
            int count = crs.getCount();

            int assignmentworkOrdersCount = 0;
            if(count>0){
                while(crs.moveToNext())
                {
                    assignmentworkOrdersCount = crs.getInt( crs.getColumnIndex("recordsCount"));
                }

                crs.close();
                int workorderCount = getCountOfWorkAssignmentInProgressWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                int failWorkOrdersCount = getCountOfWorkAssignmentFailWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                int succesWorkOrdersCoutn = getCountOfWorkAssignmentSuccessWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                System.out.println("------------------------------ now here" + assignmentworkOrdersCount +"/"+ succesWorkOrdersCoutn);
                System.out.println(workorderCount + " " + failWorkOrdersCount +" " + succesWorkOrdersCoutn);



//                return true;


                if(assignmentworkOrdersCount == workorderCount){

                    deleteSyncAssignmnetWorkOrder(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                    deleteSyncAssignmnet(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());







                    Toast toast;
                    if(Integer.parseInt(ProcesssType) == 2){
                        toast = Toast.makeText(cordova.getActivity(),
                                "your Latest Sync on this assignment processed successfully with "
                                        + succesWorkOrdersCoutn +" Success and "+failWorkOrdersCount+" failures out of "+assignmentworkOrdersCount , Toast.LENGTH_LONG);

                    }else {


                        toast = Toast.makeText(cordova.getActivity(),
                                "your Latest Sync on this form processed successfully with "
                                        + succesWorkOrdersCoutn + " Success and " + failWorkOrdersCount + " failures out of " + assignmentworkOrdersCount, Toast.LENGTH_LONG);
                    }
//                    toast.show();
                    try{
                        obj.put("status",200);
                        callbackContext.success(obj);
                    }catch (Exception e){
                        callbackContext.success("error");
                        System.out.println("in catch");
                    }
                    return;

//                    return  false;
                }
                else {
                    Toast toast = Toast.makeText(cordova.getActivity(),
                            " Sync In Process on this assignment,"+ succesWorkOrdersCoutn+
                                    " work orders are processed successfully  and"+failWorkOrdersCount+
                                    " are failed out of "+assignmentworkOrdersCount, Toast.LENGTH_LONG);
//                    toast.show();
//                    return true;
                }
                try{
                    obj.put("status",202);
                    obj.put("success",succesWorkOrdersCoutn);
                    obj.put("total",assignmentworkOrdersCount);

                    callbackContext.success(obj);
                }catch (Exception e){
                    callbackContext.success("error");
                    System.out.println("in catch");
                }
                return;

            }
            else{
                System.out.println("--------------- theta --");
                try{
                    obj.put("status",200);
                    callbackContext.success(obj);
                }catch (Exception e){
                    callbackContext.success("error");
                    System.out.println("in catch");
                }
                return;

//                return  false;
            }

        }catch(Exception ex){

        }finally {
            System.out.println("commented on jan 5 2021");

//            db.close();
        }
        try{
            obj.put("status",200);
            callbackContext.success(obj);
        }catch (Exception e){
            callbackContext.success("error");
            System.out.println("in catch");
        }
        return;

//        return false;
    }



    //    Not using thsi method now remove if no dependency
    public void insertRecord(String dataObj, CallbackContext callbackContext){
        JSONObject tempData = null;

        System.out.println("insertWorkAssignment" + dataObj.getClass());
        System.out.println(dataObj);
//        System.out.println(Integer.parseInt(dataObj));
        JSONObject obj = new JSONObject();
        try{
            tempData = new JSONObject(dataObj);
            String insertQry = "insert into workOrder(formId,userId,formValues,isValid,taskId,recordId,recordComments,status,lat,long,videoOptions,isVideoAvailable,assignmentId,insertDate,name,displayValue,endDate) VALUES('"+tempData.getString("formId")+"','"+tempData.getString("userId")+"','"+tempData.get("formValues").toString()+"','"+tempData.get("isValid")+"','"+tempData.get("taskId")+"','"+tempData.get("recordId")+"','"+tempData.get("recordComments")+"','"+tempData.get("status")+"','"+tempData.get("lat")+"','"+tempData.get("long")+"','"+tempData.get("videoOptions")+"','"+tempData.get("isVideoAvailable")+"','"+tempData.get("assignmentId")+"','"+tempData.get("insertDate")+"','"+tempData.get("name")+"','"+tempData.get("displayValue")+"','"+tempData.get("endDate")+"');";
            System.out.println(insertQry);
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            db.execSQL(insertQry);

            Cursor crs = db.rawQuery("select * from workOrder ORDER BY id DESC LIMIT 1", null);
            System.out.println(crs);

            System.out.println(crs.getCount());


                try {
                    if(crs.getCount()>0) {
                        while (crs.moveToNext()) {
                            obj.put("status",1);
                            obj.put("insertid",crs.getInt(crs.getColumnIndex("id")));
                            System.out.println(crs.getInt(crs.getColumnIndex("id")));
                        }
                    }


//                    callbackContext.success(obj);
                }catch (Exception e){
                    System.out.println("synx count expetion");
//                    callbackContext.error("error");
                }


            System.out.println("inserted count --------------------");
        }catch(Exception ex){
            System.out.println("inserted count catch");
        } finally {
            db.close();
            callbackContext.success(obj);
        }

    }



    public void executeQueryReturnData(String dataObj, CallbackContext callbackContext){
        System.out.println("in side query executer ----");
        System.out.println(dataObj);
        int count = 0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String query = dataObj;
            Cursor crs = db.rawQuery(query , null);
            System.out.println("getSyncWorkOrderTotalMultiMediaCount checking");
            System.out.println(crs.getCount());
//            while(crs.moveToNext()){
//                try{
//                    System.out.println("getSyncWorkOrderTotalMultiMediaCount checking try");
//                    count =   crs.getInt(crs.getColumnIndex("multiMediaCount"));
//
//                }catch(Exception ex){
//
//                }
//
//            }
//            System.out.println(count);
//            System.out.println("hhhhhhhhhhhhhhhh");
//            crs.close();

        }catch(Exception ex){

        }finally {
//            db.close();
        }

//        return  count;

    }

    private boolean isAssignmentSyncInProcess(String recordMetaData){
         JSONObject recordMetaDataObj = null;
        System.out.println("isAssignmentSyncInProcess start");
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            recordMetaDataObj = new JSONObject(recordMetaData);
            String ProcesssType = recordMetaDataObj.getString("isSync");
            String Query=null;
            if(Integer.parseInt(ProcesssType) == 2 ){
                Query = "select * from syncAssignmentTable where assignmentId = '" + recordMetaDataObj.get("assignmentId")+"'";
            }else if(Integer.parseInt(ProcesssType) == 3){
                Query = "select * from syncAssignmentTable where formId = '" + recordMetaDataObj.get("formId")+"'";
            }

            Cursor crs = db.rawQuery(Query , null);
            System.out.println("isAssignmentSyncInProcess");
            System.out.println(crs.getCount());
            int count = crs.getCount();

            int assignmentworkOrdersCount = 0;
            System.out.println("0000000000000000111999222 " + count);
            if(count>0){
                System.out.println("==========" + count);

                while(crs.moveToNext())
                {
                    assignmentworkOrdersCount = crs.getInt( crs.getColumnIndex("recordsCount"));
                }

                crs.close();
                System.out.println("----------------0909");
                System.out.println(recordMetaDataObj);
//                int workorderCount = getCountOfWorkAssignmentInProgressWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString());
//                int failWorkOrdersCount = getCountOfWorkAssignmentFailWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString());
//                int succesWorkOrdersCoutn = getCountOfWorkAssignmentSuccessWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString());

                int workorderCount = getCountOfWorkAssignmentInProgressWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                System.out.println("----------------09080  " + workorderCount);
                int failWorkOrdersCount = getCountOfWorkAssignmentFailWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                System.out.println("----------------09082  "+ failWorkOrdersCount);
                int succesWorkOrdersCoutn = getCountOfWorkAssignmentSuccessWorkOrdersCount(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                System.out.println("----------------09083  " + succesWorkOrdersCoutn);

                System.out.println(workorderCount +" =====  "+ assignmentworkOrdersCount);
                if(assignmentworkOrdersCount == workorderCount){
                    System.out.println("--------------------------");
                    deleteSyncAssignmnetWorkOrder(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());
                    deleteSyncAssignmnet(recordMetaDataObj.get("assignmentId").toString(),recordMetaDataObj.get("isSync").toString(),recordMetaDataObj.get("formId").toString());

                    Toast toast;
                    if(Integer.parseInt(ProcesssType) == 2){
                        toast = Toast.makeText(cordova.getActivity(),
                                "your Latest Sync on this assignment processed successfully with "
                                        + succesWorkOrdersCoutn +" Success and "+failWorkOrdersCount+" failures out of "+assignmentworkOrdersCount , Toast.LENGTH_LONG);

                    }else {


                        toast = Toast.makeText(cordova.getActivity(),
                                "your Latest Sync on this form processed successfully with "
                                        + succesWorkOrdersCoutn + " Success and " + failWorkOrdersCount + " failures out of " + assignmentworkOrdersCount, Toast.LENGTH_LONG);
                    }
                    toast.show();
                    return  false;
                }
                else {
                    System.out.println("----------------------------- inside else here");
                    System.out.println(succesWorkOrdersCoutn + " " + failWorkOrdersCount + " " + assignmentworkOrdersCount);
                    Toast toast = Toast.makeText(cordova.getActivity(),
                            " Sync In Process on this assignment,"+ succesWorkOrdersCoutn+
                                    " work orders are processed successfully  and"+failWorkOrdersCount+
                                    " are failed out of "+assignmentworkOrdersCount, Toast.LENGTH_LONG);
                    toast.show();
                    System.out.println();
                    return true;
                }


//                    String recordId = null;
//                    boolean isNewRecord = false;
//                    if( crs.getString( crs.getColumnIndex("recordId")) != null ) {
            }
            else{
                System.out.println("--------------- theta --");
                return  false;
            }

        }catch(Exception ex){

        }finally {
            System.out.println("commented on jan 5 2021");

//            db.close();
        }
        return false;
    }

    private void insertWorkOrderCallPrepareation(String assignmentId,int offlineId,JSONArray mulitMediaListFinal, String formId,int isSync){
        JsonObject workOrderInfo = null;
        try{

            workOrderInfo = new JsonObject();
            workOrderInfo.addProperty("assignmentId",assignmentId);
            workOrderInfo.addProperty("formId",formId);
            workOrderInfo.addProperty("recordId",offlineId);
            int workOrderStatus = 1;
            if(mulitMediaListFinal!=null){
                workOrderInfo.addProperty("multimediaCount",mulitMediaListFinal.length());
                //it is in in-progress status
                workOrderStatus = 1;
            }else{
                //it is in completed status
                workOrderStatus = 2;
                workOrderInfo.addProperty("multimediaCount",0);
            }
            insertWorkOrder(workOrderInfo,workOrderStatus);
        }catch(Exception ex){
            System.out.println("insertWorkOrder excpetion");
            System.out.println(ex.getMessage());
        }
    }
    private void insertWorkOrderFailCallPrepareation(String assignmentId,int offlineId){
        JsonObject workOrderInfo = null;
        try{

            workOrderInfo = new JsonObject();
            workOrderInfo.addProperty("assignmentId",assignmentId);
            workOrderInfo.addProperty("recordId",offlineId);
            insertWorkOrder(workOrderInfo,3);
        }catch(Exception ex){
            System.out.println("insertWorkOrder excpetion");
            System.out.println(ex.getMessage());
        }
    }
    private void syncWorkOrder(CallbackContext callbackContext, String formId, String formName,String recordId,String assignmentId, String userId, String taskName, String taskId, String userName,int isValid,Boolean isSync,String formValues,String videoOptions, JsonObject recordMetaData, boolean isNewRecord, int offlineId,String processType,String lat, String longitude){
        System.out.println("Sun work orders");
        System.out.println(processType);
        System.out.println(lat);
        System.out.println(longitude);
      
        WorkOrderModel workOrderModelRef = new WorkOrderModel(formId, formName, recordId, assignmentId, userId, taskName, taskId, userName, isValid, isSync, formValues,isNewRecord,lat,longitude);
        System.out.println(workOrderModelRef+ "00-------------------------------------------sync record");
        JSONArray mulitMediaList=null;
        System.out.println("video otpinsss");
        System.out.println(videoOptions);
        try {
            mulitMediaList = ((JSONArray) new JSONTokener(videoOptions).nextValue());
        }catch(Exception er){
            System.out.println("error" + er);

        }
        System.out.println("mulitMediaList ciunt");
        System.out.println(mulitMediaList);
        final JSONArray mulitMediaListFinal = mulitMediaList;
        workOrderInterface.createworkOrder(workOrderModelRef).
                subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Observer<WorkOrderModel>() {
                    @Override
                    public void onSubscribe(Disposable d) {

                    }

                    @Override
                    public void onNext(WorkOrderModel workOrderModel) {
                        System.out.println("onnextttttttttttttttttttttt");
                        if(Integer.parseInt(processType) == 2){
                            insertWorkOrderCallPrepareation(assignmentId,offlineId,mulitMediaListFinal,"null",Integer.parseInt(processType));
                        }else if(Integer.parseInt(processType) == 3){
                            insertWorkOrderCallPrepareation("null",offlineId,mulitMediaListFinal,formId,Integer.parseInt(processType));
                        }


                        try{
                            if(mulitMediaListFinal!= null){
                                workOrderMultiMediaTotalCount = mulitMediaListFinal.length();
                                if(workOrderMultiMediaTotalCount>0){
                                    System.out.println("inside first iffff");
                                    for (int i=0; i<=mulitMediaListFinal.length()-1;i++){
                                        System.out.println("inside first forrrrrr");
                                        JSONObject mulitMediaObj = ((JSONObject)mulitMediaListFinal.get(i));
                                        System.out.println(mulitMediaObj);
                                        JSONObject mulitMediaObj1 = ((JSONObject)mulitMediaObj.get("options"));
                                        uploadToServer(mulitMediaObj.getString("path"),recordMetaData,mulitMediaObj1,offlineId,Integer.parseInt(processType));
                                    }
                                    System.out.println(processType);
                                    System.out.println(" System.out.println(processType);");
                                    if(Integer.parseInt(processType)==1){
                                        System.out.println("iffffffffff process type");
                                        Toast toast = Toast.makeText(cordova.getActivity(),"Grand success, your record submitted successfully ", Toast.LENGTH_LONG);
                                        toast.show();
                                    }

                                }else{
                                    System.out.println("inside first elseee");
                                    if(Integer.parseInt(processType)==1){
                                        Toast toast = Toast.makeText(cordova.getActivity(),"Grand success, your record submitted successfully ", Toast.LENGTH_LONG);
                                        toast.show();
                                        int offlineRef = offlineId;
                                        deleteWorkOrder(offlineRef);
                                    } else {
                                        System.out.println("----------------------------------9" +offlineId);
                                        int offlineRef = offlineId;
                                        deleteWorkOrder(offlineRef);
                                        updateSyncAssignmentWorkorder(2,offlineId);
                                        deleteWorkOrder(offlineId);
                                    }

                                }

                            }else{
                                System.out.println("inside first elseee");
                                int offlineRef = offlineId;
                                deleteWorkOrder(offlineRef);
                                System.out.println("procreee tuype check");
                                System.out.println(Integer.parseInt(processType)==1);
                                System.out.println(processType.toLowerCase()=="1");
                                String myStr = processType;
                                if(Integer.parseInt(processType)==1){
                                    Toast toast = Toast.makeText(cordova.getActivity(),"Grand success, your record submitted successfully without images ", Toast.LENGTH_LONG);
                                    toast.show();
                                }

                            }



                        }catch(Exception e){
                            System.out.println("exceptionnn");
                            System.out.println(e.getMessage());
                        }


                    }

                    @Override
                    public void onError(Throwable e) {
                        insertWorkOrderFailCallPrepareation(assignmentId,offlineId);
                        Toast toast = Toast.makeText(cordova.getActivity(),"OOPS, your record not submitted but don't worry we saved your record on device, please try again", Toast.LENGTH_LONG);
                        toast.show();
                    }

                    @Override
                    public void onComplete() {

                    }
                }) ;



    }

    private void getWorkOrdersFromDb(CallbackContext callbackContext, String recordMetaData){
        db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);

        JSONObject workOrderMetaData = null;
        workOrderMultiMediaTotalCount = 0;
        workOrderMultiMediaProcessedCount = 0;
        String queryStr = dbTableQuery;
        String ProcesssType = null;
        try{

            workOrderMetaData= new JSONObject(recordMetaData) ;
            System.out.println(workOrderMetaData.get("isSync"));
            System.out.println("is sync ");
            ProcesssType = workOrderMetaData.getString("isSync");
            if(Integer.parseInt(ProcesssType) == 1) {
                queryStr = queryStr + " where id = " + workOrderMetaData.get("offlineId");
            } else if(Integer.parseInt(ProcesssType) == 2){
                queryStr = queryStr + " where assignmentId = '" + workOrderMetaData.get("assignmentId")+"'"+" AND isValid = 1";
            }else if(Integer.parseInt(ProcesssType) == 3){
                queryStr = queryStr + " where formId = '" + workOrderMetaData.get("formId")+"'"+" AND isValid = 1";
            }
            System.out.println("queryStr 143" );
            System.out.println(queryStr);
        }catch(Exception ex){

        }
        Cursor crs = db.rawQuery(queryStr, null);
        System.out.println(crs.getCount());
        if(crs.getCount() == 0){
            System.out.println("-----------------------------------------------no records found");
            JSONObject obj = new JSONObject();
            try {
                obj.put("status",204);
                callbackContext.success(obj);
            }catch (Exception e){
                System.out.println("synx count expetion");
                callbackContext.error("Unable to continue the sync process ");
            }
            return;
        }

        /*insert sync assignment start  */
        JsonObject assignmentInfo = null;
        try{
            assignmentInfo = new JsonObject();
            assignmentInfo.addProperty("assignmentId",workOrderMetaData.get("assignmentId").toString());

            assignmentInfo.addProperty("recordCount",crs.getCount());
            assignmentInfo.addProperty("formId",workOrderMetaData.get("formId").toString());
            if(Integer.parseInt(ProcesssType) == 2) {
                insertWorkAssignment(assignmentInfo);

            }
            if(Integer.parseInt(ProcesssType) == 3) {

                insertWorkAssignment(assignmentInfo);

            }

        }catch(Exception ext){

        }
         /*insert sync assignment end  */



        while(crs.moveToNext())
        {
            String recordId = null;
            boolean isNewRecord = false;
           if( crs.getString( crs.getColumnIndex("recordId")) != null ) {
               if(crs.getString( crs.getColumnIndex("recordId")).length()>4){
                   recordId = crs.getString( crs.getColumnIndex("recordId"));
               }else{
                   recordId = UniqueRandomNumbers();
                   isNewRecord = true;
               }
               

            } else{
                recordId = UniqueRandomNumbers();
                isNewRecord = true;
            }
            try{
                workOrderMetaData.remove(recordId);
                workOrderMetaData.put("recordId",recordId);
            }catch(Exception e){

            }
            //prepare  object to send to server to add adtional params to request
            JsonObject recordMetaInfoObj = null;
            try{
                recordMetaInfoObj = new JsonObject();
                recordMetaInfoObj.addProperty("recordId", workOrderMetaData.get("recordId").toString());
                if(Integer.parseInt(ProcesssType) == 2) {
                    System.out.println("came till here --------------------------------1");
                    recordMetaInfoObj.addProperty("assignmentId", workOrderMetaData.get("assignmentId").toString());

                }
                if(Integer.parseInt(ProcesssType) == 3) {
                    System.out.println("came till here --------------------------------2");
                    recordMetaInfoObj.addProperty("formId", workOrderMetaData.get("formId").toString());

                }
//                recordMetaInfoObj.addProperty("assignmentId", workOrderMetaData.get("assignmentId").toString());

            }catch(Exception ex){

            }
            try{
                syncWorkOrder(
                        callbackContext,
                        crs.getString(crs.getColumnIndex("formId")),
                        crs.getString( crs.getColumnIndex("formId")) ,
                        recordId,
                        crs.getString(crs.getColumnIndex("assignmentId")),
                        crs.getString(crs.getColumnIndex("userId")),
                        crs.getString(crs.getColumnIndex("taskId") ),
                        crs.getString(crs.getColumnIndex("taskId")),
                        crs.getString(crs.getColumnIndex("userId")),
                        crs.getInt(crs.getColumnIndex("isValid") ),
                        true,
                        crs.getString(crs.getColumnIndex("formValues")),
                        crs.getString(crs.getColumnIndex("videoOptions")),
                        recordMetaInfoObj,
                        isNewRecord,
                        crs.getInt(crs.getColumnIndex("id")),
                        workOrderMetaData.getString("isSync").toString(),
                        crs.getString(crs.getColumnIndex("lat")),
                        crs.getString(crs.getColumnIndex("long"))

                );
            }catch (Exception ex){
                System.out.println("ee venkii");
                System.out.println(ex.getMessage());
            }


        }

        try{
            JSONObject obj1 = new JSONObject();
            obj1.put("status",200);
            callbackContext.success(obj1);
        }catch(Exception ex){

        }finally {
//            crs.close();
            System.out.println("closed db successfully in first close");
//            db.close();

        }

    }

    private void uploadToServer(String filePath, JsonObject recordMetaData, JSONObject options, int offlineId, int processType) {
        System.out.println("uploadToServer");

        // Retrofit retrofit = NetworkClient.getRetrofitClient(cordova.getContext(), workOrderMetaData.getString("ip"));
        WorkOrderInterface uploadAPIs = retrofit.create(WorkOrderInterface.class);
        //Create a file object using file path
        File file = new File(filePath);
        // Create a request body with file and image media type
        RequestBody fileReqBody = RequestBody.create(MediaType.parse("image/*"), file);
        // Create MultipartBody.Part using file request-body,file name and part name
        MultipartBody.Part part = MultipartBody.Part.createFormData("img", file.getName(), fileReqBody);
        //Create request body with text description and text media type
        RequestBody description = RequestBody.create(MediaType.parse("text/plain"), recordMetaData.toString());
        RequestBody fieldMediaInfo = RequestBody.create(MediaType.parse("text/plain"), options.toString());
        //

        System.out.println("beforeeeeeeeeeeeeeeeeeee 326");
        System.out.println(recordMetaData);
        System.out.println(options);



        uploadAPIs.uploadImage(part, description, fieldMediaInfo).
                subscribeOn(Schedulers.io()).
                observeOn(AndroidSchedulers.mainThread()).
                subscribe(new Observer<ResponseBody>() {
                    @Override
                    public void onSubscribe(Disposable d) {
                    }

                    @Override
                    public void onNext(ResponseBody responseBody) {
                        if(processType == 2 || processType == 3){
                            JSONObject mulitMediaObj = null;
                            try{
                                mulitMediaObj =  new JSONObject();
                                JSONObject params = ((JSONObject)options.get("params"));
                                mulitMediaObj.put("recordId",offlineId);
                                mulitMediaObj.put("fieldId",params.get("fieldId").toString());

                                insertWorkOrderMultiMedia(mulitMediaObj,2);
                                updateWorkOrderStatus(mulitMediaObj,offlineId);
                            }catch(Exception ex){
                                System.out.println("venki 123");
                                System.out.println(ex.getMessage());
                            }
                        }else{
                            System.out.println("-----------------dead");
                            deleteWorkOrder(offlineId);
                        }



                    }

                    @Override
                    public void onError(Throwable e) {
                        try{
                            JSONObject mulitMediaObj =  new JSONObject();
                            JSONObject params = ((JSONObject)options.get("params"));
                            mulitMediaObj.put("recordId",offlineId);
                            mulitMediaObj.put("fieldId",params.get("fieldId").toString());
                            insertWorkOrderMultiMedia(mulitMediaObj,3);
                            updateWorkOrderStatus(mulitMediaObj,offlineId);
                            System.out.println("uploadsrevre on error" + e);
                        }catch(Exception ex){
                            System.out.println(ex);

                        }


                    }

                    @Override
                    public void onComplete() {

                    }
                });


    }
    private void updateWorkOrderStatus(JSONObject mulitMediaObj,int offlineId){
        try{
            int SyncWorkOrdersInsertMultiMediaCount =getSyncWorkOrdersInsertMultiMediaCount(mulitMediaObj.get("recordId").toString());
            int SyncWorkOrderTotalMultiMediaCount = getSyncWorkOrderTotalMultiMediaCount(mulitMediaObj.get("recordId").toString());
            int SyncWorkOrdersInsertMultiMediaSuucessCount = getSyncWorkOrdersInsertMultiMediaSuucessCount(mulitMediaObj.get("recordId").toString());
            System.out.println("after inserti the multimedia recodr");
            System.out.println(SyncWorkOrdersInsertMultiMediaCount);
            System.out.println(SyncWorkOrderTotalMultiMediaCount);
            System.out.println(SyncWorkOrdersInsertMultiMediaSuucessCount);
            if(SyncWorkOrdersInsertMultiMediaSuucessCount == SyncWorkOrderTotalMultiMediaCount ){
                System.out.println("inseddd if ------- dead here");
                updateSyncAssignmentWorkorder(2,offlineId);
                deleteWorkOrder(offlineId);


            }else if(SyncWorkOrdersInsertMultiMediaCount == SyncWorkOrderTotalMultiMediaCount) {
                updateSyncAssignmentWorkorder(3,offlineId);
            }

        }catch (Exception ex){

        }

    }
    private String getDatabasePath(){
        /*Method which returns the Formz db path.Formz uses internal memory.
        * */
        String path=cordova.getActivity().getFilesDir().getParent();
        return path+"/databases/Formsz.db";

    }

    private void getHandleOnDatabase(){
    /*Method open the DB for read/write purpose
    * */

        db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
        db.enableWriteAheadLogging();
    }

    private String UniqueRandomNumbers(){
        Random r = new Random();
        StringBuffer sb = new StringBuffer();
        while(sb.length() < 24){
            sb.append(Integer.toHexString(r.nextInt()));
        }

        return sb.toString().substring(0, 24);

    }
    public void updateSyncAssignmentWorkorder(int status,int recordId){
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            ContentValues cv = new ContentValues();
            cv.put("status",status);
            db.update("syncAssignmentWorkOrderTable", cv, "recordId="+recordId, null);
        }catch (Exception ex){

        }finally {
            db.close();
        }

    }
    public void deleteWorkOrder(int id) {
        System.out.println(id + "this is id ==================================");
        db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
        int c = db.delete("workOrder", "id=?", new String[]{Integer.toString(id)});
        db.close();
        System.out.println(c);
        System.out.println("Delete count");
    }
    public void deleteSyncAssignmnetWorkOrder(String assignmentId,String isSync,String formId) {
        System.out.println("deleteSyncAssignmnetWorkOrder");
        db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
        int c;
        if(Integer.parseInt(isSync) == 2 || Integer.parseInt(isSync) == 4){
            c = db.delete("syncAssignmentWorkOrderTable", "assignmentId=?", new String[]{assignmentId});
        }else{
            c = db.delete("syncAssignmentWorkOrderTable", "formId=?", new String[]{formId});
        }

        db.close();
        System.out.println(c);
        System.out.println("deleteSyncAssignmnetWorkOrder count");
    }
    public void deleteSyncAssignmnet(String assignmentId,String isSync,String formId) {
        System.out.println("deleteSyncAssignmnetWorkOrder");
        db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
        int c;
        if(Integer.parseInt(isSync) == 2 || Integer.parseInt(isSync) == 4){
            c = db.delete("syncAssignmentTable", "assignmentId=?", new String[]{assignmentId});
        }else{
            c = db.delete("syncAssignmentTable", "formId=?", new String[]{formId});
        }


        db.close();
        System.out.println(c);
        System.out.println("deleteSyncAssignmnetWorkOrder count");
    }
    public void insertWorkAssignment(JsonObject assignmentObj){
        System.out.println("insertWorkAssignment");
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String insertQry = "insert into syncAssignmentTable(assignmentId,recordsCount,status,formId) values("+assignmentObj.get("assignmentId")+","+assignmentObj.get("recordCount")+","+1+","+assignmentObj.get("formId")+");";
            System.out.println(insertQry);
            db.execSQL(insertQry);
            Cursor crs = db.rawQuery("select * from syncAssignmentTable", null);
            System.out.println("inserted count ");
            System.out.println(crs.getCount());
        }catch(Exception ex){
            System.out.println("inserted count catch");
        } finally {
            db.close();
        }

    }
    public void insertWorkOrder(JsonObject workorderObj,int status){
        System.out.println("insertWorkOrder start");
        System.out.println(workorderObj.get("multimediaCount"));
        System.out.println(workorderObj.get("assignmentId"));
        System.out.println(workorderObj.get("recordId"));

        System.out.println("insertWorkOrder start22");
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String insertQry = "insert into syncAssignmentWorkOrderTable(assignmentId,recordId,status,multiMediaCount,formId) values("+workorderObj.get("assignmentId")+","+workorderObj.get("recordId")+","+status+","+workorderObj.get("multimediaCount")+","+workorderObj.get("formId")+");";
            db.execSQL(insertQry);
            Cursor crs = db.rawQuery("select * from syncAssignmentWorkOrderTable", null);
            while(crs.moveToNext()){
                try{
                     int cooutn = crs.getInt(crs.getColumnIndex("multiMediaCount"));
                     System.out.println(crs.getInt(crs.getColumnIndex("recordId")));
                     System.out.println(cooutn);

                }catch(Exception ex){
                    System.out.println(ex);

                }

            }
            System.out.println("insertWorkOrder end");

        }catch(Exception ex){
            System.out.println("inserted count for work order catch");
            System.out.println(ex);
        }finally {
            db.close();
        }
    }

    public void insertWorkOrderMultiMedia(JSONObject workorderObj,int status){
        try{

            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
       //    String insertQry = "insert into syncWorkorderMultiMediaTable(fieldId,recordId,status) values("+workorderObj.getString("fieldId")+","+workorderObj.getString("recordId")+",1);";
             String insertQry = "insert into syncWorkorderMultiMediaTable(recordId,status) values("+workorderObj.getString("recordId")+","+status+");";
            db.execSQL(insertQry);
            Cursor crs = db.rawQuery("select * from syncWorkorderMultiMediaTable", null);
            System.out.println("insertWorkOrderMultiMedia count for work order ");
            System.out.println(crs.getCount());
        }catch(Exception ex){
            System.out.println("insertWorkOrderMultiMedia count for work order catch");
        }finally {
            db.close();
        }
    }

    /*get count of insertead workorders on particular assignment*/
    public int getSyncWorkOrdersCount(String assigmnetId){
        int count = 0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            Cursor crs = db.rawQuery("select * from syncAssignmentWorkOrderTable where assignmentId ="+assigmnetId, null);
            count = crs.getCount();
            crs.close();

        }catch(Exception ex){

        }finally {
            db.close();
        }

        return  count;
    }

    /*get count of total  workorders on particular assignment*/
    public int getAssignementTotalWorkordersCount(String assigmnetId){
        int count =0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            Cursor crs = db.rawQuery("select * from syncAssignmentTable where assignmentId ="+assigmnetId, null);
            count =   crs.getInt(crs.getColumnIndex("recordsCount"));
            crs.close();

        }catch(Exception ex){


        }finally {

            db.close();
        }
        System.out.println("getAssignementTotalWorkordersCount");
        return count;
    }

    /*get insertead multimedia on particular work order or record*/
    public int getSyncWorkOrdersInsertMultiMediaCount(String recordId){
        System.out.println("getSyncWorkOrdersInsertMultiMediaCount");
        int count = 0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String Query = "select * from syncWorkorderMultiMediaTable where recordId = "+recordId;
            Cursor crs = db.rawQuery(Query, null);
            count = crs.getCount();
            crs.close();

        }catch(Exception ex){
            System.out.println("expetion multi meadi countttt ");
            System.out.println(ex.getMessage());
        }finally {
            db.close();
        }

        return  count;
    }

    /*get successfully insertead smultimedia on particular work order or record*/
    public int getSyncWorkOrdersInsertMultiMediaSuucessCount(String recordId){
        System.out.println("getSyncWorkOrdersInsertMultiMediaCount");
        int count = 0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String Query = "select * from syncWorkorderMultiMediaTable where recordId = "+recordId+" AND status = 2";
            Cursor crs = db.rawQuery(Query, null);
            count = crs.getCount();
            crs.close();

        }catch(Exception ex){
            System.out.println("expetion multi meadi countttt ");
            System.out.println(ex.getMessage());
        }finally {
            db.close();
        }

        return  count;
    }



    /*get total  multimedia on particular work order or record*/
    public int getSyncWorkOrderTotalMultiMediaCount(String recordId){
        System.out.println("getSyncWorkOrderTotalMultiMediaCount");
        System.out.println(recordId);
        int count = 0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String query = "select * from syncAssignmentWorkOrderTable where recordId ="+recordId;
            Cursor crs = db.rawQuery(query , null);
            System.out.println("getSyncWorkOrderTotalMultiMediaCount checking");
            System.out.println(crs.getCount());
            while(crs.moveToNext()){
                try{
                    System.out.println("getSyncWorkOrderTotalMultiMediaCount checking try");
                    count =   crs.getInt(crs.getColumnIndex("multiMediaCount"));


                }catch(Exception ex){
                    System.out.println(ex);

                }

            }
            System.out.println(count);
            System.out.println("hhhhhhhhhhhhhhhh");
            crs.close();

        }catch(Exception ex){

        }finally {
            db.close();
        }

        return  count;
    }

    public int getCountOfWorkAssignmentInProgressWorkOrdersCount(String assigmnetId,String isSync,String formId){
        System.out.println("getCountOfWorkAssignmentInProgressWorkOrdersCount");
        int count = 0;
        try{

            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String Query;
            if(Integer.parseInt(isSync) == 2 || Integer.parseInt(isSync) == 4){
                Query = "select * from syncAssignmentWorkOrderTable where assignmentId = '" + assigmnetId+"'"+" AND (status =2 OR status =3)";
            }else{
                Query = "select * from syncAssignmentWorkOrderTable where formId = '" + formId+"'"+" AND (status =2 OR status =3)";
            }
            System.out.println(Query);

            Cursor crs = db.rawQuery(Query , null);
            count = crs.getCount();

            crs.close();

        }catch(Exception ex){
            System.out.println("getCountOfWorkAssignmentInProgressWorkOrdersCount catch");
            System.out.println(ex.getMessage());
        }finally {
            db.close();
        }
        System.out.println(count);
        return  count;
    }

    public int getCountOfWorkAssignmentFailWorkOrdersCount(String assigmnetId,String isSync,String formId){
        System.out.println("getCountOfWorkAssignmentInProgressWorkOrdersCount");
        int count = 0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String Query;
            if(Integer.parseInt(isSync) == 2 || Integer.parseInt(isSync) == 4){
                Query = "select * from syncAssignmentWorkOrderTable where assignmentId = '" + assigmnetId+"'"+" AND  status =3 ";
            }else{
                Query = "select * from syncAssignmentWorkOrderTable where formId = '" + formId+"'"+" AND  status =3 ";
            }

            Cursor crs = db.rawQuery(Query , null);
            count = crs.getCount();
            crs.close();

        }catch(Exception ex){
            System.out.println("getCountOfWorkAssignmentInProgressWorkOrdersCount catch");
            System.out.println(ex.getMessage());
        }finally {
            db.close();
        }
        return  count;
    }

    public int getCountOfWorkAssignmentSuccessWorkOrdersCount(String assigmnetId,String isSync,String formId){
        System.out.println("getCountOfWorkAssignmentInProgressWorkOrdersCount");
        int count = 0;
        try{
            db = SQLiteDatabase.openOrCreateDatabase(dbPath, null);
            String Query;
            if(Integer.parseInt(isSync) == 2 || Integer.parseInt(isSync) == 4){
                Query = "select * from syncAssignmentWorkOrderTable where assignmentId = '" + assigmnetId+"'"+" AND status =2";
            }else{
                Query = "select * from syncAssignmentWorkOrderTable where formId = '" + formId+"'"+" AND status =2";
            }


            Cursor crs = db.rawQuery(Query , null);
            count = crs.getCount();
            crs.close();

        }catch(Exception ex){
            System.out.println("getCountOfWorkAssignmentInProgressWorkOrdersCount catch");
            System.out.println(ex.getMessage());
        }finally {
            db.close();
        }
        return  count;
    }

    @Override
    public void onDestroy() {
        System.out.println(" i ma destroyy");
    /*Method which closes the database when the activity is being destroyed.
    * */
        super.onDestroy();
        if(db!=null){
            db.close();
        }
    }
}
