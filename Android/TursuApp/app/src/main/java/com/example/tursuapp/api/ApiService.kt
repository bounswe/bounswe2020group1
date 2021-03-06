package com.example.tursuapp.api

import com.example.tursuapp.api.responses.*
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*


interface ApiService {
    @FormUrlEncoded
    @POST("/user/login")
    fun login(@Field("email") email: String, @Field("password") password: String): Call<LoginResponse>

    @FormUrlEncoded
    @POST("/user/login")
    fun verification(@Field("email") email: String,
                     @Field("password") password: String,
                     @Field("verification_code") code: String): Call<LoginResponse>

    @FormUrlEncoded
    @POST("/user/resend_verification_code")
    fun verificationResend(@Field("email") email: String): Call<Void>

    @FormUrlEncoded
    @POST("/user/login/google")
    fun googleLogin(@Field("tokenId") id_token: String): Call<LoginResponse>

    @FormUrlEncoded
    @POST("/user/signup")
    fun signup(@Field("first_name") first_name: String,
               @Field("last_name") last_name: String,
               @Field("username") username: String,
               @Field("email") email: String,
               @Field("password") password: String): Call<Void>

    @FormUrlEncoded
    @POST("/user/signup/google")
    fun googleSignup(@Field("tokenId") id_token: String,
                     @Field("is_vendor") is_vendor: String): Call<LoginResponse>

    @FormUrlEncoded
    @POST("/user/signup")
    fun vendorSignup(@Field("first_name") first_name: String,
                     @Field("last_name") last_name: String,
                     @Field("username") username: String,
                     @Field("email") email: String,
                     @Field("password") password: String,
                     @Field("is_vendor") is_vendor: String,
                     @Field("IBAN") iban: String,
                     @Field("latitude") latitude: String,
                     @Field("longitude") longitude: String,
                     @Field("city") city: String): Call<Void>

    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>
    @GET("/customerpage")
    fun getCustomerProfileInfo(@Header("Authorization") token: String): Call<ProfileInfoResponse>

    @FormUrlEncoded
    @POST("/user/edit_profile")
    fun editName(@Header("Authorization") token: String,@Field("first_name") list_name: String): Call<ResponseBody>

    @FormUrlEncoded
    @POST("/user/edit_profile")
    fun editSurname(@Header("Authorization") token: String,@Field("last_name") list_name: String): Call<ResponseBody>

    @GET("/product")
    fun getProductDetails(@Query("id") userId: Int): Call<ProductDetailsResponse>

    /*
    @GET("/product/category")
    fun getProductsOfCategory(@Query("name") name: String): Call<List<ProductResponse>>
    */
    @GET("/product/category")
    fun getProductsOfCategory(@QueryMap params: HashMap<String, String>): Call<List<ProductResponse>>

    /*
    @GET("/product/category")
    fun getProductsOfCategory(@QueryMap params: HashMap<String,String>): Call<List<ProductResponse>>
    */
    /*
    @POST("/shoppingcart/add")
    fun addToCart(@Header("Authorization") auth_token : String, @Query("product_id") product_id: Int, @Query("quantity") quantity:Int):Call<ResponseBody>

    @GET("/search")
    fun getCartProducts(@Header("Authorization") auth_token : String): Call<ShoppingCartResponse>
     */



    @GET("/search")
    fun getSearchedVendors(@Query("search_type") search_type: String, @Query("search_string") search_string: String): Call<List<VendorResponse>>

    @GET("/search")
    fun getSearchedProducts(@QueryMap params: HashMap<String, String>): Call<List<ProductResponse>>

    @GET("/helper/allbrands/")
    fun getAllBrands(): Call<List<String>>

    @GET("/helper/allcategories/")
    fun getAllCategories(): Call<List<String>>

    @GET("/helper/allvendors/")
    fun getAllVendors(): Call<List<String>>

    @FormUrlEncoded
    @POST("/shoppinglist/createlist/")
    fun addList(@Header("Authorization") token: String, @Field("list_name") list_name: String): Call<ResponseBody>

    @GET("/shoppinglist/getlists/")
    fun getLists(@Header("Authorization") token: String): Call<List<String>>

    @FormUrlEncoded
    @POST("/shoppinglist/addtolist/")
    fun addToList(@Header("Authorization") token: String, @Field("list_name") list_name: String, @Field("product_id") product_id: Int): Call<ResponseBody>

    @FormUrlEncoded
    @POST("/shoppinglist/deletelist/")
    fun deleteList(@Header("Authorization") token: String, @Field("list_name") list_name: String): Call<ResponseBody>

    @FormUrlEncoded
    @POST("/shoppinglist/deletefromlist/")
    fun deleteFromList(@Header("Authorization") token: String, @Field("list_name") list_name: String, @Field("product_id") product_id: Int): Call<ResponseBody>

    @FormUrlEncoded
    @POST("/shoppinglist/products/")
    fun getListedProducts(@Header("Authorization") token: String, @Field("list_name") list_name: String): Call<List<ProductResponse>>

    @GET("/order/get_orders/")
    fun getOrdersOfCustomer(@Header("Authorization") auth_token: String):Call<List<List<CustomerOrderResponse>>>

    @FormUrlEncoded
    @POST("/order/set_delivered/")
    fun orderSetDelivered(@Header("Authorization") auth_token: String, @Field("order_id") orderId: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/order/cancel_order/")
    fun cancelOrder(@Header("Authorization") auth_token: String, @Field("order_id") orderId: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/order/set_delivery/")
    fun setDelivery(@Header("Authorization") auth_token: String, @Field("order_id") orderId: Int, @Field("cargo_id") cargoId: String, @Field("days") days: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/shoppingcart/increase")
    fun addToShoppingCart(@Header("Authorization") auth_token: String, @Field("product_id") orderId: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/shoppingcart/decrease")
    fun removeFromShoppingCart(@Header("Authorization") auth_token: String, @Field("product_id") orderId: Int):Call<ResponseBody>

    @GET("/shoppingcart/all")
    fun getProductsShoppingCart(@Header("Authorization") auth_token: String):Call<List<ShoppingCartProductResponse>>

    @POST("/order/create_orders/")
    fun createOrders(@Header("Authorization") auth_token: String):Call<CreateOrderResponse>
  
    @GET("/vendorpage")
    fun getProductsOfVendor(@Header("Authorization") token: String):Call<VendorDataResponse>

    @FormUrlEncoded
    @POST("/product/delete/")
    fun deleteProduct(@Header("Authorization") token: String, @Field("id") id: Int): Call<ResponseBody>

    @FormUrlEncoded
    @POST("/product/edit/")
    fun updateProduct(@Header("Authorization") token: String,
                      @Field("id") id: Int,
                      @Field("category") category: String,
                      @Field("name") name: String,
                      @Field("description") description: String,
                      @Field("brand") brand: String,
                      @Field("stock") stock: Int,
                      @Field("price") price: Float,
                      @Field("photo") photo: String): Call<ResponseBody>
                    //image file @multipart

    @FormUrlEncoded
    @POST("/product/add/")
    fun addProduct(@Header("Authorization") token: String,
                   @Field("name") name: String,
                   @Field("category") category: String,
                   @Field("description") description: String,
                   @Field("brand") brand: String,
                   @Field("stock") stock: Int,
                   @Field("price") price: Float,
                   @Field("photo") photo: String): Call<ResponseBody>


    @GET("/recommendation/recommendation_pack")
    fun getRecommendedProducts(@Header("Authorization") token: String): Call<RecommendationPackResponse>
  
    @FormUrlEncoded
    @POST("/comment/")
    fun addComment(@Header("Authorization") token: String,
                   @Field("product_id") product_id: Int,
                   @Field("text") text: String,
                   @Field("product_rating") product_rating: Int,
                   @Field("vendor_rating") vendor_rating: Int): Call<ResponseBody>

    @GET("/message/chat/ofcustomer/")
    fun getMessagesFromSelectedFlow(@Header("Authorization") token: String, @Query("flow_id") flow_id: Int): Call<List<SingleMsgResponse>>

    @GET("/message/chat/ofvendor/wcustomer/")
    fun getMessagesFromSelectedFlowVendorWCustomer(@Header("Authorization") token: String, @Query("flow_id") flow_id: Int): Call<List<SingleMsgResponse>>

    @GET("/message/chat/ofvendor/wadmin/")
    fun getMessagesFromSelectedFlowVendorWAdmin(@Header("Authorization") token: String, @Query("flow_id") flow_id: Int): Call<List<SingleMsgResponse>>

    @FormUrlEncoded
    @POST("/message/send/customer/tovendor/")
    fun sendMsgFromCustomerToVendor(@Header("Authorization") token: String, @Field("message") message: String, @Field("flow_id") flow_id: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/message/send/vendor/tocustomer/")
    fun sendMsgFromVendorToCustomer(@Header("Authorization") token: String, @Field("message") message: String, @Field("flow_id") flow_id: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/message/send/vendor/toadmin/")
    fun sendMsgFromVendorToAdmin(@Header("Authorization") token: String, @Field("message") message: String, @Field("flow_id") flow_id: Int):Call<ResponseBody>

    @GET("/message/flow/vendor/")
    fun getVendorMsgFlow(@Header("Authorization") token: String): Call<VendorMsgFlowResponse>

    @GET("/message/flow/customer/")
    fun getCustomerMsgFlow(@Header("Authorization") token: String): Call<List<CustomerMsgFlowResponse>>

    @GET("/vendorpage/public")
    fun getPublicVendorInfo(@Query("vendor_name") vendor_name: String):Call<PublicVendorResponse>

    @FormUrlEncoded
    @POST("/message/startflow/customer/")
    fun startFlowForCustomerWithVendor(@Header("Authorization") token: String, @Field("vendor_name") vendor_name: String):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/message/startflow/vendor/")
    fun startFlowForVendorWithAdmin(@Header("Authorization") token: String, @Field("context") context: String, @Field("object_id") object_id: Int):Call<ResponseBody>

    @Multipart
    @POST("/product/add/")
    fun addProductWithPhoto(@Header("Authorization") token: String,
                            @Part("name") name: RequestBody,
                            @Part("category") category: RequestBody,
                            @Part("description") description: RequestBody,
                            @Part("brand") brand: RequestBody,
                            @Part("stock") stock: RequestBody,
                            @Part("price") price: RequestBody,
                            @Part photo: MultipartBody.Part) : Call<ResponseBody>

    @Multipart
    @POST("/product/edit/")
    fun updateProductWithPhoto(@Header("Authorization") token: String,
                               @Part("id") id: RequestBody,
                               @Part("name") name: RequestBody,
                               @Part("category") category: RequestBody,
                               @Part("description") description: RequestBody,
                               @Part("brand") brand: RequestBody,
                               @Part("stock") stock: RequestBody,
                               @Part("price") price: RequestBody,
                               @Part photo: MultipartBody.Part) : Call<ResponseBody>
    @GET("/notifications/get_notifications")
    fun getNotifications(@Header("Authorization") token: String): Call<List<NotificationResponse>>

    @FormUrlEncoded
    @POST("/notifications/create_alert")
    fun createPriceChangeAlert(@Header("Authorization") token: String,
                             @Field("product_id") productId: Int,
                             @Field("type") type: Int,
                             @Field("value") price: Int):Call<ResponseBody>

    @GET("/notifications/get_alerts")
    fun getPriceAlerts(@Header("Authorization") token: String,
                               @Query("product_id") productId: Int):Call<List<PriceAlertResponse>>

    @FormUrlEncoded
    @POST("/notifications/delete_alert")
    fun deletePriceChangeAlert(@Header("Authorization") token: String,
                               @Field("id") alertId: Int): Call<ResponseBody>

    @FormUrlEncoded
    @POST("/notifications/set_read")
    fun setNotificationRead(@Header("Authorization") token: String, @Field("id") object_id: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/notifications/create_alert")
    fun createStockAlert(@Header("Authorization") token: String,
                               @Field("product_id") productId: Int,
                               @Field("type") type: Int,
                               @Field("value") price: Int):Call<ResponseBody>

}