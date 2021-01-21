package com.example.tursuapp.api

import com.example.tursuapp.api.responses.*
import okhttp3.MultipartBody
import retrofit2.http.Multipart;
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*


interface ApiService {
    @FormUrlEncoded
    @POST("/user/login")
    fun login(@Field("email") email: String, @Field("password") password: String): Call<LoginResponse>

    @FormUrlEncoded
    @POST("/user/signup")
    fun signup(@Field("first_name") first_name: String,
               @Field("last_name") last_name: String,
               @Field("username") username: String,
               @Field("email") email: String,
               @Field("password") password: String): Call<LoginResponse>

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
                     @Field("city") city: String): Call<LoginResponse>

    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>
    @GET("/customerpage")
    fun getCustomerProfileInfo(@Header("Authorization") token: String): Call<ProfileInfoResponse>

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
                   @Field("name") name:String,
                   @Field("category") category: String,
                   @Field("description") description:String,
                   @Field("brand") brand:String,
                   @Field("stock") stock:Int,
                   @Field("price") price:Float,
                   @Field("photo") photo:String): Call<ResponseBody>

    @GET("/recommendation/recommendation_pack")
    fun getRecommendedProducts(@Header("Authorization") token: String): Call<RecommendationPackResponse>

    @FormUrlEncoded
    @POST("/comment/")
    fun addComment(@Header("Authorization") token: String,
                   @Field("product_id") product_id: Int,
                   @Field("text") text: String,
                   @Field("rating") rating: Int): Call<ResponseBody>


    @POST("/product/add/")
    @Multipart
    fun addProductWithPhoto(@Header("Authorization") token: String,
                            @Part("name") name: RequestBody ,
                            @Part("category") category: RequestBody ,
                            @Part("description") description: RequestBody ,
                            @Part("brand") brand: RequestBody ,
                            @Part("stock") stock: RequestBody ,
                            @Part("price") price: RequestBody ,
                            @Part photo: MultipartBody.Part
    ) : Call<ResponseBody>




}

