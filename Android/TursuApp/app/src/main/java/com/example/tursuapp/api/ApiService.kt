package com.example.tursuapp.api

import android.content.Context
import com.example.tursuapp.api.requests.LoginRequest
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
import java.util.concurrent.TimeUnit
/**
class ApiService{
    companion object{
        //private var serviceInstance : RequestService? = null

        fun getInstance() : RequestService {
            return Retrofit.Builder()
                    .baseUrl(ApiEndpoints.API_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                    .build()
                    .create(RequestService::class.java)
        }

    }
}
        */
interface ApiService {
    @POST(ApiEndpoints.LOGIN)
    fun login(@Body loginRequest: LoginRequest): Call<TokenResponse>

    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>
}