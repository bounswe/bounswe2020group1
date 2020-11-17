package com.example.tursuapp.api

import com.example.tursuapp.api.requests.*
import com.example.tursuapp.api.responses.*
import io.reactivex.Single
import retrofit2.http.*


interface RequestService {
    @POST(ApiEndpoints.LOGIN)
    fun login(@Body loginRequest: LoginRequest): Single<TokenResponse>
}