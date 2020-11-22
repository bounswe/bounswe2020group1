package com.example.tursuapp.api

import android.content.Context
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

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