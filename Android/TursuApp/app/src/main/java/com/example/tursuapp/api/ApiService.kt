package com.example.tursuapp.api

import android.content.Context
import com.example.tursuapp.api.requests.LoginRequest
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.api.responses.TokenResponse
import okhttp3.OkHttpClient
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
    fun login(@Field("email") email: String,@Field("password") password:String): Call<TokenResponse>
    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>

    @GET("/product")
    fun getProductDetails(@Query("id") userId: Int): Call<ProductDetailsResponse>

    @GET("/product/category")
    fun getProductsOfCategory(@Query("name") name: String): Call<List<ProductResponse>>

    @GET("/search")
    fun getSearchedProducts(@Query("search_type") search_type: String,@Query("search_string") search_string: String): Call<List<ProductResponse>>
}