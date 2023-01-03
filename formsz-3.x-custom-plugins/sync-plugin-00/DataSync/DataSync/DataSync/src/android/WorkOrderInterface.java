package cordova.plugin.data.sync.interfaces.models;
import java.util.List;

import io.reactivex.Flowable;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

import io.reactivex.Observable;
/**
 * Created by mmvb45 on 02-07-2019.
 */

public interface WorkOrderInterface {
    @GET("posts")
    Call<List<WorkOrderModel>> getWorkOrders();

//    @POST("mobileServices/addRecord")
//    Call<WorkOrderModel> createworkOrder(@Body WorkOrderModel workOrderModel);
    @POST("api/v1/mobileServices/addRecord")
    Observable<WorkOrderModel> createworkOrder(@Body WorkOrderModel workOrderModel);

    @Multipart
    @POST("api/v2/gridFS/addImageOrVideo")
    Observable<ResponseBody> uploadImage(@Part MultipartBody.Part file, @Part("recordId") RequestBody requestBody, @Part("mediaInfo") RequestBody mediaInfo);
}
