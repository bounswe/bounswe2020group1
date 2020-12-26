package com.example.tursuapp.api

import android.content.Context
import com.example.tursuapp.api.requests.LoginRequest
import com.example.tursuapp.api.responses.*
import okhttp3.OkHttpClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface ApiService {
    /**
    @POST("/user/login")
    fun login(@Body loginRequest: LoginRequest): Call<TokenResponse>
     */
    @FormUrlEncoded
    @POST("/user/login")
    fun login(@Field("email") email: String, @Field("password") password: String): Call<TokenResponse>

    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>

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
    fun addList(@Header("Authorization") token: String,@Field("list_name") list_name: String): Call<AddListResponse>

    @GET("/shoppinglist/getlists/")
    fun getLists(@Header("Authorization") token: String): Call<List<String>>

    @FormUrlEncoded
    @POST("/shoppinglist/addtolist/")
    fun addToList(@Header("Authorization") token: String,@Field("list_name") list_name: String,@Field("product_id") product_id: Int): Call<AddToListResponse>

    @FormUrlEncoded
    @POST("/shoppinglist/deletelist/")
    fun deleteList(@Header("Authorization") token: String,@Field("list_name") list_name: String): Call<DeleteListResponse>

    @FormUrlEncoded
    @POST("/shoppinglist/deletefromlist/")
    fun deleteFromList(@Header("Authorization") token: String,@Field("list_name") list_name: String,@Field("product_id") product_id: Int): Call<DeleteFromListResponse>

    @FormUrlEncoded
    @POST("/shoppinglist/products/")
    fun getListedProducts(@Header("Authorization") token: String,@Field("list_name") list_name: String): Call<List<ProductResponse>>

    @GET("/order/get_orders/")
    fun getOrdersOfCustomer(@Header("Authorization") auth_token :String):Call<List<List<CustomerOrderResponse>>>

    @FormUrlEncoded
    @POST("/order/set_delivered/")
    fun orderSetDelivered(@Header("Authorization") auth_token :String,@Field("order_id") orderId: Int):Call<ResponseBody>

    @FormUrlEncoded
    @POST("/order/cancel_order/")
    fun cancelOrder(@Header("Authorization") auth_token :String,@Field("order_id") orderId: Int):Call<ResponseBody>

    @GET("/vendorpage")
    fun getProductsOfVendor(@Header("Authorization") token :String):Call<VendorDataResponse>

    @FormUrlEncoded
    @POST("/product/delete/")
    fun deleteProduct(@Header("Authorization") token: String,@Field("id") id: Int): Call<DeleteProductResponse>

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
                    @Field("photo") photo: String): Call<UpdateProductResponse>
                    //image file @multipart


}