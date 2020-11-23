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
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import java.util.concurrent.TimeUnit

interface ApiService {
    @POST(ApiEndpoints.LOGIN)
    fun login(@Body loginRequest: LoginRequest): Call<TokenResponse>

    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>

    @GET("/product")
    fun getProductDetails(@Query("id") userId: Int): Call<ProductDetailsResponse>

    @GET("/product/category")
    fun getProductsOfCategory(@Query("name") name: String): Call<List<ProductResponse>>
}