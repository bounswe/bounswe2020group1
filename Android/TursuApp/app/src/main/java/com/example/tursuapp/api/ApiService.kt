package com.example.tursuapp.api

import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.api.responses.TokenResponse
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*

interface ApiService {
/**
    @POST("/user/login")
    fun login(@Body loginRequest: LoginRequest): Call<TokenResponse>
*/
    @FormUrlEncoded
    @POST("/user/login")
    fun login(@Field("email") email: String,@Field("password") password:String): Call<TokenResponse>
    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>

    @GET("/product")
    fun getProductDetails(@Query("id") userId: Int): Call<ProductDetailsResponse>

    @GET("/product/category")
    fun getProductsOfCategory(@Query("name") name: String): Call<List<ProductResponse>>

    @GET("/search")
    fun getSearchedProducts(@Query("search_type") search_type: String,@Query("search_string") search_string: String): Call<List<ProductResponse>>

    @FormUrlEncoded
    @POST("/product/add/")
    fun addProduct(@Header("Authorization") token: String,
                   @Field("category") category: String,
                   @Field("name") name:String,
                   @Field("brand") brand:String,
                   @Field("stock") stock:Int,
                   @Field("price") price:Float,
                   @Field("photo") photo:String,
                   @Field("description") description:String): Call<ResponseBody>
    //@Part("photo") photo:MultipartBody.Part)
    //<auth_token> must be added

}