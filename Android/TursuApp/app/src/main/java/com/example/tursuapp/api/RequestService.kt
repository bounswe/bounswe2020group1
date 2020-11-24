package com.example.tursuapp.api

import com.example.tursuapp.api.requests.*
import com.example.tursuapp.api.responses.*
import retrofit2.Call
import retrofit2.http.*

/**
interface RequestService {
    @POST(ApiEndpoints.LOGIN)
    fun login(@Body loginRequest: LoginRequest): Call<TokenResponse>

    @GET("/")
    fun getProducts(): Call<List<ProductResponse>>
}
        */