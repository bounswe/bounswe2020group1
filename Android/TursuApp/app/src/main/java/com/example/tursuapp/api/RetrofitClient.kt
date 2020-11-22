package com.example.tursuapp.api

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    //private val AUTH = "Basic"

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor {chain ->
            val original = chain.request()

            val requestBuilder = original.newBuilder()
                .addHeader("Content-Type","application/json")
                .method(original.method, original.body)


            /*
            User.token.let {
                requestBuilder.addHeader("Authorization", "JWT %s".format(User.token))
            }
             */


            val request = requestBuilder.build()
            chain.proceed(request)
        }.build()

    val instance: RequestService by lazy{
        val retrofit = Retrofit.Builder()
            .baseUrl(ApiEndpoints.API_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
            .client(okHttpClient)
            .build()

        retrofit.create(RequestService ::class.java)
    }
}